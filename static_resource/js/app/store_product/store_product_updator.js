define(
    [
         'lib/async'
        ,'app/store_product/store_product_prompt'
        ,'app/store_product/store_product_getter'
        ,'lib/db/db_util' 
    ]
    ,function
    (
         async
        ,sp_prompt
        ,sp_getter
    )
{
    var ERROR_SP_UPDATOR_CANCEL = 'ERROR_SP_UPDATOR_CANCEL';

    function prompt_and_ajax_update_sp(sp, lookup_type_tag, callback){
        var sp_prompt_b = sp_prompt.show_prompt.bind
        (
             sp_prompt.show_prompt
            ,sp.name
            ,sp.price
            ,sp.crv
            ,sp.is_taxable
            ,sp.is_sale_report
            ,sp.p_type
            ,sp.p_tag
            ,null   //prefill_sku
            ,false  //is_prompt_sku
            ,null   //approve_product_lst
            ,lookup_type_tag
        );

        async.waterfall([sp_prompt_b],function(error,result){
            if(error){
                if(error == sp_prompt.STORE_PRODUCT_PROMPT_ERROR_CANCEL_BUTTON_PRESS){
                    callback(ERROR_SP_UPDATOR_CANCEL);
                    return;                     
                }else{
                    callback(error);
                    return;
                }
            }

            $.ajax({
                 url : '/product/updator_ajax'
                ,type : "POST"
                ,dataType : "json"
                ,data : {
                     product_id:sp.product_id
                    ,name:result.name
                    ,price:result.price
                    ,crv:result.crv
                    ,is_taxable:result.is_taxable
                    ,is_sale_report:result.is_sale_report
                    ,p_type:result.p_type
                    ,p_tag:result.p_tag

                }
                ,success: function(data){
                    var error_message = data.error_message;
                    var sp = data.sp;
                    callback(error_message.length == 0 ? null: error_message/*error*/,sp/*result*/);
                }
                ,error: function(xhr,errmsg,err){
                    callback('there is error');
                }
            });
        });
    }

    function exe(product_id,store_id,callback){

        $.ajax({
             url : '/product/getter_ajax'
            ,type : 'GET'
            ,dataType : 'json'
            ,data : {'product_id':product_id}
            ,success : function(result){
                var prompt_and_ajax_update_sp_b = prompt_and_ajax_update_sp.bind(prompt_and_ajax_update_sp,result.sp,result.lookup_type_tag);
                async.waterfall([prompt_and_ajax_update_sp_b],function(error,result){
                    callback(error,result);
                });
            }
            ,error : function(xhr,errmsg,error){
                callback('there is error');
            }
        });
    }

    return {
         exe:exe
        ,ERROR_SP_UPDATOR_CANCEL : ERROR_SP_UPDATOR_CANCEL
    }
});
