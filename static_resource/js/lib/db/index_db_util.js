define(
	[	
		 'lib/object_store/get_os'
		,'lib/db/couch_db_util'
		,'lib/db/db_util'
	]
	,function
	(
		 get_os
		,couch_db_util
		,db_util
	)
{
	function delete_item(idb,key,callback){
		var store_os = get_os.get_main_os(false/*readwrite*/,idb)
		var request = store_os.delete(key);
		request.onsuccess = function(event){
			callback(null);
		};
		request.onerror = function(event){
			callback(event.target.errorCode);
		}
	}

	function is_store_idb_exist(store_id,callback){
		var db_name = couch_db_util.pouch_db_name_to_index_db_name(db_util.get_store_db_name(store_id));
        var request = indexedDB.open(db_name);

		request.onupgradeneeded = function (e){
		    e.target.transaction.abort();
		    callback(null/*error*/,false/*result: db is not exist*/)
		}
        request.onsuccess = function(e) {
            callback(null/*error*/,true/*result: db is exist*/);
        }
        request.onerror = function(e) {
        	if(e.target.error.name == "AbortError"){
			    indexedDB.deleteDatabase(db_name);
        	}else{
        		alert('there is error');
        	}
        }	
	}

	return{
		 delete_item:delete_item
		,is_store_idb_exist:is_store_idb_exist
	}
});
