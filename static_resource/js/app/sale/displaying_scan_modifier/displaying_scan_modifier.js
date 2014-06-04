define(
    [
         'app/sale/pending_scan/pending_scan_lst_getter'
        ,'lib/async'
        ,'lib/object_store/get_os'
        ,'app/sale/pending_scan/pending_scan_lst_compressor'
        ,'app/sale/pending_scan/pending_scan_util'
        ,'app/sale/displaying_scan/displaying_scan_computer'

    ]
    ,function
    (
         ps_lst_getter
        ,async
        ,get_os
        ,ps_lst_compressor
        ,ps_util
        ,ds_computer
    )
{
    var MM_LST = null;
    
    function calculate_begin_index(ds_lst,dynamic_,static_){
        return calculate_index(ds_lst,dynamic_ - static_) + 1;
    }

    function calculate_end_index(ds_lst,dynamic_,static_){
        return calculate_index(ds_lst,dynamic_);
    }

    function calculate_index(ds_lst,qty){
        var index;
        var temp = 0;

        if(qty == 0){
            return -1;
        }

        for(var i = 0;i<ds_lst.length;i++){
            temp += Math.abs(ds_lst[i].qty);
        
            if(temp<qty){
                continue;
            }else if(temp == qty){
                index = i;
                break;
            }else{
                break;//can not find matching begin index
            }
        }

        return index;
    }

    function validate_associate_ds_lst(ps_item,ds_lst){
        var ds_lst_len = ds_lst.length;
        if(ds_lst_len == 0){
            return false;
        }

        var is_valid = true;

        for(var i = 0;i<ds_lst.length;i++){
            if(ps_item.sp_doc_id == null){
                //NON_PRODUCT
                if(ds_lst[i].store_product !=null){
                    is_valid = false;
                    break;
                }                    
            }
            else{
                //PRODUCT
                if(ps_item.sp_doc_id !== ds_lst[i].store_product._id){
                    is_valid = false;
                    break;
                }
            }                 
        }

        return is_valid;
    }

    function _match(ds_lst,ps_lst,callback){
        /*
            return a dictionary : key is pending scan, and value is the associated ds_lst
        */
        var result = new Array();

        var dynamic_ = 0;
        var error = null;
        for(var ps_index = 0;ps_index<ps_lst.length;ps_index ++){
            //calculate begining and ending index
            var cur_ps = ps_lst[ps_index];
            var static_ = Math.abs(cur_ps.qty);
            dynamic_ += static_;
            var begin_index = calculate_begin_index(ds_lst,dynamic_,static_);
            var end_index = calculate_end_index(ds_lst,dynamic_,static_);

            if(begin_index > end_index){
                error = "begin index > end index";
                break;
            }

            //calculate associated_ds_lst
            var associate_ds_lst = null;
            if(begin_index!=null && end_index!=null){
                associate_ds_lst = new Array();
                for(var ds_index=begin_index;ds_index<=end_index;ds_index++){
                    associate_ds_lst.push(ds_lst[ds_index]);
                }
            }

            //validate associated_ds_lst
            var associated_lst_is_valid = false;
            if(associate_ds_lst){
                associated_lst_is_valid = validate_associate_ds_lst(cur_ps,associate_ds_lst)
            }

            //return
            if(associated_lst_is_valid){
                result.push({key:cur_ps,value:associate_ds_lst})
            }else{
                error = "associate ds list is invalid";
                break;
            }
        }

        if(error!=null){
            callback('can not match with internal data: ' + error/*error*/);
        }else{
            callback(null/*error*/,result);
        }
    }

    function execute_item(ps_os,ps_item,instruction,callback){
        if(instruction.is_delete){
            ps_os.delete(ps_item.key).onsuccess=function(event){
                callback(null/*error*/);
            }   
        }else{
            ps_item.price = instruction.price;
            ps_item.qty = instruction.qty;
            ps_os.put(ps_item).onsuccess = function(event){
                callback(null/*error*/);
            }
        }
    }

    function execute_on(ps_item,instruction){
        /*
            PARAM: ps_item: pending scan item that is use for this instruction to be executed on.
        */
        if(instruction.is_delete){
            return null;
        }else{
            var qty_delta = instruction.new_qty - ps_item.qty;
            ps_item.qty += qty_delta;
            ps_item.price = instruction.new_price;
            ps_item.discount = instruction.new_discount;
            return ps_item;
        }
    }

    function execute(store_idb,ds_index,instruction,matched_lst,callback){
        /*
            NOTE: it is a rare operation that this code should be solid for a good user experience
            DESC: 
                Some fact to consider to make it easier to understand what is going on:
                    . pending scan is store in compressed form (it doesnt make sens to store 100 line in indexeddb when we scan 100 item)
                    . displaying scan (calculated on the fly for displaying purpose, and receipt_ln purpose) also in compressed form. however, because of the mm deal,
                        lets say 100 pending scan item which is store with 1 line can be break-up to  3 line forexample (50 for line1, 40 for line2, and 10 for line 3
                        corresponding to the deal.)
                    . when we modify ds_lst, we have an ds_index, which need to be calculated to ps_index
    
            PRE: this algorithm only cover the case where (ps:ds) is (1:1)
                    the case of (ps:ds) = (1:n) only take place when we implement the deal feature. 
                    by then we will come back here to take care of possible bug causing from removal/insert operation 
                    destroy the ordering of ps_lst
            POST: no result is return to the callback

            ALGORITHM: 
                find out index of pending scan list
                apply


        */
        //calculate ps_index to pin point the ps_item that need to be modify.
        var ps_index = ds_index; //we will need to upgrade this when we implement deal

        var ps_item_to_modify = matched_lst[ps_index].key;
        var ps_item_key_to_be_modify = ps_item_to_modify.key;
        var modified_ps_item = execute_on(ps_item_to_modify,instruction);

        if(modified_ps_item!=null){
            //UPDATE
            var update_b = ps_util.update_ps.bind(ps_util.update_ps,store_idb,ps_item_to_modify,ps_item_key_to_be_modify);
            async.waterfall([update_b],function(error,result){
                if(error){
                    callback(error);
                }else{
                    var func_lst = new Array();

                    var has_below = (ps_index != matched_lst.length-1);
                    if(has_below){
                        var compressing_index = ps_index;
                        var compress_below_func = ps_lst_compressor.bind(ps_lst_compressor,compressing_index,store_idb);
                        func_lst.push(compress_below_func);
                    }
                    var has_above = (ps_index != 0);
                    if(has_above){
                        var compressing_index = ps_index - 1;
                        var compress_above_func = ps_lst_compressor.bind(ps_lst_compressor,compressing_index,store_idb);
                        func_lst.push(compress_above_func);
                    }

                    if(func_lst.length !=0){
                        async.waterfall(func_lst,function(error,result){
                            callback(error);
                        });
                    }else{
                        callback(error);
                    }
                }
            });
        }
        else{
            //DELETE
            var pre_condition_for_compress = (ps_index!=0 && ps_index != matched_lst.length-1);
            var delete_b = ps_util.delete_ps.bind(ps_util.delete_ps,store_idb,ps_item_key_to_be_modify);
            async.waterfall([delete_b],function(error,result){
                if(error){callback(error);}
                else if(pre_condition_for_compress){
                    var posssible_compress_index = ps_index-1;
                    var ps_lst_compressor_b = ps_lst_compressor.bind(ps_lst_compressor_b,posssible_compress_index,store_idb);
                    async.waterfall([ps_lst_compressor_b],function(error,result){
                        callback(error);
                    });
                }else{
                    callback(null/*error*/);
                }
            });
        }
    }

    return function(tax_rate,mm_lst,store_idb,ds_index,instruction,callback){
        MM_LST = mm_lst;
        var ps_lst_getter_b = ps_lst_getter.bind(ps_lst_getter,store_idb);
        async.waterfall([ps_lst_getter_b],function(error,result){
            if(error!=null) {
                callback(error);
            }
            var ps_lst = result;
            var ds_computer_b = ds_computer.bind(ds_computer,tax_rate,MM_LST,store_idb,ps_lst);
            async.waterfall([ds_computer_b],function(error,result){
                if(error!=null){
                    callback(error);
                }
                var ds_lst = result;

                var match_b = _match.bind(_match,ds_lst,ps_lst);
                var execute_b = execute.bind(execute,store_idb,ds_index,instruction)
                
                async.waterfall(
                    [
                         match_b
                        ,execute_b
                    ]
                    ,function(error,result){
                        callback(error);
                    }
                );                 
            });
        });
    }
});