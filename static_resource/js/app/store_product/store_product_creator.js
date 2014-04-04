define(
	[
		 'lib/async'
		,'lib/db/db_util' 
		,'app/store_product/store_product_prompt'
		,'app/store_product/store_product_getter'
		,'app/local_db_initializer/oneshot_sync'

	]
	,function
	(
		 async
		,db_util 
		,sp_prompt
		,sp_getter
		,oneshot_sync
	)
{
	var ERROR_SP_CREATOR_CANCEL = 'ERROR_SP_CREATOR_CANCEL';
    
	function sync_data_if_nessesary(store_id,couch_server_url,callback){
		var is_store_idb_exist_b = db_util.is_store_idb_exist.bind(db_util.is_store_idb_exist,store_id);
		async.waterfall([is_store_idb_exist_b],function(error,result){
			if(error){
				$.unblockUI();
				callback(error);
				return;
			}

			if(result === null){
				$.unblockUI();
				callback(null/*error*/);
				//db is not exist, do nothing
			}
			else{
				var oneshot_sync_b = oneshot_sync.bind(oneshot_sync,db_util.get_store_db_name(store_id),couch_server_url)
				async.waterfall([oneshot_sync_b],function(error,result){
					$.unblockUI();
					callback(error);
				});
			}
		});
 	}

	function exe(sku_str,suggest_product_lst,lookup_type_tag,store_id,couch_server_url,callback){
		/*
			DESC: 	we need this module if store_product is not found when searching for sku. It will make sure that offline db does not contain this sku. 
					This module will look up for sku, create store product if nessesary and sycning online and offline db for this product.
					Notice that sp could exist on server due to online and offline not in sync, and in this case, this module simply sync store_product down

		*/

		var sp_prompt_b = sp_prompt.show_prompt.bind
		(
			 sp_prompt.show_prompt
			,null//name
			,null//price
			,null//crv
			,null//is_taxable
            ,null//is_sale_report
            ,null//p_type
            ,null//p_tag		
			,sku_str
			,true/*is_prompt_sku*/
			,suggest_product_lst
			,lookup_type_tag
		);
		async.waterfall([sp_prompt_b],function(error,result){
			if(error){
				if(error == sp_prompt.STORE_PRODUCT_PROMPT_ERROR_CANCEL_BUTTON_PRESS){
					callback(ERROR_SP_CREATOR_CANCEL);
				}else{
					callback(error);
				}
				return;
 			}

        	data = {
        		 product_id : result.product_id
        		,name : result.name
        		,price : result.price
        		,crv : result.crv
        		,is_taxable : result.is_taxable
        		,is_sale_report : result.is_sale_report
        		,sku_str : result.sku_str
        		,p_type : result.p_type
        		,p_tag : result.p_tag
        	}
        	$.blockUI();

 			$.ajax({
 				 url:'/product/sp_creator'
 				,method: "POST" 
 				,data : data
 				,dataType:'json'
 				,success:function(data,status_str,xhr){
 					sync_data_if_nessesary(store_id,couch_server_url,callback)
 				}
 				,error:function(xhr,status_str,error){
 					alert("there is an error");
 				}
 			});
 		});
 	}

	return{
		 exe:exe
		,ERROR_SP_CREATOR_CANCEL : ERROR_SP_CREATOR_CANCEL
	}
});