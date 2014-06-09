define(
[
     'lib/async'
    ,'app/store_product/sp_search_ui' 
    ,'lib/error_lib'
    ,'app/sale_shortcut/sale_shortcut_validate'
]
,function
(
     async
    ,sp_search_ui
    ,error_lib
    ,sale_shortcut_validate
)
{
    var PRODUCT_ID = null;
    var ERROR_CANCEL_shortcut_setup_cancel = 'ERROR_CANCEL_shortcut_setup_cancel';
    var ERROR_remove_button_pressed = 'ERROR_remove_button_pressed';

    function validate_ui(error_lst){
        $('#_product_name_txt').removeClass('error');
        $('#_child_caption_txt').removeClass('error');

        if(error_lst.indexOf(sale_shortcut_validate.ERROR_SALE_SHORTCUT_PRODUCT_EMTPY)!= -1){
            $('#_product_name_txt').addClass('error');
        }
        if(error_lst.indexOf(sale_shortcut_validate.ERROR_SALE_SHORTCUT_CAPTION_EMTPY)!= -1){
            $('#_child_caption_txt').addClass('error');
        }
    }

    function ok_handler(callback){
        var caption = $('#_child_caption_txt').val().trim();
        var error_lst = sale_shortcut_validate.exe(PRODUCT_ID,caption)
        if(error_lst.length != 0){
            validate_ui(error_lst);
        }else{
            $('#_child_info_prompt_dlg').dialog('close');
            var result = {product_id:PRODUCT_ID,caption:caption};
            callback(null,result);            
        }
    }

    function cancel_handler(callback){
        $('#_child_info_prompt_dlg').dialog('close');
        callback(ERROR_CANCEL_shortcut_setup_cancel);
    }

    function remove_handler(callback){
        $('#_child_info_prompt_dlg').dialog('close');
        callback(ERROR_remove_button_pressed);
    }



    function name_search_handler(){
        var sp_search_ui_b = sp_search_ui.exe.bind(sp_search_ui.exe,false/*single selection*/)
        async.waterfall([sp_search_ui_b],function(error,result){
            if(error){
                error_lib.alert_error(error);
                return;
            }

            var sp = result;
            PRODUCT_ID = sp.product_id;
            $('#_product_name_txt').val(sp.name);
        });
    }

    function exe(caption,product_name,product_id,callback){

        var html_str =     
            '<div id="_child_info_prompt_dlg">' +
                '<label for="_child_caption_txt">caption:</label>' +
                '<input type="text" id = "_child_caption_txt">' +
                '<br>' + 
                '<label for="_product_name_txt">product:</label>' +
                '<input type="text" id = "_product_name_txt" readonly>' +
                '<input type="button" id = "_mm_child_prompt_product_search_btn" value="search">' +
                '<br>' +
            '</div>';

        var ok_handler_b = ok_handler.bind(ok_handler,callback);
        var cancel_handler_b = cancel_handler.bind(cancel_handler,callback);
        var remove_handler_b = remove_handler.bind(remove_handler,callback);

        $(html_str).appendTo('body')
            .dialog(
            {
                modal: true,
                title : 'shortcut setup',
                zIndex: 10000,
                autoOpen: true,
                width: 500,
                height: 250,   
                buttons:   [
                     {text:'ok',click:ok_handler_b}
                    ,{text:'remove',click:remove_handler_b}
                    ,{text:'cancel',click:cancel_handler_b}
                ],
                open: function( event, ui ) 
                {
                    PRODUCT_ID = product_id;
                    $('#_mm_child_prompt_product_search_btn').click(name_search_handler);
                    $('#_child_caption_txt').val(caption);
                    $('#_product_name_txt').val(product_name);        
                    $('#_child_info_prompt_dlg').keypress(function(e) {
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
        ,ERROR_CANCEL_shortcut_setup_cancel:ERROR_CANCEL_shortcut_setup_cancel
        ,ERROR_remove_button_pressed:ERROR_remove_button_pressed
    };
});