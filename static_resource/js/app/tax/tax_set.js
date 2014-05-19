define(
[
    'lib/ui/ui'
]
,function
(
    ui
)
{
    function exe(tax_rate,callback){
        ui.ui_block('setting tax rate ...')
        $.ajax({
             url : '/tax/update'
            ,type : 'POST'
            ,dataType : 'json'
            ,data : {tax_rate:tax_rate}
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