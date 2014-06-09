define(
    [
         'lib/async'
        ,'app/sale/displaying_scan/displaying_scan_lst_getter'
        ,'app/sale/voider/voider'
        ,'lib/error_lib'
        ,'app/sale/pending_scan/pending_scan_inserter'
        ,'app/sale/pending_scan/Pending_scan'
    ]
    ,function
    (
         async
        ,ds_lst_getter 
        ,voider
        ,error_lib
        ,ps_inserter
        ,Pending_scan
    )
{
    var MM_LST = null;
    var TAX_RATE = null;
    var STORE_IDB = null;


    function compress(ds_lst,callback){
        var result = [];

        for(var i = 0;i<ds_lst.length;i++){
            if(i == 0){
                result.push(ds_lst[0]);
                continue;
            }

            var last_item = result[result.length-1];
            var cur_item = ds_lst[i];

            if(last_item.store_product == null || cur_item.store_product == null){
                result.push(cur_item);
                continue;
            }            

            if(
                   last_item.store_product.product_id === cur_item.store_product.product_id
                && last_item.price === cur_item.price
                && last_item.discount === cur_item.discount
            ){
                last_item.qty += cur_item.qty;
            }else{
                result.push(cur_item);
            }
        }

        callback(null,result)
    }


    function exe_instruction(ds_index,instruction,ds_lst,callback){
        /*
            PARAM: 
                ds_index: index to exe instruction
                instruction: contain information to modify displaying scan item
                ds_lst: a list of ds before exe instruction

            RETURN (to callback) a ds_lst after execute instruction on ds_index
        */
        if(instruction.is_delete){
            ds_lst.splice(ds_index,1);
        }else{
            var ds = ds_lst[ds_index];
            ds.qty = instruction.new_qty;
            ds.price = instruction.new_price;
            ds.discount = instruction.new_discount;
        }

        callback(null,ds_lst);
    }


    function refresh_ps_os(commpressed_ds_lst,callback){
        /*
            DESC: this method will clear out all pending scan, then insert into pending scan os based on commpressed_ds_lst
        */

        //CLEAR PS
        var func_lst = [];
        var voider_b = voider.bind(voider,STORE_IDB,false/*not toogle is_use_value_customer_price*/);
        async.waterfall([voider_b],function(error,result){
            if(error){
                error_lib.alert_error(error);
                return;
            }
        });
        func_lst.push(voider_b);
        
        //RE-INSERT PS
        for(var i = 0;i<commpressed_ds_lst.length;i++){
            var ds = commpressed_ds_lst[i];
            var sp_doc_id = (ds.store_product == null ? null : ds.store_product._id);
            var ps = new Pending_scan(null/*key*/,ds.qty/*qty*/,ds.price,ds.discount,sp_doc_id,ds.non_product_name)   
            var func_b = ps_inserter.bind(ps_inserter,STORE_IDB,ps);
            func_lst.push(func_b);
        }
        async.series(func_lst,function(error,result){
            callback(error);
        });
    }

    return function(tax_rate,mm_lst,store_idb,ds_index,instruction,callback){
        MM_LST = mm_lst;
        TAX_RATE = tax_rate;
        STORE_IDB = store_idb;

        var ds_lst_getter_b = ds_lst_getter.bind(ds_lst_getter,TAX_RATE,MM_LST,STORE_IDB);
        var exe_instruction_b = exe_instruction.bind(exe_instruction,ds_index,instruction)

        async.waterfall([ds_lst_getter_b,exe_instruction_b,compress,refresh_ps_os],function(error,result){
            callback(error);
        })
    }
});