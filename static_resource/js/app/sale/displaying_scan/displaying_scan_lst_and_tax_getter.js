define(
	[
		 'lib/async'
		,'app/sale/displaying_scan/displaying_scan_lst_getter'
		,'app/tax/get_tax'
	]
	,function
	(
		 async
		,ds_lst_getter
		,get_tax
	)
{
	var MM_LST = null;
	return function (mm_lst,store_idb,callback){
		MM_LST = mm_lst;
		var return_obj = new Array();

		var ds_lst_getter_b = ds_lst_getter.bind(ds_lst_getter,MM_LST,store_idb);
        
        async.waterfall([ds_lst_getter_b],function(error,ds_result){
        	if(error==null){
        		return_obj.push(ds_result);
        		var get_tax_b = get_tax.bind(get_tax,store_idb);

    			async.waterfall([get_tax_b],function(error,tax_result){
    				if(error==null){
    					return_obj.push(tax_result);
    					callback(null/*error*/,return_obj);
 					}else{
    					callback(error,null);
    				}
    			});
 			}else{
        		callback(error,null);
        	}
 		});
	}
});