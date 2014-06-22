define(
[
	 'lib/async'
	,'app/store_product/sp_prompt'
]
,function
(
	 async
	,sp_prompt
)
{
	function update(store_product,pouch_db,prompt_result,callback){

		store_product.name = prompt_result.name;
		store_product.price = prompt_result.price;
		store_product.crv = prompt_result.crv;
		store_product.is_taxable = prompt_result.is_taxable;
		store_product.is_sale_report = prompt_result.is_sale_report;
		store_product.p_type = prompt_result.p_type;
		store_product.p_tag = prompt_result.p_tag;

		pouch_db.put(store_product,function(error,result){
			if(error){
				callback(error);
				return;
			}

			callback(null,store_product);
		})
	}

	return function(store_product,pouch_db,callback){

		console.assert(store_product.product_id == null);

        var sp_prompt_b = sp_prompt.show_prompt.bind
        (
             sp_prompt.show_prompt
 			,store_product//cur_sp
            ,null//sp_duplicate
            ,false//is_prompt_sku
            ,null//sku_prefill
            ,false//this product is created offline. chance is internet is donw. when updating this product, lets not go online to get lookup type tag
            ,null//suggest_product
        );		

        var update_b = update.bind(update,store_product,pouch_db);
        async.waterfall([sp_prompt_b,update_b],function(error,result){
        	callback(error,result);
        });
	}
});
