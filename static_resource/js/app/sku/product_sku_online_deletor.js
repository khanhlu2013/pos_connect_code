define(
[
     'lib/ui/ui'
    ,'lib/ajax_helper'
    ,'app/local_db_initializer/sync_if_nessesary'
    ,'lib/async'
]
,function
(
     ui
    ,ajax_helper
    ,sync_if_nessesary
    ,async
)
{
    return function (
         product_id 
        ,sku_str
        ,couch_server_url
        ,store_id        
        ,callback
    ){
        var data = {product_id:product_id ,sku_str:sku_str }
        var ajax_b = ajax_helper.exe.bind(ajax_helper.exe,'/product/sku/delete','POST','deleting sku ...',data);
        var sync_if_nessesary_b = sync_if_nessesary.bind(sync_if_nessesary,store_id,couch_server_url);

        async.series([ajax_b,sync_if_nessesary_b],function(error,results){
            var product = results == null ? null : results[0];
            callback(error,product);
        });
    }	
});