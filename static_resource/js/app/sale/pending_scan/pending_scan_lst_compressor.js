define(
	[
		 'lib/async'
		,'app/sale/pending_scan/pending_scan_lst_getter'
		,'app/sale/pending_scan/pending_scan_util'
 	]
	,function
	(
		 async
		,ps_lst_getter
		,ps_util
	)
{
	function is_combinable(item_a,item_b){
		var result = false;

		var is_same_item = item_a.sp_doc_id === item_b.sp_doc_id;
		var is_same_price = item_a.price === item_b.price;
		var is_same_discount = item_a.discount === item_b.discount;

		return is_same_item && is_same_price && is_same_discount;
	}

	return function(index_to_compress,store_idb,callback){
		var ps_lst_getter_b = ps_lst_getter.bind(ps_lst_getter,store_idb);

		async.waterfall([ps_lst_getter_b],function(error,result){
			var ps_lst = result;
			var cur_item = ps_lst[index_to_compress];
			var next_item = ps_lst[index_to_compress+1];

			if(is_combinable(cur_item,next_item)){
				cur_item.qty += next_item.qty;
				
				var update_cur_item_b = ps_util.update_ps.bind(ps_util.update_ps,store_idb,cur_item,cur_item.key);
				var delete_next_item_b = ps_util.delete_ps.bind(ps_util.delete_ps,store_idb,next_item.key);
				async.series(
					[
						 update_cur_item_b
						,delete_next_item_b
					]
					,function(error,results){
					callback(error);
				});
 			}else{
 				callback(error);
 			}
 		});
	}
});