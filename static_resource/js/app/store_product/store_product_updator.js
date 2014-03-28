define(
    [
    	 'lib/async'
		,'app/store_product/store_product_prompt'
		,'app/store_product/store_product_getter'
    ]
    ,function
    (
    	 async
    	,sp_prompt
    	,sp_getter
    )
{
	var ERROR_SP_UPDATOR_CANCEL = 'ERROR_SP_UPDATOR_CANCEL';

	function exe(product_id,store_idb,callback){

		var sp_getter_b = sp_getter.by_product_id.bind(sp_getter.by_product_id,product_id,store_idb);
		async.waterfall([sp_getter_b],function(error,result){
			if(error){
				callback(error);
				return;
			}

			var sp_prompt_b = sp_prompt.show_prompt.bind(sp_prompt.show_prompt,result.name/*name*/,result.price/*price*/,result.crv/*crv*/,result.is_taxable/*is_taxable*/,null/*prefill_sku*/,false/*is_prompt_sku*/,null/*approve_product_lst*/);
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
						 product_id:product_id
						,name:result['name']
						,price:result['price']
						,crv:result['crv']
						,is_taxable:result['is_taxable']
					}
					,success: function(data){
						var error = data.error.length == 0 ? null : data.error
							callback(data.error) //111 how did we bring the update data from server down?
					}
					,error: function(xhr,errmsg,err){
						callback('there is error');
					}
				});
	 		});
		});
 	}

 	return {
 		 exe:exe
 		,ERROR_SP_UPDATOR_CANCEL : ERROR_SP_UPDATOR_CANCEL
 	}
});
