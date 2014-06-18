define(
[
     'lib/error_lib'
    ,'lib/async'
    ,'lib/ajax_helper'
    ,'lib/ui/button'
    ,'lib/ui/ui'

]
,function
(
     error_lib
    ,async
    ,ajax_helper
    ,ui_button
    ,ui
)
{
    var ERROR_CANCEL_PAYMENT_TYPE_PROMPT = 'ERROR_CANCEL_PAYMENT_TYPE_PROMPT';
    var ERROR_DELETE_PAYMENT_TYPE = 'ERROR_DELETE_PAYMENT_TYPE';

    function exe(prefill,callback){
        var html_str = 
            '<div id="payment_type_prompt_dlg">' +
                '<input id="payment_type_name_txt">' +
            '</div>';

        $(html_str).appendTo('body')
            .dialog(
            {
                modal: true,
                title : 'enter payment type',
                zIndex: 10000,
                autoOpen: true,
                width: 300,
                buttons : 
                {
                    ok_btn: {
                        id:'_payment_type_prompt_ok_btn',
                        click:function(){
                            var name = $('#payment_type_name_txt').val().trim();
                            if(name.length == 0){
                                $('#payment_type_name_txt').addClass('error');
                                return;
                            }
                            callback(null,name);
                            $('#payment_type_prompt_dlg').dialog('close');
                        }
                    },        
                    delete_btn: {
                        id:'_payment_type_prompt_delete_btn',
                        click: function(){
                            ui.ui_confirm('delete?',function(){
                                $('#payment_type_prompt_dlg').dialog('close');
                                callback(ERROR_DELETE_PAYMENT_TYPE);
                            });
                        }
                    },                              
                    cancel_btn:{
                        id:'_payment_type_prompt_cancel_btn',
                        click: function(){
                            $('#payment_type_prompt_dlg').dialog('close');
                            callback(ERROR_CANCEL_PAYMENT_TYPE_PROMPT);
                        }
                    }
                },
                open: function( event, ui ) 
                {
                    ui_button.set_css('_payment_type_prompt_ok_btn','green','ok',true);
                    ui_button.set_css('_payment_type_prompt_delete_btn','red','trash',true);
                    ui_button.set_css('_payment_type_prompt_cancel_btn','orange','remove',true);
                    $('#_payment_type_prompt_delete_btn').prop('disabled',prefill == null);
                    $('#payment_type_name_txt').val(prefill);
                },
                close: function (event, ui) {
                    $(this).remove();
                }
            });               
    }

    return{
         ERROR_CANCEL_PAYMENT_TYPE_PROMPT : ERROR_CANCEL_PAYMENT_TYPE_PROMPT
        ,ERROR_DELETE_PAYMENT_TYPE : ERROR_DELETE_PAYMENT_TYPE
        ,exe:exe
    }

});