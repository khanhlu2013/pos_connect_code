define(
    [
         'lib/async'
        ,'lib/object_store/get_os'
        ,'app/sale/pending_scan/pending_scan_lst_getter'
        ,'app/sale/pending_scan/Pending_scan'
    ]
    ,function
    (
         async
        ,get_os
        ,ps_lst_getter
        ,Pending_scan
    )
{
    function execute_update_or_insert(store_idb,ps_item,callback){
        var ps_os = get_os.get_pending_scan_os(false/*readwrite*/,store_idb);
        var request;
        if(ps_item.key !==null){
            request = ps_os.put(ps_item,ps_item.key);
        }else{
            request = ps_os.put(ps_item);
        }
        
        request.onsuccess = function(event){
            callback(null/*error*/);
        }
        request.onerror= function(event){
            var error = "error with code: " + evt.target.errorCode
            callback(error);
        }
    }

    function is_ps_same_kind(ps1,ps2){
        if(ps1.sp_doc_id == null && ps2.sp_doc_id == null){
            return ps1.non_product_name === ps2.non_product_name;
        }else if(ps1.sp_doc_id != null && ps2.sp_doc_id !=null){
            return ps1.sp_doc_id === ps2.sp_doc_id;
        }else{
            return false;
        }
    }

    function calculate_if_insert_new_or_update_last_item(inserting_ps,ps_lst,callback){
        /*
            If the current inserting item is not a product then store_product will be null. 
            In this case, we will use non_product_name and non_product_price instead
        */

        //get last item
        var last_item = null;
        var ps_lst_len = ps_lst.length;
        if(ps_lst_len >0){
            last_item = ps_lst[ps_lst_len-1];
        }

        //calculate is_insert_or_update
        var is_insert_or_update;
        if(last_item === null){
            is_insert_or_update = true/*insert*/
        }else{
            var is_same_kind = is_ps_same_kind(last_item,inserting_ps);
            var is_same_price = last_item.price === inserting_ps.price;
            var is_same_discount = (last_item.discount==undefined||last_item.discount==null||last_item.discount==0);
            var is_same_qty_sign = inserting_ps.qty * last_item.qty > 0;//we will not combine negative and positive. only if both is pos or neg
            var is_update = is_same_kind && is_same_price && is_same_discount && is_same_qty_sign

            is_insert_or_update = !is_update;
        }

        //calculate item according to is_insert_or_update
        var item_to_be_insert_or_update;
        if(is_insert_or_update){
            //insert
            item_to_be_insert_or_update = inserting_ps;
        }else{
            //update
            item_to_be_insert_or_update = last_item;
            item_to_be_insert_or_update.qty += inserting_ps.qty;
        }

        //return
        callback(null/*error*/,item_to_be_insert_or_update);
    }

    return function(store_idb,inserting_ps,callback){
        /*
            DESC
            PARAM
            POST
        */

        var ps_lst_getter_b = ps_lst_getter.bind(ps_lst_getter,store_idb);
        var ciinouli = calculate_if_insert_new_or_update_last_item;
        var ciinouli_b = ciinouli.bind(ciinouli,inserting_ps);
        var execute = execute_update_or_insert;
        var execute_b = execute.bind(execute,store_idb);

        async.waterfall([ps_lst_getter_b,ciinouli_b,execute_b],function(error,result){
            callback(error)
        })
    };
});