define(
[
	 'lib/async'
	,'app/store_product/sp_online_searcher'
	,'app/store_product/sp_creator'
]
,function
(
	 async
	,sp_online_searcher
	,sp_creator

)
{
	function _create(sku_str,store_id,couch_server_url,sku_search_result,callback){
		var prod_lst = sku_search_result.prod_lst;
		var lookup_type_tag = sku_search_result.lookup_type_tag;

		var sp_creator_b = sp_creator.exe.bind(sp_creator.exe,sku_str,prod_lst,lookup_type_tag,store_id,couch_server_url);
		async.waterfall([sp_creator_b],function(error,result){
			callback(error);
		})
	}

	return function(sku_str,store_id,couch_server_url,callback){

		var sku_search_b = sp_online_searcher.sku_search.bind(sp_online_searcher.sku_search,sku_str);
		var create_b = _create.bind(_create,sku_str,store_id,couch_server_url);
		async.waterfall([sku_search_b,create_b],function(error,result){
			callback(error);
		});
	}
}
);