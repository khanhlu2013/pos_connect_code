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
        ui.ui_block('get shortcut ...')
        $.ajax({
             url : '/sale_shortcut/get'
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