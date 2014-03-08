define(
    [
         'lib/db/pouch_db_util'
        ,'app/local_db_initializer/set_sync_status'
        ,'lib/db/couch_db_util'
        ,'constance'
        ,'lib/async'
    ],
    function
    (
         pouch_db_util
        ,set_sync_status
        ,couch_db_util
        ,constance
        ,async
    )
{
    function error_continuous_product_sync() {
        set_sync_status(false);
    }

    function rep_store_db(store_db_name,couch_server_url){
        /*
            After intial syncing and customizing, we continue to listen for change from the server and sync down.
        */
        store_db_url = couch_db_util.get_db_url(couch_server_url,store_db_name);
        var opts = {continuous:true,complete:error_continuous_product_sync};
        var local_pouch = pouch_db_util.get_db(store_db_name);
        local_pouch.replicate.from(store_db_url,opts);
    }

    function rep_product_db(couch_server_url){
        /*
            After intial syncing and customizing, we continue to listen for change from the server and sync down.
        */
        product_db_url = couch_db_util.get_db_url(couch_server_url,constance.APPROVE_PRODUCT_DB_NAME);
        var opts = {continuous:true,complete:error_continuous_product_sync};
        var local_pouch = pouch_db_util.get_db(constance.APPROVE_PRODUCT_DB_NAME);
        local_pouch.replicate.from(product_db_url,opts);
    }

    return function(store_db_name,couch_server_url){
        rep_product_db(couch_server_url)
        rep_store_db(store_db_name,couch_server_url)
    };
});