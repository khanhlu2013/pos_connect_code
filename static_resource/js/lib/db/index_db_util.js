define(
	[	
		'lib/object_store/get_os'
	]
	,function
	(
		get_os
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
	return{
		delete_item:delete_item
	}
});