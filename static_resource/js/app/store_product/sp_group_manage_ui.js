define(
[
     'lib/async'
    ,'lib/error_lib'
    ,'lib/ui/ui'
    ,'app/store_product/sp_group_getter'
    ,'app/group/group_select_ui'
    ,'app/group/group_json_helper'
    ,'lib/ui/table'
    ,'lib/ui/button'
]
,function
(
     async
    ,error_lib
    ,ui
    ,sp_group_getter
    ,group_select_ui
    ,group_json_helper
    ,ui_table
    ,ui_button
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
        var tr;var td;
        tbl.innerHTML = "";

        for(var i = 0;i<GROUP_LST.length;i++){
            var group = GROUP_LST[i];
            var tr = tbl.insertRow(-1);

            td = tr.insertCell(-1);
            td.innerHTML = group.name;

            td = tr.insertCell(-1);
            td.innerHTML = '<span class="glyphicon glyphicon-trash"></span>';
            td.className = 'danger';
            (function(group){
                td.addEventListener('click',function(){
                    ui.ui_confirm('remove?',function(){
                        for(var i = 0;i<GROUP_LST.length;i++){
                            if(GROUP_LST[i].id == group.id){
                                GROUP_LST.splice(i,1);
                                refresh_table();
                                break;
                            }
                        }
                    });
                });
            })(group)
        }
        var col_info_lst = 
        [
            {caption:"group",width:70},
            {caption:"remove",width:10},
        ];
        ui_table.set_header(col_info_lst,tbl);
    }

    function exe(product_id,product_name,callback){
        PRODUCT_ID = product_id;

        var html_str = 
            '<div id="sp_group_manage_dlg">' +
                '<button type="button" id="_add_group_2_sp_btn" class="btn btn-primary">' +
                    '<span class="glyphicon glyphicon-plus"></span>'+
                '</button>' +
                '<table id="sp_group_manage_tbl" class="table table-striped table-bordered table-hover table-condensed"></table>' +
                '</table>' +
            '</div>';
        $(html_str).appendTo('body')
            .dialog(
            {
                modal: true,
                title : 'manage group for: ' + product_name,
                zIndex: 10000,
                autoOpen: true,
                width: 500,
                height: 500,
                buttons : 
                {
                    ok_btn:{
                        id:'_sp_group_manage_ok_btn', 
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
                    cancel_btn:{
                        id:'_sp_group_manage_cancel_btn', 
                        click: function(){
                            $('#sp_group_manage_dlg').dialog('close');
                            callback(ERROR_CANCEL_sp_group_manage_cancel_button_pressed);                        
                        }
                    }
                },
                open: function( event, ui ) 
                {
                    ui_button.set_css('_sp_group_manage_ok_btn','green','ok',true);
                    ui_button.set_css('_sp_group_manage_cancel_btn','orange','remove',true);
                    var sp_group_getter_b = sp_group_getter.exe.bind(sp_group_getter.exe,product_id)
                    async.waterfall([sp_group_getter_b],function(error,result){
                        GROUP_LST = result;
                        refresh_table();
                    });

                    $('#_add_group_2_sp_btn').click(function(){
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