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
	function update(displaying_scan,pouch_db,prompt_result,callback){
		var sp = displaying_scan.store_product;
		sp.name = prompt_result.name;
		sp.price = prompt_result.price;
		sp.crv = prompt_result.crv;
		sp.is_taxable = prompt_result.is_taxable;
		sp.is_sale_report = prompt_result.is_sale_report;
		sp.p_type = prompt_result.p_type;
		sp.p_tag = prompt_result.p_tag;

		pouch_db.put(sp,function(error,result){
			if(error){
				callback(error);
				return;
			}

			callback(sp);
		})
	}

	return function(displaying_scan,pouch_db,callback){

		console.assert(displaying_scan.product_id == null);

        var sp_prompt_b = sp_prompt.show_prompt.bind
        (
             sp_updator_b.show_prompt
            ,displaying_scan.name 
            ,displaying_scan.price
            ,displaying_scan.crv
            ,displaying_scan.is_taxable
            ,displaying_scan.is_sale_report
            ,displaying_scan.p_type 
            ,displaying_scan.p_tag
            ,null//sku prefill
            ,false//is_prompt_sku
            ,null//lookup type tag
            ,false//is_sku_management
            ,null//suggest product
        );		

        var update_b = update.bind(update,displaying_scan,pouch_db);
        async.waterfall([sp_updator_b,update_b],function(error,result){
        	callback(error);
        });
	}
});