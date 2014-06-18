define(
	[
		 'constance'
		,'app/store_product/Store_product'
		,'app/store_product/store_product_validator'
	],
	function
	(
		 constance
		,Store_product
		,sp_validator
	)
{
 	return function (pid,name,price,value_customer_price,crv,is_taxable,is_sale_report,p_type,p_tag,sku_str,cost,vendor,buydown,pouch_db,callback){

 		var error_lst = sp_validator.validate(name,price,value_customer_price,crv,is_taxable,sku_str,true/*is_prompt_sku*/,cost,vendor,buydown);
 		if(error_lst.length!=0){
 			callback(error_lst);
 			return;
 		}

		var sku_lst = new Array();
		sku_lst.push(sku_str);

		var store_product = new Store_product
 		(
	         null//_id: handle by pouch
	        ,null//_doc_id_rev: handle by pouch
	        ,null//key
	        ,null//store_id (default is my store when null)
 			,pid//product_id
	        ,name
	        ,price
	        ,value_customer_price
	        ,crv
	        ,is_taxable
	        ,is_sale_report
	        ,p_type
	        ,p_tag
	        ,sku_lst
	        ,cost
	        ,vendor
	        ,buydown
	        ,[]//breakdown_assoc_lst
	    );

		pouch_db.post(store_product, function(err, response) {
			callback(err);
		});
	}
});