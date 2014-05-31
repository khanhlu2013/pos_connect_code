define(
[
    'lib/ui/ui'
]
,function
(
    ui
)
{
    function exe(url,type,block_message,data,callback){
        ui.ui_block(block_message)
        $.ajax({
             url : url
            ,type : type
            ,dataType : 'json'
            ,data : JSON.stringify(data)
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