define(
    [
         'lib/async'
        ,'app/sale/displaying_scan/displaying_scan_lst_getter'
        ,'app/sale/pending_scan/Pending_scan'
        ,'app/sale/pending_scan/pending_scan_inserter'
        ,'app/sale/discounter/Discount_input'

    ]
    ,function
    (
         async
        ,ds_lst_getter
        ,Pending_scan
        ,ps_inserter
        ,Discount_input
    )
{
    var MM_LST;

    return function(mm_lst,store_idb,discount_input_str,callback){
        MM_LST = mm_lst;
        var discount_input = new Discount_input(discount_input_str);
        
        if(!discount_input.is_valid()){
            callback('input is not valid'/*error*/,null/*result*/);
        }else{
            if(discount_input.is_percentage){
                var ds_lst_getter_b = ds_lst_getter.bind(ds_lst_getter,MM_LST,store_idb);
                async.waterfall([ds_lst_getter_b],function(error,result){
                    var ds_lst = result;
                    if(ds_lst.length == 0){
                        callback('Scan list is emtpy. Can not take percentage discount'/*error*/);
                    }else{
                        var discount_amount = discount_input.get_discount(ds_lst);
                        var inserting_ps = new Pending_scan(null/*key*/,-1/*qty*/,discount_amount,null/*discount*/,null/*sp_doc_id*/,"discount"/*non_product_name*/);
                        var ps_inserter_b = ps_inserter.bind(ps_inserter,store_idb,inserting_ps);
                        async.waterfall([ps_inserter_b],function(error,result){
                            callback(error);
                        });
                    }
                });
            }else{
                var discount_amount = discount_input.get_discount(null/*ds_lst*/);
                var inserting_ps = new Pending_scan(null/*key*/,-1/*qty*/,discount_amount,null/*discount*/,null/*sp_doc_id*/,"discount"/*non_product_name*/);
                var ps_inserter_b = ps_inserter.bind(ps_inserter,store_idb,inserting_ps);
                async.waterfall([ps_inserter_b],function(error,result){
                    callback(error);
                });
            }            
        }
    }
});