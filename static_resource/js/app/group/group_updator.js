define(
[
	 'lib/async'
	,'app/group/group_prompt'
    ,'app/store_product/store_product_util'
]
,function
(
	 async
	,group_prompt
    ,sp_util
)
{
    function ajax_update(id,result,callback){
        var pid_comma_separated_lst_str = sp_util.get_comma_separated_pid_lst(result.group_child_sp_lst);

        var data = {
             id:id
            ,name:result.name
            ,qty:result.qty
            ,unit_discount:result.unit_discount
            ,pid_comma_separated_lst_str:pid_comma_separated_lst_str
        }        

        $.ajax({
             url : "/group/update"
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

    function exe(group,callback){
        var group_child_sp_lst = [];
        for(var i = 0;i<group.group_child_set.length;i++){
            group_child_sp_lst.push(group.group_child_set[i].store_product);
        }
        var group_prompt_b = group_prompt.exe.bind(group_prompt.exe
            ,group.name
            ,group_child_sp_lst
        );
        var ajax_update_b = ajax_update.bind(ajax_update,group.id)
        async.waterfall([group_prompt_b,ajax_update_b],function(error,result){
            callback(error,result);
        });        
    }

    return{
    	exe:exe
    }	
});