define(
	[
		 'constance'
		,'app/store_product/Store_product'
	],
	function
	(
		 constance
		,Store_product
	)
{
	function get_item_based_on_doc_id(doc_id,store_product_lst){
		var return_item = null;

		for(var i = 0;i<store_product_lst.length;i++){
			if(store_product_lst[i]._id === doc_id){
				return_item = store_product_lst[i];
				break;
			}
		}

		return return_item;
	}

	function get_item_based_on_product_id(product_id,store_product_lst){
		var return_item = null;

		for(var i = 0;i<store_product_lst.length;i++){
			if(store_product_lst[i].product_id === product_id){
				return_item = store_product_lst[i];
				break;
			}
		}

		return return_item;
	}



	return{
		 get_item_based_on_product_id:get_item_based_on_product_id
		,get_item_based_on_doc_id:get_item_based_on_doc_id
	}
});