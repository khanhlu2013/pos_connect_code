define(
    [
         'pouch_db'
        ,'app/sale/sale_finalizer/receipt_lst_getter'
        ,'constance'
        ,'lib/async'
        ,'lib/db/couch_db_util'
        ,'app/store_product/store_product_getter'
        ,'lib/db/index_db_util'
        ,'lib/db/db_util'


    ],
    function
    (
         Pouch_db
        ,receipt_lst_getter
        ,constance
        ,async
        ,couch_db_util
        ,sp_getter
        ,index_db_util
        ,db_util
    )
{
    function ask_server_to_process_sale_data(callback){

        $.ajax({
             url : "/sale/process_data"
            ,type : "POST"
            ,dataType: "json"
            ,data : null
            ,success : function(data,status_str,xhr) {
                callback(null/*error*/,data);
            }
            ,error : function(xhr,status_str,err) {
                callback(xhr)
            }
        });
    }

    function clean_up_sale_data(receipt_lst,store_idb,callback){
        if(receipt_lst.length == 0)
        {
            callback('receipt list is empty');
            return;
        }

        var func_lst = new Array();

        for(var i = 0;i<receipt_lst.length;i++){
            var delete_doc_b = index_db_util.delete_item.bind(index_db_util.delete_item,store_idb,receipt_lst[i].key);
            
            func_lst.push(delete_doc_b);
        }

        async.series(func_lst,function(error,results){
            callback(error)
        });
    }

    function sync_receipt(store_id,couch_server_url,callback){
        function receipt_filter(doc){
            //we only send sale data to server.        
            return doc.d_type === constance.RECEIPT_TYPE;
        }
        var store_db_url = couch_db_util.get_db_url(couch_server_url,store_id);
        Pouch_db.replicate(db_util.get_store_db_name(store_id)/*from local source*/, store_db_url/*to remote target*/,{filter:receipt_filter},function(err,resp){
            callback(err);                
        });
    }

    return function (store_idb,store_pdb,store_id,couch_server_url,callback){
        /*
            we use pouchdb replicate with a filter to sync receipt. then delete sale data to simulate a push, or copy paste receipt to couch.
        */
        var receipt_lst_getter_b = receipt_lst_getter.bind(receipt_lst_getter,store_idb);
        async.waterfall([receipt_lst_getter_b],function(error,result){
            if(error){
                callback(error);
                return;
            }

            var receipt_lst = result;
            if(receipt_lst.length == 0){
                callback('no sale data to push'/*error*/)
                return;
            }


            //3 step to siumate push receipt: 
            var sync_receipt_b = sync_receipt.bind(sync_receipt,store_id,couch_server_url);
            var clean_up_sale_data_b = clean_up_sale_data.bind(clean_up_sale_data,receipt_lst,store_idb);
            async.waterfall(
                [
                     sync_receipt_b
                    ,clean_up_sale_data_b
                    ,ask_server_to_process_sale_data
                ]
                ,function(error,result){
                    callback(error,result);
                }
            );
        });
    }
});