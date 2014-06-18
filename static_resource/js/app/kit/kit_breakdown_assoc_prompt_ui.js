define(
[
     'lib/async'
    ,'app/store_product/sp_search_ui' 
    ,'lib/error_lib'
    ,'app/kit/kit_breakdown_assoc_validate'
    ,'lib/ui/button'
]
,function
(
     async
    ,sp_search_ui
    ,error_lib
    ,kit_breakdown_assoc_validate
    ,ui_button
)
{
    var RET_SP = null;
    var ERROR_CANCEL_kit_breakdown_assoc_prompt_cancel = 'ERROR_CANCEL_kit_breakdown_assoc_prompt_cancel';
    var ERROR_kit_breakdown_remove_button_pressed = 'ERROR_kit_breakdown_remove_button_pressed';

    function refresh_ui_validation(error_lst){
        $('#_kit_breakdown_assoc_sp_txt').removeClass('error');
        $('#_kit_breakdown_assoc_qty_txt').removeClass('error');

        if(error_lst.indexOf(kit_breakdown_assoc_validate.ERROR_KIT_BREAKDOWN_ASSOC_VALIDATION_SP) != -1){
             $('#_kit_breakdown_assoc_sp_txt').addClass('error');
        }
        if(error_lst.indexOf(kit_breakdown_assoc_validate.ERROR_KIT_BREAKDOWN_ASSOC_VALIDATION_QTY) != -1){
             $('#_kit_breakdown_assoc_qty_txt').addClass('error');
        }        
    }

    function ok_handler(callback){
        var qty_str = $('#_kit_breakdown_assoc_qty_txt').val().trim();
        var error_lst = kit_breakdown_assoc_validate.exe(RET_SP,qty_str);
        if(error_lst.length!=0){
            refresh_ui_validation(error_lst);
        }else{
            $('#_kit_breakdown_assoc_prompt_dlg').dialog('close');
            var result = {sp:RET_SP,qty:parseInt(qty_str)};
            callback(null,result);            
        }
    }

    function cancel_handler(callback){
        $('#_kit_breakdown_assoc_prompt_dlg').dialog('close');
        callback(ERROR_CANCEL_kit_breakdown_assoc_prompt_cancel);
    }

    function remove_handler(callback){
        $('#_kit_breakdown_assoc_prompt_dlg').dialog('close');
        callback(ERROR_kit_breakdown_remove_button_pressed);
    }

    function name_search_handler(){
        var sp_search_ui_b = sp_search_ui.exe.bind(sp_search_ui.exe,false/*single selection*/)
        async.waterfall([sp_search_ui_b],function(error,result){
            if(error){
                error_lib.alert_error(error);
                return;
            }
            RET_SP = result;
            $('#_kit_breakdown_assoc_sp_txt').val(RET_SP.name);
        });
    }

    function exe(sp,qty,callback){

        var html_str =     
            '<div id="_kit_breakdown_assoc_prompt_dlg">' +
                '<div class="form-horizontal">' +

                    '<div class="form-group">' +
                        '<label for="_kit_breakdown_assoc_qty_txt" class="col-sm-4 control-label" >qty:</label>' +
                        '<div class="col-sm-8">' +
                            '<input type="text" id = "_kit_breakdown_assoc_qty_txt">' +
                        '</div>' +
                    '</div>' +

                    '<div class="form-group">' +
                        '<label for="_kit_breakdown_assoc_sp_txt" class="col-sm-4 control-label">product:</label>' +
                        '<div class="col-sm-8">' +
                            '<input type="text" id = "_kit_breakdown_assoc_sp_txt" readonly>' +
                            '<button id = "_kit_breakdown_assoc_sp_btn" class="btn btn-primary">' +
                                '<span class="glyphicon glyphicon-search"></span>' +
                            '</button>' +
                        '</div>' +
                    '</div>' +

                '</div>' +
            '</div>';

        var ok_handler_b = ok_handler.bind(ok_handler,callback);
        var cancel_handler_b = cancel_handler.bind(cancel_handler,callback);
        var remove_handler_b = remove_handler.bind(remove_handler,callback);

        $(html_str).appendTo('body')
            .dialog(
            {
                modal: true,
                title : 'kit breakdown',
                zIndex: 10000,
                autoOpen: true,
                width: 500,
                height: 250,   
                buttons:   
                {
                     ok_btn:{id:'_kit_breakdown_prompt_ok_btn',click:ok_handler_b}
                    ,remove_btn:{id:'_kit_breakdown_prompt_remove_btn',click:remove_handler_b}
                    ,cancel_btn:{id:'_kit_breakdown_prompt_cancel_btn',click:cancel_handler_b}
                },
                open: function( event, ui ) 
                {
                    ui_button.set_css('_kit_breakdown_prompt_ok_btn','green','ok',true);
                    ui_button.set_css('_kit_breakdown_prompt_remove_btn','red','trash',true);
                    ui_button.set_css('_kit_breakdown_prompt_cancel_btn','orange','remove',true);
                    $('#_kit_breakdown_prompt_remove_btn').prop('disabled',sp==null)
                    RET_SP = sp;
                    $('#_kit_breakdown_assoc_sp_btn').click(name_search_handler);
                    $('#_kit_breakdown_assoc_sp_txt').val(sp == null ? "" : sp.name);
                    $('#_kit_breakdown_assoc_qty_txt').val(qty);        
                    $('#_kit_breakdown_assoc_prompt_dlg').keypress(function(e) {
                        if (e.keyCode == $.ui.keyCode.ENTER) {
                            ok_handler(callback);
                        }
                    });                                   
                },
                close: function (event, ui) {
                    $(this).remove();
                }
            }); 
    }

    return {
         exe:exe
        ,ERROR_CANCEL_kit_breakdown_assoc_prompt_cancel:ERROR_CANCEL_kit_breakdown_assoc_prompt_cancel
        ,ERROR_kit_breakdown_remove_button_pressed:ERROR_kit_breakdown_remove_button_pressed
    };
});