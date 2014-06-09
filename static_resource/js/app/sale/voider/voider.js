define(
	[
		 'lib/object_store/get_os'
        ,'app/sale/value_customer_price/value_customer_price_util'
	]
	,function
	(
		 get_os
		,vcp_util
	)
{
	return function (store_idb,is_reset_is_use_value_customer_price,callback){
		var ps_os = get_os.get_pending_scan_os(false/*readwrite*/,store_idb);
		var request = ps_os.clear();
		request.onsuccess = function(event){
			if(is_reset_is_use_value_customer_price){
				vcp_util.reset_is_use_value_customer_price();
			}
 			callback(null/*result*/);
		};
		request.onerror = function(event){
			callback(request.error/*error*/);
		}
	}
});