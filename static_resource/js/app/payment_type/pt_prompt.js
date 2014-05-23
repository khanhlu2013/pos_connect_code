define(
[
     'lib/error_lib'
    ,'lib/async'
    ,'lib/ajax_helper'

]
,function
(
     error_lib
    ,async
    ,ajax_helper
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
                height: 200,
                buttons : 
                [
                    {
                        text:'ok',
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
                    {
                        text:'delete',
                        click: function(){
                            $('#payment_type_prompt_dlg').dialog('close');
                            callback(ERROR_DELETE_PAYMENT_TYPE);
                        }
                    },                              
                    {
                        text:'cancel',
                        click: function(){
                            $('#payment_type_prompt_dlg').dialog('close');
                            callback(ERROR_CANCEL_PAYMENT_TYPE_PROMPT);
                        }
                    }
                ],
                open: function( event, ui ) 
                {
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