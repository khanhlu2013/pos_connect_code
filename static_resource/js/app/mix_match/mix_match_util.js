define(
[
]
,function
(
)
{
	function get_comma_separated_pid_lst(sp_lst){
		var result = "";

		for(var i = 0;i<sp_lst.length;i++){
			result += (',' + sp_lst[i].product_id);
		}

		return result.substr(1);
 	}

 	return {
 		get_comma_separated_pid_lst:get_comma_separated_pid_lst
 	}
});