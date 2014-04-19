define(
[
     'lib/async'
    ,'app/store_product/sp_online_searcher'
    ,'app/store_product/sp_online_name_search_ui' 
    ,'lib/error_lib'
]
,function
(
     async
    ,sp_online_searcher
    ,sp_online_name_search_ui
    ,error_lib
)
{
    var RETURN_PID = null;
    var ERROR_CANCEL_shortcut_setup_cancel = 'ERROR_CANCEL_shortcut_setup_cancel';
    var ERROR_remove_button_pressed = 'ERROR_remove_button_pressed';

    function ok_handler(callback){
        if(RETURN_PID == null){
            alert('Product is emtpy. Please select product.');
            return;
        }

        var caption = $('#child_caption_txt').val().trim();
        if(caption.length == 0){
            alert('Caption is emtpy. Please enter caption.');
            return;            
        }

        $('#child_info_prompt_dlg').dialog('close');
        var result = {pid:RETURN_PID,caption:caption};
        callback(null,result);
    }

    function cancel_handler(callback){
        $('#child_info_prompt_dlg').dialog('close');
        callback(ERROR_CANCEL_shortcut_setup_cancel);
    }

    function remove_handler(callback){
        $('#child_info_prompt_dlg').dialog('close');
        callback(ERROR_remove_button_pressed);
    }

    function init_ok_remove_cancel_btn(callback){
        var ok_handler_b = ok_handler.bind(ok_handler,callback);
        var cancel_handler_b = cancel_handler.bind(cancel_handler,callback);
        var remove_handler_b = remove_handler.bind(remove_handler,callback);

        $('#child_info_prompt_dlg').dialog({
             title:'shortcut setup'
            ,buttons:   [
                             {text:'ok',click:ok_handler_b}
                            ,{text:'remove',click:remove_handler_b}
                            ,{text:'cancel',click:cancel_handler_b}
                        ]
            ,width: 500
            ,height: 250                        
            ,modal:true
        });        
    }

    function name_search_handler(){
        async.waterfall([sp_online_name_search_ui.exe],function(error,result){
            if(error){
                error_lib.alert_error(error);
                return;
            }

            var sp = result;
            RETURN_PID = sp.product_id;
            $('#product_name_txt').val(sp.name);
        });
    }

    function exe(caption,product_name,pid,callback){
        
        RETURN_PID = pid;
        init_ok_remove_cancel_btn(callback);
        $('#product_search_btn').off('click').click(name_search_handler);

        $('#child_caption_txt').val(caption);
        $('#product_name_txt').val(product_name);
        
        $('#child_info_prompt_dlg').dialog('open');
    }

    return {
         exe:exe
        ,ERROR_CANCEL_shortcut_setup_cancel:ERROR_CANCEL_shortcut_setup_cancel
        ,ERROR_remove_button_pressed:ERROR_remove_button_pressed
    };
});