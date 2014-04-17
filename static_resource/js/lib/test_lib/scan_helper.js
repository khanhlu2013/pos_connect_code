define(
[
	 'lib/async'
	,'app/sale/scan/scanner' 
]
,function
(
	 async
	,scanner
)
{
	return function(scan_str_lst,store_idb,callback){
		if(scan_str_lst.length == 0){
			callback('there is nothing to scan');
			return;
		}

		var scanner_func_lst = []
		for(var i = 0;i<scan_str_lst.length;i++){
			var scanner_b = scanner.exe.bind(scanner.exe,scan_str_lst[0],store_idb);
			scanner_func_lst.push(scanner_b);
		}

		async.series(scanner_func_lst,function(error,results){
			callback(error);
		})
	}
});