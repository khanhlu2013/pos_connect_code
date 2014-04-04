define(
[
	'app/store_product/Store_product'
]
,function
(
	Store_product
)
{
	function get_sp_item_from_prod_json(store_id,prod_json){
		
		var sp = null;

		for(var i = 0;i<prod_json.store_product_set.length;i++){
			cur_sp = prod_json.store_product_set[i]
			if(cur_sp.store_id == store_id){

				sp = new Store_product(
			         null//_id
			        ,null//_rev
			        ,null//key
			        ,cur_sp.store_id
			        ,cur_sp.product_id
			        ,cur_sp.name
			        ,cur_sp.price
			        ,cur_sp.crv
			        ,cur_sp.is_taxable
			        ,cur_sp.is_sale_report
			        ,cur_sp.p_type
			        ,cur_sp.p_tag
			        ,cur_sp.sku_lst					
				);

				break;
			}
		}
		return sp;
	}

	return {
		get_sp_item_from_prod_json:get_sp_item_from_prod_json
	}
});