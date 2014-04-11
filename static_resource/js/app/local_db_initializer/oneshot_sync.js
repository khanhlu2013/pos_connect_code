define(
    [
         'lib/db/pouch_db_util'
        ,'lib/db/couch_db_util' 
        ,'constance'
        ,'lib/async' 
    ],
    function
    (
         pouch_db_util
        ,couch_db_util 
        ,constance
        ,async
    )
{
    function rep_db(store_db_name,couch_server_url,callback){
        var local_pouch = pouch_db_util.get_db(store_db_name);
        var store_db_url = couch_db_util.get_db_url(couch_server_url,store_db_name)

        local_pouch.replicate.from(store_db_url,function(error,result){
            local_pouch.compact(function(){
                callback(error);
            });
        });
    }

    return function (store_db_name,couch_server_url,callback){
        /*
            This is the starting point of sync process. we sync couch_db from the server to pouch_db on the browser
        */
        var rep_store_db_b = rep_db.bind(rep_db,store_db_name,couch_server_url);

        async.waterfall([rep_store_db_b],function(error,result){
            callback(error);
        });
    };
});