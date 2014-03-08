define(
	[
		 'lib/async'
		,'app/store_product/store_product_prompt'
		,'app/store_product/old_store_product_inserter'
		,'app/store_product/new_store_product_inserter'
	]
	,function
	(
		 async
		,sp_prompt
		,old_sp_inserter
		,new_sp_inserter
	)
{
	var ERROR_SP_CREATOR_CANCEL = 'ERROR_SP_CREATOR_CANCEL';

	function exe(prefill_sku,approve_product_lst,store_idb,store_pdb,product_idb,callback){

		var sp_prompt_b = sp_prompt.exe.bind(sp_prompt.exe,null/*name*/,null/*price*/,null/*crv*/,null/*is_taxable*/,prefill_sku,true/*is_prompt_sku*/,approve_product_lst);
		async.waterfall([sp_prompt_b],function(error,result){
			if(error){
				if(error == sp_prompt.STORE_PRODUCT_PROMPT_ERROR_CANCEL_BUTTON_PRESS){
					callback(ERROR_SP_CREATOR_CANCEL);
					return;
				}else{
					callback(error);
					return;
				}
 			}
 			var pid = result["product_id"];
			if(pid == null){
	 			var new_sp_inserter_b = new_sp_inserter.bind(new_sp_inserter,result['name'],result['price'],result['crv'],result['is_taxable'],result['sku_str'],store_pdb);
				async.waterfall([new_sp_inserter_b],function(error,result){
					callback(error);
				});
			}else{
				var old_sp_inserter_b = old_sp_inserter.exe.bind(
					 old_sp_inserter.exe
					,result["product_id"]
					,result['name']
					,result['price']
					,result['crv']
					,result['is_taxable']
					,result['sku_str']
					,store_idb
					,store_pdb
					,product_idb
				);

				async.waterfall([old_sp_inserter_b],function(error,result){
					callback(error);
				});
			}
 		});
	}

	return{
		 exe:exe
		,ERROR_SP_CREATOR_CANCEL : ERROR_SP_CREATOR_CANCEL
	}
});