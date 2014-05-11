define(
    [
         'lib/db/pouch_db_util'
        ,'lib/db/couch_db_util' 
        ,'constance'
        ,'lib/async'
        ,'lib/db/pouchdb'
        ,'lib/db/db_util'
    ],
    function
    (
         pouch_db_util
        ,couch_db_util 
        ,constance
        ,async
        ,Pouch_db
        ,db_util
    )
{
    function onChange(){

    }

    function onComplete(){

    }

    function rep_db(store_id,couch_server_url,callback){
        var local_pouch = pouch_db_util.get_store_db(store_id);
        var store_db_url = couch_db_util.get_db_url(couch_server_url,store_id)

        // local_pouch.changes
        // ({
        //     onChange: function (change) {
        //         $("#block_message_label").html(change.id);
        //         console.log(change.id);
        //     }
        // });


        local_pouch.replicate.from(store_db_url,function(error,result){
            callback(error);
        });
    }

    return function (store_id,couch_server_url,callback){
        var rep_store_db_b = rep_db.bind(rep_db,store_id,couch_server_url);

        async.waterfall([rep_store_db_b],function(error,result){
            callback(error);
        });
    };
});