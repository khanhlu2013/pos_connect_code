define(
    [

         'app/local_db_initializer/customize_db'
        ,'lib/async'
        ,'lib/db/pouch_db_util'
        ,'lib/object_store/get_os'
        ,'constance'
        ,'lib/db/pouchdb'
        ,'lib/db/db_util'
        ,'lib/error_lib'
    ]
    ,function
    (
         customize_db
        ,async
        ,pouch_db_util
        ,get_os
        ,constance
        ,Pouch_db
        ,db_util
        ,error_lib
    )
{
    function insert_tax_rate(store_id,tax_rate,callback){
        var tax_doc = {_id:constance.TAX_DOCUMENT_ID,tax_rate:tax_rate};
        var store_pdb = pouch_db_util.get_store_db(store_id);
        store_pdb.put(tax_doc,function(error,response){
            callback(error);
        });
    }

    function create_db(store_id,callback){
        pouch_db_util.get_store_db(store_id);
        callback(null);
    }

    return function(tax_rate,callback){

        var store_id = constance.TEST_STORE_ID;

        var delete_db_b = pouch_db_util.delete_db.bind(pouch_db_util.delete_db,store_id);
        var create_db_b = create_db.bind(create_db,store_id);
        var customize_db_b = customize_db.bind(customize_db,store_id);
        var insert_tax_rate_b = insert_tax_rate.bind(insert_tax_rate,store_id,tax_rate);

        async.series
        (
            [
                 delete_db_b
                ,create_db_b
                ,customize_db_b
                ,insert_tax_rate_b
            ]
            ,function(error,results){

                if(error){
                    error_lib.alert_error(error);
                    return;
                }
                var r = {};
                r['store_idb'] = results[2];
                r['store_pdb'] = pouch_db_util.get_store_db(store_id);
                r['store_id'] = store_id;
                callback(error,r);
            }
        );
    }
});

