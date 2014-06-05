define(
[
     'lib/async'
    ,'lib/error_lib'
    ,'lib/ui/ui'
    ,'app/tax/tax_validate'
    ,'app/tax/tax_set'
]
,function
(
     async
    ,error_lib
    ,ui
    ,tax_validate
    ,tax_set
)
{
    var ERROR_CANCEL_tax_manage_ui_cancel_button_press = 'ERROR_CANCEL_tax_manage_ui_cancel_button_press';

    function set_validation_indicator(error_lst){
        $('#tax_rate_txt').removeClass("error");  

        if(error_lst.indexOf(tax_validate.ERROR_TAX_RATE_VALIDATION_TAX_RATE) != -1){
            $('#tax_rate_txt').addClass("error");  
        }
    }

    function exe(callback){
        
        var html_str = 
            '<div id="set_tax_rate_dlg">' +
                '<input id="tax_rate_txt">' +
            '</div>';

        $(html_str).appendTo('body')
            .dialog(
            {
                modal: true,
                title : 'set tax',
                zIndex: 10000,
                autoOpen: true,
                width: 300,
                height: 200,
                buttons : 
                [
                    {
                        text:'ok',
                        click:function(){
                            var tax_rate_str = $('#tax_rate_txt').val();
                            var error_lst = tax_validate.exe(tax_rate_str);

                            if(error_lst.length!=0){
                                set_validation_indicator(error_lst)
                                return;
                            }else{
                                var tax_rate_num = Number(tax_rate_str);
                                var tax_set_b = tax_set.exe.bind(tax_set.exe,tax_rate_num);
                                async.waterfall([tax_set_b],function(error,result/*tax_rate*/){
                                    $("#set_tax_rate_dlg").dialog("close");
                                    localStorage.setItem('tax_rate',result);
                                    callback(null/*error*/,result);    
                                });
                            }
                        }
                    },                
                    {
                        text:'cancel',
                        click: function(){
                            $('#set_tax_rate_dlg').dialog('close');
                            callback(ERROR_CANCEL_tax_manage_ui_cancel_button_press);
                        }
                    }
                ],
                open: function( event, ui ) 
                {
                    var tax_rate = parseFloat(localStorage.getItem('tax_rate'));
                    $('#tax_rate_txt').val(tax_rate);
                },
                close: function (event, ui) {
                    $(this).remove();
                }
            });  
    }

    return{
         exe:exe
        ,ERROR_CANCEL_tax_manage_ui_cancel_button_press:ERROR_CANCEL_tax_manage_ui_cancel_button_press
    }
});