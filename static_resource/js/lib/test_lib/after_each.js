define(
    [
         'lib/async'
        ,'constance'
        ,'lib/db/pouch_db_util'
    ]
    ,function
    (
         async
        ,constance
        ,pouch_db_util
    )
{

	return function(store_idb,callback){
		store_idb.close();
        var delete_db_b = pouch_db_util.delete_db.bind(pouch_db_util.delete_db,constance.TEST_STORE_ID);
        async.waterfall([delete_db_b],function(error,result){
            if(error){
                alert(error);
            }
            callback(error);
        });
    };
});
