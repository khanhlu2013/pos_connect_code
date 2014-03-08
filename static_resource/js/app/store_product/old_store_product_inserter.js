define(
	[
		 'app/store_product/Store_product'
		,'app/approve_product/approve_product_getter'
		,'lib/async'
		,'app/store_product/store_product_getter'
		,'app/store_product/store_product_validator'
	],
	function
	(
		 Store_product
		,approve_product_getter 
		,async
		,sp_getter
		,sp_validator
	)
{

	var ERROR_APPROVE_PRODUCT_ID_NOT_EXIST = 'ERROR_APPROVE_PRODUCT_ID_NOT_EXIST';
	var ERROR_ASSOC_SKU_STR_IS_NOT_CORRECT = 'ERROR_ASSOC_SKU_STR_IS_NOT_CORRECT';
	var ERROR_STORE_PRODUCT_ID_EXIST = 'ERROR_STORE_PRODUCT_ID_EXIST';

 	function exe(product_id,name,price,crv,is_taxable,create_offline_by_sku,store_idb,store_pdb,product_idb,callback){

 		var error_lst = sp_validator.validate(name,price,crv,is_taxable,create_offline_by_sku,true/*is_prompt_sku*/);
 		if(error_lst.length!=0){
 			callback(error_lst);
 			return;
 		}

 		var ap_getter = approve_product_getter.by_product_id;
 		var ap_getter_b = ap_getter.bind(ap_getter,product_id,product_idb);

 		async.waterfall([ap_getter_b],function(error,result){
 			if(error){
 				if(error == ap_getter.ERROR_APPROVE_PRODUCT_ID_NOT_EXIST){
	 				callback(ERROR_APPROVE_PRODUCT_ID_NOT_EXIST);
	 				return;  					
 				}else{
	 				callback(error);
	 				return; 	 					
 				}
 			}

 			var approve_product = result;
 			if(approve_product.sku_lst.indexOf(create_offline_by_sku)== -1){
				callback(ERROR_ASSOC_SKU_STR_IS_NOT_CORRECT);
 				return;
			}

 			var sp_getter_b = sp_getter.by_product_id.bind(sp_getter.by_product_id,product_id,store_idb);
 			async.waterfall([sp_getter_b],function(error,result){
 				if(error != null){
 					//this only happend when there is multiple pid inside store product
 					callback(error);
 					return;
 				}

 				if(result != null){
 					callback(ERROR_STORE_PRODUCT_ID_EXIST);
 					return;
 				}

				var store_product = new Store_product
		 		(
			         null//_id: handle by pouch
			        ,null//_doc_id_rev: handle by pouch
			        ,null//key
		 			,product_id
			        ,name
			        ,price
			        ,crv
			        ,is_taxable
			        ,approve_product.sku_lst
			        ,true//create_offline
			        ,create_offline_by_sku
			    );

				store_pdb.post(store_product, function(err, response) {
					callback(err);
				});
 			});
 		});
 	}

	return {
		 exe:exe
		,ERROR_APPROVE_PRODUCT_ID_NOT_EXIST:ERROR_APPROVE_PRODUCT_ID_NOT_EXIST
		,ERROR_ASSOC_SKU_STR_IS_NOT_CORRECT:ERROR_ASSOC_SKU_STR_IS_NOT_CORRECT
		,ERROR_STORE_PRODUCT_ID_EXIST:ERROR_STORE_PRODUCT_ID_EXIST
	}
});