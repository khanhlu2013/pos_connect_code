define(
[
    'lib/ui/ui'
]
,function
(
    ui
)
{
    function exe(callback){
        ui.ui_block('get group data ...')
        $.ajax({
             url : '/group/get_lst'
            ,type : 'GET'
            ,dataType : 'json'
            ,data : null
            ,success : function(data,status_str,xhr){
                ui.ui_unblock();
                callback(null/*error*/,data);
            }
            ,error : function(xhr,status_str,err){
                ui.ui_unblock();
                callback(xhr);
            }
        });
    }

    return {
    	exe:exe
    }
});