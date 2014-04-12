define(
[
	 'lib/async'
	,'app/store_product/sp_online_searcher'
	,'app/store_product/sp_creator'
	,'lib/error_lib'
	,'app/store_product/new_store_product_inserter'
	,'app/store_product/sp_prompt'
	,'lib/lib_error'
]
,function
(
	 async
	,sp_online_searcher
	,sp_creator
	,error_lib
	,new_sp_inserter
	,sp_prompt
	,lib_error

)
{
	var ERROR_CANCEL_create_product_offline = 'ERROR_CANCEL_create_product_offline';

	function create_offline(sku_str,pouch_db,prompt_result,callback){
		var new_sp_inserter_b = new_sp_inserter.bind(
			 new_sp_inserter
			,prompt_result.name
			,prompt_result.price
			,prompt_result.crv
			,prompt_result.is_taxable
			,prompt_result.is_sale_report
			,prompt_result.p_type
			,prompt_result.p_tag
			,sku_str
			,pouch_db
		);
 	}

	function create_online(sku_str,store_id,couch_server_url,sku_search_result,callback){
		var prod_lst = sku_search_result.prod_lst;
		var lookup_type_tag = sku_search_result.lookup_type_tag;

		var sp_creator_b = sp_creator.exe.bind(sp_creator.exe,sku_str,prod_lst,lookup_type_tag,store_id,couch_server_url);
		async.waterfall([sp_creator_b],function(error,result){
			callback(error);
		});
	}

	function exe(sku_str,store_id,couch_server_url,pouch_db,callback){
		/*
			if scanner can not find result for scanning sku, we attempt to create product online. but if online connection fail, we will create product offline
		*/
		var sku_search_b = sp_online_searcher.sku_search.bind(sp_online_searcher.sku_search,sku_str);
		var create_online_b = create_online.bind(create_online,sku_str,store_id,couch_server_url);
		async.waterfall([sku_search_b,create_online_b],function(error,result){
			if(error){

				if(typeof(error) == 'string'){
					callback(error);
					return;
				}

				if(!lib_error.is_offline_error(error)){
					callback(error);
					return;
				}

				//we are here because the internet is down.
				if(!confirm('internet connection down. Do you want to create product offline?')){
					callback(ERROR_CANCEL_create_product_offline);
					return;
				}

				var sp_prompt_b = sp_prompt.show_prompt.bind(
					 sp_prompt.show_prompt
					,null//name
					,null//price
					,null//crv
					,false//is_taxable
					,true//is_sale_report
					,null//p_type
					,null//p_tag
					,false//is_sku_management
					,null//suggest product
 				)
 				var create_offline_b = create_offline.bind(
 					 create_offline
 					,sku_str
 					,pouch_db
 				);

				async.waterfall([sp_prompt_b,create_offline],function(error,result){
					callback(error);
				});				
			}else{
				callback(null);
			}
 		});
	}

	return {
		 exe:exe
		,ERROR_CANCEL_create_product_offline:ERROR_CANCEL_create_product_offline
	}
}
);