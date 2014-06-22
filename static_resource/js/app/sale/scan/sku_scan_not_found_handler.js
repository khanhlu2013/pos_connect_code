/*
    when scanner can not find sku offline, it will look for sku online within the network and help user to create product
    if internet is offline, it will create an offline sp.
    it is not responsible for re-scanning the product.
*/
define(
[
     'lib/async'
    ,'lib/error_lib'     
    ,'app/store_product/sp_online_searcher'
    ,'app/store_product/sp_creator'
    ,'app/store_product/sp_prompt'
    ,'app/store_product/Store_product'
    ,'lib/ui/ui'
]
,function
(
     async
    ,error_lib     
    ,sp_online_searcher
    ,sp_creator
    ,sp_prompt
    ,Store_product
    ,ui
)
{
    var ERROR_CANCEL_create_product_offline = 'ERROR_CANCEL_create_product_offline';

    function create_offline(sku_str,pouch_db,prompt_result,callback){
        sku_lst = [sku_str,];
        var store_product = new Store_product
        (
             null//_id: handle by pouch
            ,null//_doc_id_rev: handle by pouch
            ,null//key
            ,null//store_id (default is my store when null)
            ,null//product_id
            ,prompt_result.name
            ,prompt_result.price
            ,prompt_result.value_customer_price
            ,prompt_result.crv
            ,prompt_result.is_taxable
            ,prompt_result.is_sale_report
            ,prompt_result.p_type
            ,prompt_result.p_tag
            ,sku_lst
            ,prompt_result.cost
            ,prompt_result.vendor
            ,prompt_result.buydown
            ,[]//breakdown_assoc_lst
        );

        pouch_db.post(store_product, function(err, response) {
            callback(err);
        });
    }

    function create_online(sku_str,store_id,couch_server_url,product_lst,callback){
        var sp_creator_b = sp_creator.exe.bind(sp_creator.exe,sku_str,product_lst,store_id,couch_server_url);
        async.waterfall([sp_creator_b],function(error,result){
            callback(error);
        });
    }

    function exe(sku_str,store_id,couch_server_url,pouch_db,callback){
        /*
            if scanner can not find result for scanning sku, we attempt to create product online. but if online connection fail, we will create product offline
        */
        var sku_search_b = sp_online_searcher.sku_search.bind(sp_online_searcher.sku_search,sku_str);
        var create_online_b = create_online.bind(create_online,sku_str,store_id,couch_server_url);
        async.waterfall([sku_search_b,create_online_b],function(error,result){
            if(error){

                if(typeof(error) == 'string'){
                    callback(error);
                    return;
                }

                if(!error_lib.is_offline_error(error)){
                    callback(error);
                    return;
                }

                //we are here because the internet is down.
                ui.ui_confirm(
                    'internet connection down. Do you want to create product offline?'
                    ,function(){
                        var sp_prompt_b = sp_prompt.show_prompt.bind(
                             sp_prompt.show_prompt
                            ,null//cur_sp 
                            ,null//sp_duplicate
                            ,true//is_prompt_sku
                            ,sku_str//sku_prefill
                            ,false//internet down, don't go online to get lookup type tag
                            ,null//suggest_product
                        )
                        var create_offline_b = create_offline.bind(create_offline ,sku_str ,pouch_db );

                        async.waterfall([sp_prompt_b,create_offline_b],function(error,result){
                            callback(error);
                        });                         
                    }
                    ,function(){
                        callback(ERROR_CANCEL_create_product_offline);
                    }
                );
            }else{
                callback(null);
            }
        });
    }

    return {
         exe:exe
        ,ERROR_CANCEL_create_product_offline:ERROR_CANCEL_create_product_offline
    }
}
);