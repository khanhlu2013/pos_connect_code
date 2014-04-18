define(
[
]
,function
(
)
{
	var INTERNET_DISCONNECTED_ERROR_STR = 'Internet is disconnected. Try again later.';

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
		}else if(is_offline_error(error)){
			alert(INTERNET_DISCONNECTED_ERROR_STR);
		}
		else if(is_error_come_from_pouch_for_internet_disconnected(error)){
			alert(INTERNET_DISCONNECTED_ERROR_STR);
		}
		else{
			alert('There is untreated error:' + error);
		}
		
	}

	function is_offline_error(error){
		return is_xhr_obj(error) && error.status == 0;
	}

	function is_error_come_from_pouch_for_internet_disconnected(error)
	{
		return error.__proto__ && error.__proto__.name == 'unknown_error' && error.__proto__.message == 'Database encountered an unknown error'
	}
	return{
		 alert_error : alert_error 
		,is_xhr_obj:is_xhr_obj 
		,is_offline_error:is_offline_error
	}
});