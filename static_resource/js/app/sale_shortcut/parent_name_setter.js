define(
    [
        'lib/ui/ui'
    ],
    function
    (
        ui
    )
{
    return function (name,position,callback){
        
        var data = {
             name:name
            ,position:position
        }        
        ui.ui_block('setting group name ...')
        $.ajax({
             url : "/sale_shortcut/set_parent_name"
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
});