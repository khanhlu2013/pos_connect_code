define(
[
	 'lib/ajax_helper'
	,'lib/async'
]
,function
(
	 ajax_helper
	,async
)
{
	function exe(id,callback){
		var ajax_b = ajax_helper.exe.bind(ajax_helper.exe,'/payment_type/delete','POST','deleting payment type ...',{id:id});
		async.waterfall([ajax_b],function(error,result){
			callback(error,result);
		});
	}

	return{
		exe:exe
	}
})