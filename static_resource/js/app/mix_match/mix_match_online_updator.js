define(
[
	 'lib/async'
	,'app/mix_match/mix_match_validator'
	,'app/mix_match/mix_match_util'
]
,function
(
	 async
	,mm_validator 
	,mm_util
)
{
	var ERROR_MIX_MATCH_VALIDATION_FAIL = 'ERROR_MIX_MATCH_VALIDATION_FAIL';

	function exe(id,name,qty,unit_discount,mix_match_child_sp_lst,callback){
		var error_lst = mm_validator.validate(name,qty,unit_discount,mix_match_child_sp_lst);
		if(error_lst.length!=0){
			callback(ERROR_MIX_MATCH_VALIDATION_FAIL);
			return;
		}

		var pid_comma_separated_lst_str = mm_util.get_comma_separated_pid_lst(mix_match_child_sp_lst);

        var data = {
        	 id:id
            ,name:name
            ,qty:qty
            ,unit_discount:unit_discount
            ,pid_comma_separated_lst_str:pid_comma_separated_lst_str
        }        

        $.ajax({
             url : "/mix_match/update"
            ,type : "POST"
            ,dataType: "json"
            ,data : data
            ,success : function(data,status_str,xhr) {
                callback(null,data);
            }
            ,error : function(xhr,status_str,err) {
                callback(xhr);
            }
        });

	}

	return {
		 exe:exe
		,ERROR_MIX_MATCH_VALIDATION_FAIL:ERROR_MIX_MATCH_VALIDATION_FAIL
	}
});