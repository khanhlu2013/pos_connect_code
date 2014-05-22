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
	function exe(callback){
		var ajax_b = ajax_helper.exe.bind(ajax_helper.exe,'/mix_match/get','GET','get mix match ...',null/*data*/);
		async.waterfall([ajax_b],function(error,result){
			callback(error,result);
		});
	}

	return{
		exe:exe
	}
});