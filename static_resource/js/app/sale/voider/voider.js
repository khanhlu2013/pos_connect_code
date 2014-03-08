define(
	[
		'lib/object_store/get_os'
	]
	,function
	(
		get_os
	)
{
	return function (store_idb,callback){
		var ps_os = get_os.get_pending_scan_os(false/*readwrite*/,store_idb);
		var request = ps_os.clear();
		request.onsuccess = function(event){
			callback(null/*result*/);
		};
		request.onerror = function(event){
			callback(request.error/*error*/);
		}
	}
});