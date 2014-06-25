define(
[
	 'lib/async'
	,'app/group/group_prompt'
    ,'app/store_product/store_product_util'
    ,'lib/ui/ui'
    ,'app/group/group_getter'
    ,'lib/error_lib'
]
,function
(
	 async
	,group_prompt
    ,sp_util
    ,ui
    ,group_getter
    ,error_lib
)
{
    function ajax_update(id,result,callback){
        var pid_comma_separated_lst_str = sp_util.get_comma_separated_pid_lst(result.group_sp_lst);

        var data = {
             id:id
            ,name:result.name
            ,pid_comma_separated_lst_str:pid_comma_separated_lst_str
        }        
        ui.ui_block('updating group ...');
        $.ajax({
             url : "/group/update"
            ,type : "POST"
            ,dataType: "json"
            ,data : data
            ,success : function(data,status_str,xhr) {
                ui.ui_unblock();
                callback(null,data);
            }
            ,error : function(xhr,status_str,err) {
                ui.ui_unblock();
                callback(xhr);
            }
        });        
    }

    function exe(group_id,callback){
        var group_getter_b = group_getter.get_item.bind(group_getter.get_item,group_id);
        async.waterfall([group_getter_b],function(error,result){
            if(error){
                error_lib.alert_error(error);
                return;
            }

            group = result;
            var group_sp_lst = [];
            for(var i = 0;i<group.store_product_set.length;i++){
                group_sp_lst.push(group.store_product_set[i]);
            }
            var group_prompt_b = group_prompt.exe.bind(group_prompt.exe
                ,group.name
                ,group_sp_lst
            );
            var ajax_update_b = ajax_update.bind(ajax_update,group.id)
            async.waterfall([group_prompt_b,ajax_update_b],function(error,result){
                callback(error,result);
            });              
        });
    }

    return{
    	exe:exe
    }	
});