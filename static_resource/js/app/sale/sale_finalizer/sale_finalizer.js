define(
	[
		 'lib/async'
		,'app/receipt/receipt_inserter'
		,'lib/object_store/get_os'
		,'lib/number/number'
		,'app/sale/displaying_scan/displaying_scan_util'
		,'app/sale/voider/voider'
		,'app/sale/displaying_scan/displaying_scan_lst_getter'
	]
	,function
	(
		 async
		,receipt_inserter
		,get_os
		,number
		,ds_util
		,voider
		,ds_lst_getter
	)
{
	var MM_LST = null;
	
	return function(mm_lst,store_pdb,store_idb,collect_amount,tax_rate,callback){
		MM_LST = mm_lst;
		if(!number.is_positive_double(collect_amount)){
			callback('wrong input'/*error*/);
		}else{
			var ds_lst_getter_b = ds_lst_getter.bind(ds_lst_getter,MM_LST,store_idb);
			async.waterfall([ds_lst_getter_b],function(error,result){
				if(error){
					callback(error);
				}else{
					var ds_lst = result;

					if(ds_lst.length != 0){

						var line_total = ds_util.get_line_total(ds_lst,tax_rate);
						if(line_total > collect_amount){
							callback('should collect at least ' + line_total/*error*/);
						}
						else{
			 				var receipt_inserter_b = receipt_inserter.bind(receipt_inserter,store_pdb,ds_lst,tax_rate,collect_amount);
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