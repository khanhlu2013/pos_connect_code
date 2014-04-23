define(
[
	 'lib/async'
	,'app/mix_match/mix_match_validator'
]
,function
(
	 async
	,mm_validator 
)
{
	var ERROR_MIX_MATCH_VALIDATION_FAIL = 'ERROR_MIX_MATCH_VALIDATION_FAIL';

	function exe(name,qty,unit_discount,mix_match_child_lst,callback){
		var error_lst = mm_validator.validate(name,qty,unit_discount,mix_match_child_lst);
		if(error_lst.length!=0){
			callback(ERROR_MIX_MATCH_VALIDATION_FAIL);
			return;
		}

		var pid_lst = [];
		for(var i = 0;i<mix_match_child_lst.length;i++){
			pid_lst.push(mix_match_child_lst[i].product_id)
		}

        var data = {
             name:name
            ,qty:qty
            ,unit_discount:unit_discount
            ,mix_match_child_pid_lst:pid_lst
        }        

        $.ajax({
             url : "/mix_match/insert"
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