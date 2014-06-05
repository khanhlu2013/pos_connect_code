define(
    [
         'lib/async'
        ,'app/store_product/sp_prompt'
        ,'app/store_product/sp_online_getter'
        ,'app/local_db_initializer/sync_if_nessesary'
        ,'app/product/product_json_helper'
        ,'lib/ui/ui'
    ]
    ,function
    (
         async
        ,sp_prompt
        ,sp_online_getter
        ,sync_if_nessesary
        ,product_json_helper
        ,ui
    )
{

    function updator(store_id,product_id,couch_server_url,result,callback){
        ui.ui_block('updating product ...');
        var data = {
                 product_id:product_id
                ,name:result.name
                ,price:result.price
                ,value_customer_price:result.value_customer_price
                ,crv:result.crv
                ,is_taxable:result.is_taxable
                ,is_sale_report:result.is_sale_report
                ,p_type:result.p_type
                ,p_tag:result.p_tag
                ,cost:result.cost
                ,vendor:result.vendor
                ,buydown:result.buydown
            };

        $.ajax({
             url : '/product/update_sp'
            ,type : "POST"
            ,dataType : "json"
            ,data : data
            ,success: function(data,status_str,xhr){
                ui.ui_unblock();
                callback(null,data/*product_serialized*/)
            }
            ,error: function(xhr,status_str,err){
                ui.ui_unblock();
                callback(xhr);
            }
        }); 
    }

    function prompt(store_id,product_getter_result,callback){
        var product = product_getter_result.product;
        var lookup_type_tag = product_getter_result.lookup_type_tag;
        var sp = product_json_helper.get_sp_from_p(product,store_id);
        
        var sp_prompt_b = sp_prompt.show_prompt.bind
        (
             sp_prompt.show_prompt

            ,sp//sp_prefill
            ,false//is_prompt_sku
            ,null//sku_prefill
            ,lookup_type_tag
            ,true//is_sku_management
            ,true//is_group_management
            ,true//is_kit_management
            ,null//suggest_product
        );

        async.waterfall([sp_prompt_b],function(error,result){
            callback(error,result);
        });    
    }

    function exe(product_id,store_id,couch_server_url,callback){
        var getter_b = sp_online_getter.bind(sp_online_getter,product_id,false/*is_include_other_store*/,true/*is_lookup_type_tag*/);
        var prompt_b = prompt.bind(prompt,store_id);
        var updator_b = updator.bind(updator,store_id,product_id,couch_server_url);
        async.waterfall([getter_b,prompt_b,updator_b],function(error,result){
            if(error){
                callback(error,null);
            }else{
                var product = result;
                var sync_b = sync_if_nessesary.bind(sync_if_nessesary,store_id,couch_server_url);
                async.waterfall([sync_b],function(error,result){
                    callback(error,product);
                });                 
            }
        });
    }

    return {
         exe:exe
    }
});
