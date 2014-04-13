define(
[
]
,function
(
)
{
	function is_xhr_obj(obj){
		return obj.statusText != undefined && obj.status != undefined;
	}

	function is_error_a_cancel_action(error){
		return error && typeof(error) == 'string' && error.indexOf('ERROR_CANCEL_') == 0;
	}

	function alert_error(error){

		if(is_error_a_cancel_action(error))
		{
			//do nothing
		}else{
			alert('there is untreated error');
		}
		
	}

	function is_offline_error(error){
		return is_xhr_obj(error) && error.status == 0;
	}

	return{
		 alert_error : alert_error 
		,is_xhr_obj:is_xhr_obj 
		,is_offline_error:is_offline_error
	}
});