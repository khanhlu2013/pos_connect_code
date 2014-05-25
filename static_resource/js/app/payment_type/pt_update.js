define(
[
	 'lib/error_lib'
	,'lib/async'
	,'lib/ajax_helper'

]
,function
(
	 error_lib
	,async
	,ajax_helper
)
{
	function exe(id,name,callback){
		var ajax_b = ajax_helper.exe.bind(ajax_helper.exe,'/payment_type/update','POST','updating payment type ...',{id:id,name:name});
		async.waterfall([ajax_b],function(error,result){
			callback(error,result);
		});
	}

	return{
		exe:exe
	}
})