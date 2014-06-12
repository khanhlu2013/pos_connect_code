define(
[
     'jquery'
    ,'jquery_ui'
]
,function
(

)
{
    var ERROR_CANCEL_PROMPT = 'ERROR_CANCEL_PROMPT';

    function ui_block(message){
        $.blockUI({
            message: '<h2>' + message + '</h2>',
            css: {
                border: 'none', 
                padding: '15px', 
                backgroundColor: '#000', 
                '-webkit-border-radius': '10px', 
                '-moz-border-radius': '10px', 
                opacity: .5, 
                color: '#fff' 
            } 
        });         
    }

    function ui_unblock(){
        $.unblockUI()
    }

    function ui_alert(message){
        $('<div></div>').appendTo('body')
            .html('<div><h6>' + message + '</h6></div>')
            .dialog(
            {
                modal: true,
                title: 'info',
                zIndex: 10000,
                autoOpen: true,
                width: 'auto',
                resizable: false,
                buttons: {
                    Ok: function () {
                        $(this).dialog("close");
                    }
                },
                close: function (event, ui) {
                    $(this).remove();
                }
            }); 
    }

    function ui_prompt(message,prefill,is_null_allow,callback){
        var html_str = 
            '<div>' +
                '<h6>' + message + '</h6>' +
                '<input type="text" id="_prompt_input_text_">' +
            '</div>'
        ;

        $(html_str).appendTo('body').dialog(
            {
                modal: true,
                title: 'prompt',
                zIndex: 10000,
                autoOpen: true,
                width: 'auto',
                resizable: false,
                buttons: {
                    Ok: function () {
                        var result = $('#_prompt_input_text_').val().trim();
                        if(!is_null_allow && result.length == 0){
                            $('#_prompt_input_text_').addClass("error");
                            return;
                        }

                        callback(null,result);
                        $(this).dialog("close");
                    },
                    Cancel: function () {
                        callback(ERROR_CANCEL_PROMPT);
                        $(this).dialog("close");
                    }
                },
                open: function(event,ui){
                    $('#_prompt_input_text_').val(prefill);
                },
                close: function (event, ui) {
                    $(this).remove();
                }
            });             
    }

    function ui_confirm(message,yes_func,no_func){
        $('<div></div>').appendTo('body')
            .html('<div><h6>' + message + '</h6></div>')
            .dialog(
            {
                modal: true,
                title: 'confirm',
                zIndex: 10000,
                autoOpen: true,
                width: 'auto',
                resizable: false,
                buttons: {
                    Yes: function () {
                        yes_func();
                        $(this).dialog("close");
                    },
                    No: function () {
                        no_func();
                        $(this).dialog("close");
                    }
                },
                close: function (event, ui) {
                    $(this).remove();
                }
            });     
    }

    return {
         ui_confirm:ui_confirm
        ,ui_alert:ui_alert
        ,ui_block:ui_block
        ,ui_unblock:ui_unblock
        ,ui_prompt:ui_prompt
        ,ERROR_CANCEL_PROMPT:ERROR_CANCEL_PROMPT
    }
});