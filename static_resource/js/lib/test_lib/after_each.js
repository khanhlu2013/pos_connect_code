define(
    [
         'lib/async'
        ,'constance'
    ]
    ,function
    (
         async
        ,constance
    )
{

    function delete_idb(db_name,callback){
        var request = indexedDB.deleteDatabase('_pouch_' + db_name);
        request.onsuccess = function(event){
            callback(null/*error*/);
        };
        
        request.onerror = function(event){
            callback('error while delete indexeddb'/*error*/);
        };        
    }

	return function(store_idb,store_db_name,callback){
		store_idb.close();

        var delete_store_idb_b = delete_idb.bind(delete_idb,store_db_name);
        async.waterfall([delete_store_idb_b],function(error,result){
            callback(error,error==null/*result*/);
        });
    };
});
