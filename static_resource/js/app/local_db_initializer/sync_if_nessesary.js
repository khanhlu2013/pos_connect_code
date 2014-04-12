define(
[
	 'lib/db/db_util'
	,'lib/async' 
	,'app/local_db_initializer/oneshot_sync'
]
,function
(
	 db_util
	,async
	,oneshot_sync
)
{
	return function (store_id,couch_server_url,callback){
		var is_store_idb_exist_b = db_util.is_store_idb_exist.bind(db_util.is_store_idb_exist,store_id);
		async.waterfall([is_store_idb_exist_b],function(error,result){
			if(error){
				$.unblockUI();
				callback(error);
				return;
			}

			if(result === null){
				$.unblockUI();
				callback(null/*error*/);
				//db is not exist, do nothing
			}
			else{
				var oneshot_sync_b = oneshot_sync.bind(oneshot_sync,store_id,couch_server_url)
				async.waterfall([oneshot_sync_b],function(error,result){
					$.unblockUI();
					callback(error);
				});
			}
		});
 	}
});