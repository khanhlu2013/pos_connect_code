define(
    [
         'lib/db/pouchdb'
        ,'app/receipt/receipt_lst_getter'
        ,'constance'
        ,'lib/async'
        ,'lib/db/couch_db_util'
        ,'app/store_product/store_product_getter'
        ,'lib/db/index_db_util'
        ,'lib/db/db_util'
        ,'lib/object_store/get_os'
        ,'constance'
        ,'lib/db/index_db_util'
        ,'lib/db/pouch_db_util'
        ,'app/local_db_initializer/oneshot_sync'
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
        ,get_os
        ,constance
        ,index_db_util
        ,pouch_db_util
        ,oneshot_sync

    )
{
    var ERROR_NO_SALE_DATA_TO_PUSH = 'There is no sale data to push';
    var STORE_ID = null;
    var COUCH_SERVER_URL = null;

    function delete_local_create_sp(store_idb,callback){
        var sp_getter_b = sp_getter.by_product_id_is_null.bind(sp_getter.by_product_id_is_null,store_idb);
        async.waterfall([sp_getter_b],function(error,result){

            var delete_func_lst = []
            var offline_sp_lst = result;
            
            if(offline_sp_lst.length == 0){
                callback(null,false);
                return;
            }

            for(var i = 0;i<offline_sp_lst.length;i++){
                var func = index_db_util.delete_item.bind(index_db_util.delete_item,store_idb,offline_sp_lst[i].key)
                delete_func_lst.push(func);
            }

            async.series(delete_func_lst,function(error,result){
                callback(error,true);
            });
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

    function ask_server_to_create_sp(is_nessesary,callback){
        if(!is_nessesary){
            callback(null);
            return;
        }

        $.ajax({
             url : "/product/create_new_sp_for_receipt_ln"
            ,type : "POST"
            ,dataType : "json"
            ,data : null
            ,success: function(data,status_str,xhr){
                var new_create_sp_count = data;

                if(new_create_sp_count>0){
                    var oneshot_sync_b = oneshot_sync.bind(oneshot_sync,STORE_ID,COUCH_SERVER_URL);
                    async.waterfall([oneshot_sync_b],function(error,result){
                        callback(error,new_create_sp_count);
                    });
                }else{
                    callback('Bug: no offline product is created');
                }
                
            }
            ,error : function(xhr,status_str,err){
                callback(xhr);
            }
        });
    }

    function exe_if_nessesary(store_id,couch_server_url,callback){

        /*
            when view receipt record, we will check if receipt pushing is nessesary based on if we have local db or not.
        */
        STORE_ID = store_id;
        COUCH_SERVER_URL = couch_server_url;

        var is_store_idb_exist_b = db_util.is_store_idb_exist.bind(db_util.is_store_idb_exist,store_id);
        async.waterfall([is_store_idb_exist_b],function(error,result){
            if(error){
                callback(error);
            }

            var store_idb = result;
            if(store_idb == null){
                callback(null);
                return;
            }

            var store_pbd = pouch_db_util.get_store_db(store_id);
            var exe_b = exe.bind(exe,store_idb,store_pbd,store_id,couch_server_url);
            async.waterfall([exe_b],function(error,result){
                if(error == ERROR_NO_SALE_DATA_TO_PUSH){
                    error = null;
                }

                callback(error);
            })
        });
    }

    function exe(store_idb,store_pdb,store_id,couch_server_url,callback){
        STORE_ID = store_id;
        COUCH_SERVER_URL = couch_server_url;

        var receipt_lst_getter_b = receipt_lst_getter.bind(receipt_lst_getter,store_idb);
        async.waterfall([receipt_lst_getter_b],function(error,result){
            if(error){
                callback(error);
                return;
            }

            var receipt_lst = result;
            if(receipt_lst.length == 0){
                callback(ERROR_NO_SALE_DATA_TO_PUSH/*error*/)
                return;
            }

            receipt_lst = result;
            var sync_receipt_b = sync_receipt.bind(sync_receipt,store_id,couch_server_url);
            var clean_up_sale_data_b = clean_up_sale_data.bind(clean_up_sale_data,receipt_lst,store_idb);
            var delete_local_create_sp_b = delete_local_create_sp.bind(delete_local_create_sp,store_idb);
            async.waterfall(
                [
                     sync_receipt_b
                    ,clean_up_sale_data_b
                    ,delete_local_create_sp_b
                    ,ask_server_to_create_sp
                ]
                ,function(error,result){
                    callback(error,receipt_lst.length);
                }
            );
        });
    }

    return{
         exe:exe    
        ,ERROR_NO_SALE_DATA_TO_PUSH :  ERROR_NO_SALE_DATA_TO_PUSH
        ,sync_receipt:sync_receipt //just to be able to spy on jasmine test
        ,exe_if_nessesary:exe_if_nessesary

    };
});