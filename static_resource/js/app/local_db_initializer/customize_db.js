define(
    [
         'constance'
        ,'lib/db/couch_db_util'
        ,'lib/async'
    ],
    function
    (
         constance
        ,couch_db_util
        ,async
    )
    {
        function approve_product_db_customizer(callback){
            var version = 2;//we are upgrading pouchdb after initial_sync. We use version 2 instead of 1
            var request = indexedDB.open(couch_db_util.pouch_db_name_to_index_db_name(constance.APPROVE_PRODUCT_DB_NAME),version);
            request.onupgradeneeded= function(e) {
                var db = event.target.result;
                
                //create index
                var os = e.currentTarget.transaction.objectStore(constance.MAIN_OS_NAME);
                
                os.createIndex(constance.DOCUMENT_TYPE_INDEX,"d_type",{unique:false,multiEntry:false});
                os.createIndex(constance.SKU_INDEX_NAME,"sku_lst",{unique:false,multiEntry:true});
                os.createIndex(constance.PRODUCT_ID_INDEX_NAME,"product_id",{unique:false,multiEntry:false});
                os.createIndex(constance.DOCUMENT_ID_INDEX_NAME,"_id",{unique:false});  //there are multiple revision for the same id
                                                                                        //this index is need to retrieve tax, deal ... document
            }
            request.onsuccess = function(e) {
                var db = request.result;
                callback(null/*error*/,db);
            }
            request.onerror = function(e) {
                callback('error in customizing db');
            }            
        }

        function store_db_customizers(store_db_name,callback){
            var version = 2;//we are upgrading pouchdb after initial_sync. We use version 2 instead of 1
            var request = indexedDB.open(couch_db_util.pouch_db_name_to_index_db_name(store_db_name),version);
            request.onupgradeneeded= function(e) {
                var db = event.target.result;
                
                //create os
                db.createObjectStore(constance.PENDING_SCAN_OS_NAME, { autoIncrement : true });

                //create index
                var os = e.currentTarget.transaction.objectStore(constance.MAIN_OS_NAME);
                os.createIndex(constance.CREATE_OFFLINE_INDEX_NAME,"create_offline",{unique:false,multiEntry:false});
                os.createIndex(constance.DOCUMENT_TYPE_INDEX,"d_type",{unique:false,multiEntry:false});
                os.createIndex(constance.SKU_INDEX_NAME,"sku_lst",{unique:false,multiEntry:true});
                os.createIndex(constance.PRODUCT_ID_INDEX_NAME,"product_id",{unique:false,multiEntry:false});
                os.createIndex(constance.PRODUCT_NAME_INDEX_NAME,["d_type","name"],{unique:false,multiEntry:false});
                os.createIndex(constance.DOCUMENT_ID_INDEX_NAME,"_id",{unique:false});  //there are multiple revision for the same id
                                                                                        //this index is need to retrieve tax, deal ... document
            }
            request.onsuccess = function(e) {
                var db = request.result;
                callback(null/*error*/,db);
            }
            request.onerror = function(e) {
                callback('error in customizing db');
            }
        }

        return function(store_db_name,callback){
            var store_db_customizers_b = store_db_customizers.bind(store_db_customizers,store_db_name);
            async.series([store_db_customizers_b,approve_product_db_customizer],function(error,results){
                callback(error,results)
            })
        }
    }
);