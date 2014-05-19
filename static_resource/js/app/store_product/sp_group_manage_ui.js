define(
[
     'lib/async'
    ,'lib/error_lib'
    ,'lib/ui/ui'
    ,'app/store_product/sp_group_getter'
    ,'app/group/group_select_ui'
    ,'app/group/group_json_helper'
]
,function
(
     async
    ,error_lib
    ,ui
    ,sp_group_getter
    ,group_select_ui
    ,group_json_helper
)
{
    var ERROR_CANCEL_sp_group_manage_cancel_button_pressed = 'ERROR_CANCEL_sp_group_manage_cancel_button_pressed';
    var GROUP_LST = null;
    var PRODUCT_ID = null;


    function get_group_id_comma_separate_str(){
        var result = "";
        for(var i = 0;i<GROUP_LST.length;i++){
            result += (',' + GROUP_LST[i].id)
        }
        if(result.length > 0){
            result = result.substr(1);
        }        

        return result;
    }

    function set_group(callback){
        var group_id_comma_separated_lst_str = get_group_id_comma_separate_str();
        ui.ui_block('updating group ...');
        $.ajax({
             url : '/product/group/update'
            ,type : "POST"
            ,dataType : "json"
            ,data : {
                group_id_comma_separated_lst_str:group_id_comma_separated_lst_str,
                product_id:PRODUCT_ID
            }
            ,success: function(data,status_str,xhr){
                ui.ui_unblock();
                callback(null)
            }
            ,error: function(xhr,status_str,err){
                ui.ui_unblock();
                callback(xhr);
            }
        }); 
    }

    function refresh_table(){
        var tbl = document.getElementById('sp_group_manage_tbl');
        tbl.innerHTML = '';

        var tr;var td;

        var column_name = ['group','remove']
        tr = tbl.insertRow(-1);        
        for(var i = 0;i<column_name.length;i++){
            td = tr.insertCell(-1);
            td.innerHTML = column_name[i];
        }

        for(var i = 0;i<GROUP_LST.length;i++){
            var group = GROUP_LST[i];
            var tr = tbl.insertRow(-1);

            td = tr.insertCell(-1);
            td.innerHTML = group.name;

            td = tr.insertCell(-1);
            td.innerHTML = 'remove';

            (function(group){
                td.addEventListener('click',function(){
                    for(var i = 0;i<GROUP_LST.length;i++){
                        if(GROUP_LST[i].id == group.id){
                            GROUP_LST.splice(i,1);
                            refresh_table();
                            break;
                        }
                    }
                });
            })(group)
        }

        $(".checkbox_class").each(function()
        {
            $(this).change(function()
            {
                if(!IS_MULTIPLE_SELECTION){
                    $(".checkbox_class").prop('checked',false);
                    $(this).prop('checked',true);
                }
            });
        });             
    }

    function exe(product_id,product_name,callback){
        PRODUCT_ID = product_id;

        var html_str = 
            '<div id="sp_group_manage_dlg">' +
                '<input type="button" id="add_group_2_sp_btn" value="add group">' +            
                '<table id="sp_group_manage_tbl" border="1"></table>' +
            '</div>';
        $(html_str).appendTo('body')
            .dialog(
            {
                modal: true,
                title : product_name,
                zIndex: 10000,
                autoOpen: true,
                width: 800,
                height: 500,
                buttons : 
                [
                    {
                        text:'ok', 
                        click: function(){
                            async.waterfall([set_group],function(error,result){
                                if(error){
                                    error_lib.alert_error(error);
                                    return;
                                }
                                $('#sp_group_manage_dlg').dialog('close');
                                callback(null);
                            });                            
                        }
                    },
                    {
                        text:'cancel',
                        click: function(){
                            $('#sp_group_manage_dlg').dialog('close');
                            callback(ERROR_CANCEL_sp_group_manage_cancel_button_pressed);                        
                        }
                    }
                ],
                open: function( event, ui ) 
                {
                    var sp_group_getter_b = sp_group_getter.exe.bind(sp_group_getter.exe,product_id)
                    async.waterfall([sp_group_getter_b],function(error,result){
                        GROUP_LST = result;
                        refresh_table();
                    });

                    $('#add_group_2_sp_btn').click(function(){
                        var group_select_b = group_select_ui.exe.bind(group_select_ui.exe,true/*multiple_selection*/,true/*empty_group_allow*/);
                        async.waterfall([group_select_b],function(error,result){
                            if(error){
                                error_lib.alert_error(error);
                                return;
                            }

                            var group_lst = result;
                            for(var i = 0;i<result.length;i++){
                                var group = group_lst[i];
                                if(group_json_helper.get_group_from_lst(group.id,GROUP_LST) == null){
                                    GROUP_LST.push(group);
                                }
                            }
                            refresh_table();
                        });
                    });
                },
                close: function (event, ui) {
                    $(this).remove();
                }
            });  
    }

    return{
         exe:exe
        ,ERROR_CANCEL_sp_group_manage_cancel_button_pressed:ERROR_CANCEL_sp_group_manage_cancel_button_pressed
    }
});