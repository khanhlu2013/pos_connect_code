define(
[
	 'lib/async'
	,'lib/error_lib' 
	,'app/group/group_prompt'
	,'app/store_product/store_product_util'
]
,function
(
	 async
	,error_lib 
	,group_prompt
	,sp_util
)
{
	function ajax_insert(result,callback){
 		var pid_comma_separated_lst_str = sp_util.get_comma_separated_pid_lst(result.group_child_sp_lst);

        var data = {
             name:result.name
            ,pid_comma_separated_lst_str:pid_comma_separated_lst_str
        }        

        $.ajax({
             url : "/group/insert"
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

    function exe(callback){
        var group_prompt_b = group_prompt.exe.bind(group_prompt.exe
            ,null//name
            ,[]//group_child_sp_lst
        );

        async.waterfall([group_prompt_b,ajax_insert],function(error,result){
        	callback(error,result);
        });
    }

    return {
        exe:exe
    }
});


