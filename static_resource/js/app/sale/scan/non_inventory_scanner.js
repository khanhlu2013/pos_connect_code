define(
[
     'lib/error_lib'
    ,'lib/async'
    ,'lib/ajax_helper'
    ,'app/sale/pending_scan/pending_scan_inserter'
    ,'app/sale/pending_scan/Pending_scan'
]
,function
(
     error_lib
    ,async
    ,ajax_helper
    ,ps_inserter
    ,Pending_scan
)
{
    var STORE_IDB = null;

    function exe(amount,description,store_idb,callback){
        STORE_IDB = store_idb;

        var inserting_ps = new Pending_scan(null/*key*/,1/*qty*/,amount,null/*discount*/,null/*sp_doc_id*/,description/*non_product_name*/);
        var ps_inserter_b = ps_inserter.bind(ps_inserter,STORE_IDB,inserting_ps);       
        async.waterfall([ps_inserter_b],function(error,result){
            callback(error);
        }) 
    }

    return{
        exe:exe
    }
})