define(
	[
		 'lib/async'
		,'app/sale/sale_finalizer/receipt_inserter'
		,'lib/object_store/get_os'
		,'lib/number/number'
        ,'app/sale/displaying_scan/displaying_scan_lst_and_tax_getter'
		,'app/sale/displaying_scan/displaying_scan_util'
		,'app/sale/voider/voider'
	]
	,function
	(
		 async
		,receipt_inserter
		,get_os
		,number
		,ds_lst_and_tax_getter
		,ds_util
		,voider
	)
{
	return function(store_pdb,store_idb,collected_amount,callback){
		if(!number.is_positive_double(collected_amount)){
			callback('wrong input'/*error*/);
		}else{
			var ds_lst_and_tax_getter_b = ds_lst_and_tax_getter.bind(ds_lst_and_tax_getter,store_idb);
			async.waterfall([ds_lst_and_tax_getter_b],function(error,result){
				if(error){
					callback(error);
				}else{
					var ds_lst = result[0];
					var tax_rate = result[1];

					if(ds_lst.length != 0){

						var line_total = ds_util.get_line_total(ds_lst,tax_rate);
						if(line_total > collected_amount){
							callback('should collect at least ' + line_total/*error*/);
						}
						else{
			 				var receipt_inserter_b = receipt_inserter.bind(receipt_inserter,store_pdb,ds_lst,tax_rate,collected_amount);
							var voider_b = voider.bind(voider,store_idb);
							async.waterfall([receipt_inserter_b,voider_b],function(error,result){
								callback(error);
							});							
						}
 					}else{
		            	callback('scan list is empty'/*error*/);
		            }
 				}
			})
		}
 	}
});