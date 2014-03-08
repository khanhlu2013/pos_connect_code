define(
	[
		 'lib/async'
		,'app/sale/pending_scan/pending_scan_lst_getter'
		,'app/sale/displaying_scan/displaying_scan_computer'
	]
	,function
	(
		 async
		,ps_lst_getter
		,ds_computer
	)
{
	return function(store_idb,callback){
		var ps_lst_getter_b = ps_lst_getter.bind(ps_lst_getter,store_idb);
		var ds_computer_b = ds_computer.bind(ds_computer,store_idb);
		async.waterfall([ps_lst_getter_b,ds_computer_b],function(error,result){
			callback(error,result);
		});
	}
});