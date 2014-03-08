define(
    [
         'lib/async'
        ,'app/sale/displaying_scan_modifier/displaying_scan_modifier'
        ,'app/sale/displaying_scan_modifier/Instruction'
        ,'app/sale/displaying_scan/displaying_scan_lst_getter'
        ,'lib/number/number'
        ,'app/sale/displaying_scan/displaying_scan_util'
        ,'app/sale/displaying_scan/displaying_scan_lst_and_tax_getter'
        ,'app/store_product/store_product_updator'
    ]
    ,function(
         async
        ,ds_modifier
        ,Instruction
        ,ds_lst_getter
        ,number
        ,ds_util
        ,ds_lst_and_tax_getter
        ,sp_updator
    )
{
    var column_name = ["qty", "product", "price", "line total", "X"];

    function exe_instruction(store_idb,ds_index,instruction,ds_lst,table,tax_rate){
        var ds_modifier_b = ds_modifier.bind(ds_modifier,store_idb,ds_index,instruction);
        var ds_lst_getter_b = ds_lst_getter.bind(ds_lst_getter,store_idb);
        async.waterfall([ds_modifier_b,ds_lst_getter_b],function(error,result){
            if(error){
                alert(error);
            }else{
                var new_ds_lst = result;
                ds_2_ui(store_idb,table,new_ds_lst,tax_rate);
            }
        });
    }

    function _item_2_table(ds_index,ds_lst,tax_rate,table,store_idb){
        var displaying_scan = ds_lst[ds_index];
        var tr = table.insertRow(-1);
        var td;
        
        // ["qty", "product", "price", "line total", "X"]

        //-QTY
        td = tr.insertCell(-1);
        td.innerHTML = displaying_scan.qty;
        td.addEventListener("click", function() {
            var new_qty = number.prompt_integer('enter qty',displaying_scan.qty,'wrong input');
            if(new_qty == null){
                return;
            }
            var instruction = new Instruction(new_qty==0/*is_delete*/,new_qty,displaying_scan.price,displaying_scan.discount);
            exe_instruction(store_idb,ds_index,instruction,ds_lst,table,tax_rate);
        });

        //-PRODUCT
        td = tr.insertCell(-1);
        td.innerHTML = displaying_scan.get_name();
        td.addEventListener("click", function() {
            if(displaying_scan.store_product==null){
                return;
            }

            if(!displaying_scan.store_product.create_offline){
                var sp_updator_b = sp_updator.exe.bind(sp_updator.exe,displaying_scan.store_product.product_id,store_idb)
                async.waterfall([sp_updator_b],function(error,result){
                    if(error){
                        if(error == sp_updator.ERROR_SP_UPDATOR_CANCEL){
                            //do nothing 
                            return;
                        }else{
                            alert(error);
                            return;                            
                        }

                    }

                    var ds_lst_getter_b = ds_lst_getter.bind(ds_lst_getter,store_idb);
                    async.waterfall([ds_lst_getter_b],function(error,result){
                        if(error){
                            alert(error);
                        }else{
                            var new_ds_lst = result;
                            ds_2_ui(store_idb,table,new_ds_lst,tax_rate);
                        }
                    });
                });                
            }else{
                alert('to be continue xxx')
            }
            
        });

        //-PRICE
        td = tr.insertCell(-1);
        td.innerHTML = displaying_scan.get_discount_price();
        td.addEventListener("click", function() {
            var msg = ""
            msg += 'price info:' + '\n';
            msg += '---------' + '\n';
            msg += 'regular price: ' + displaying_scan.price + '\n'
            var crv = displaying_scan.get_crv();
            if(crv){
                msg += 'crv: ' + displaying_scan.get_crv() + '\n'
            }
            var tax = displaying_scan.get_tax(tax_rate);
            msg += 'tax: ' + tax + '\n'
            msg += 'out the door price: ' + displaying_scan.get_out_the_door_price(tax_rate);
            msg += '\n\n\n';    
            msg += 'enter new regular price\n';
            msg += '-------------------';
            var new_price = number.prompt_positive_double(msg,displaying_scan.price,'wrong input');
            if(new_price == null){
                return;
            }
            var instruction = new Instruction(false/*is_delete*/,displaying_scan.qty,new_price,displaying_scan.discount);
            exe_instruction(store_idb,ds_index,instruction,ds_lst,table,tax_rate);
        });

        //-LINE TOTAL
        td = tr.insertCell(-1);
        td.innerHTML = displaying_scan.get_line_total(tax_rate);

        //-REMOVE
        td = tr.insertCell(-1);
        td.innerHTML = 'x'
        td.addEventListener("click", function() {
            var instruction = new Instruction(true/*delete*/,null/*new_qty*/,null/*new_price*/,null/*new_discount*/);
            exe_instruction(store_idb,ds_index,instruction,ds_lst,table,tax_rate);
        });
    }

    function ds_2_ui(store_idb,table,ds_lst,tax_rate){
        while(table.hasChildNodes())
        {
           table.removeChild(table.firstChild);
        }

        var tr = table.insertRow(); var td;

        //table column
        for( var i = 0;i<column_name.length;i++){
            td = tr.insertCell(-1);
            td.innerHTML = column_name[i];
        }

        //table data
        for (var i = 0;i<ds_lst.length;i++){
            _item_2_table(i,ds_lst,tax_rate,table,store_idb)
        }

        //total button
        total_button = document.getElementById('total_button');
        var computed_total = ds_util.get_line_total(ds_lst,tax_rate);
        total_button.innerHTML = computed_total;
    }

    return function(store_idb,table,callback){
        var ds_lst_and_tax_getter_b = ds_lst_and_tax_getter.bind(ds_lst_and_tax_getter,store_idb);
        async.waterfall([ds_lst_and_tax_getter_b],function(error,result){
            var ds_lst = result[0];
            var tax_rate = result[1];
            ds_2_ui(store_idb,table,ds_lst,tax_rate);

            callback(error,table);
        });
    }
});

