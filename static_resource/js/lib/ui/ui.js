define(
[
      'lib/ui/button'
]
,function
(
     ui_button
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
        $.unblockUI();
    }

    function ui_alert(message){
        $('<div></div>').appendTo('body')
            .html('<div><h3>' + message + '</h3></div>')
            .dialog(
            {
                modal: true,
                title: 'info',
                zIndex: 10000,
                autoOpen: true,
                width: 'auto',
                resizable: false,
                buttons: {
                    ok_btn: {
                        id : '_ui_alert_ok_btn',
                        click : function(){
                            $(this).dialog("close");
                        }

                    }
                },
                open: function(event,ui){
                    ui_button.set_css('_ui_alert_ok_btn','green','ok',true);
                },
                close: function (event, ui) {
                    $(this).remove();
                }
            }); 
    }

    function ui_prompt(message,prefill,is_null_allow,callback){
        var html_str = 
            '<div>' +
                '<div><h3>' + message + '</h3></div>' +
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
                ok_btn:{
                    id : '_ui_prompt_ok_btn',
                    click : function () {
                        var result = $('#_prompt_input_text_').val().trim();
                        if(!is_null_allow && result.length == 0){
                            $('#_prompt_input_text_').addClass("error");
                            return;
                        }

                        callback(null,result);
                        $(this).dialog("close");
                    },
                },
                cancel_btn:{
                    id : '_ui_prompt_cancel_btn',
                    click : function () {
                        callback(ERROR_CANCEL_PROMPT);
                        $(this).dialog("close");
                    }
                }
            },
            open: function(event,ui){
                ui_button.set_css('_ui_prompt_ok_btn','green','ok',true);
                ui_button.set_css('_ui_prompt_cancel_btn','orange','remove',true);
                $('#_prompt_input_text_').val(prefill);
            },
            close: function (event, ui) {
                $(this).remove();
            }
        });             
    }

    function ui_confirm(message,yes_func,no_func){
        $('<div></div>').appendTo('body')
            .html('<div><h3>' + message + '</h3></div>')
            .dialog(
            {
                modal: true,
                title: 'confirm',
                zIndex: 10000,
                autoOpen: true,
                width: 'auto',
                resizable: false,
                buttons: {
                    ok_btn:{
                        click : function () {
                            yes_func();
                            $(this).dialog("close");
                        },
                        id : '_confirm_dialog_ok_btn_id'
                    },

                    cancel_btn:{
                        click : function(){
                            if (no_func != undefined){
                                no_func();
                            }
                            $(this).dialog("close");                            
                        },
                        id : '_confirm_dialog_cancel_btn_id'
                    }
                },
                open: function( event, ui ){ 
                    ui_button.set_css('_confirm_dialog_ok_btn_id','green','ok',true);
                    ui_button.set_css('_confirm_dialog_cancel_btn_id','orange','remove',true);
                },
                close: function (event, ui) {
                    $(this).remove();
                }
            });     
    }

    function angular_alert($modal,title,message,warning_level){
        
        var warning_class = ""
        if(warning_level == 1){
            warning_class = 'alert alert-success'
        }else if(warning_level == 2){
            warning_class = 'alert alert-info'
        }else if(warning_level == 3){
            warning_class = 'alert alert-warning'
        }else if(warning_level == 4){
            warning_class = 'alert alert-danger'
        }


        var template = 
            '<div class="modal-header ' + warning_class + '">' +
                '<h3 class="modal-title">' + title + '</h3>' +
            '</div>' +
            '<div class="modal-body">' +
                '<h1>' + message + '</h1>' +
            '</div>' +
            '<div class="modal-footer">' +
                '<button type="submit" class="btn btn-primary" ng-click="ok()">OK</button>' +
            '</div>'
        ;


        var AlertCtrl = function($scope,$modalInstance){
            $scope.ok = function(){
                $modalInstance.close();
            }
        }
        ModalCtrl.$inject = ['$scope','$modalInstance'];
        var dlg = $modal.open({
            template : template,
            controller : AlertCtrl,
            size : 'sm'
        });
    }

    return {
         ui_confirm:ui_confirm
        ,ui_alert:ui_alert
        ,ui_block:ui_block
        ,ui_unblock:ui_unblock
        ,ui_prompt:ui_prompt
        ,angular_alert:angular_alert
        ,ERROR_CANCEL_PROMPT:ERROR_CANCEL_PROMPT
    }
});