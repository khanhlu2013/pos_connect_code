define(
[

],
function
(

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

	function get_comma_separated_pid_lst(sp_json_lst){
		var result = "";

		for(var i = 0;i<sp_json_lst.length;i++){
			result += (',' + sp_json_lst[i].product_id);
		}

		return result.substr(1);
 	}

	return{
		 get_item_based_on_product_id:get_item_based_on_product_id
		,get_item_based_on_doc_id:get_item_based_on_doc_id
		,get_comma_separated_pid_lst:get_comma_separated_pid_lst
	}
});