define(
    [
         'lib/db/pouch_db_util'
        ,'lib/db/couch_db_util' 
        ,'constance'
        ,'lib/async'
        ,'lib/db/pouchdb'
        ,'lib/db/db_util'
        ,'lib/ui/ui'
    ],
    function
    (
         pouch_db_util
        ,couch_db_util 
        ,constance
        ,async
        ,Pouch_db
        ,db_util
        ,ui
    )
{
    function onChange(){

    }

    function onComplete(){

    }



    return function (store_id,couch_server_url,callback){
        var local_pouch = pouch_db_util.get_store_db(store_id);
        var store_db_url = couch_db_util.get_db_url(couch_server_url,store_id)

        ui.ui_block('sync product data');
        local_pouch.replicate.from(
            store_db_url
            ,{batch_size:200,batches_limit:10}
            ,function(error,result){
                ui.ui_unblock();
                callback(error);
            }
        );
    };
});