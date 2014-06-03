define(
[
     'lib/async'
    ,'app/group/group_json_helper'
    ,'app/group/group_lst_getter'    
    ,'lib/error_lib'
    ,'lib/ui/ui'

]
,function
(
     async
    ,group_json_helper
    ,group_lst_getter
    ,error_lib
    ,ui
)
{
    var ERROR_CANCEL_group_select_cancel_button_press = 'ERROR_CANCEL_group_select_cancel_button_press';

    var GROUP_LST = null;
    var IS_MULTIPLE_SELECTION = null;

    function group_data_2_ui(){
        var tbl = document.getElementById('group_select_tbl');
        tbl.innerHTML = '';

        var tr;var td;

        var column_name = ['name','select']
        tr = tbl.insertRow(-1);        
        for(var i = 0;i<column_name.length;i++){
            td = tr.insertCell(-1);
            td.innerHTML = column_name[i];
        }

        for(var i = 0;i<GROUP_LST.length;i++){
            var tr = tbl.insertRow(-1);

            td = tr.insertCell(-1);
            td.innerHTML = GROUP_LST[i].name;

            td = tr.insertCell(-1);
            td.innerHTML = '<input type="checkbox" class="checkbox_class" id=' + '"' + GROUP_LST[i].id + '"' + '>';
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

    function exe(is_multiple_selection,is_empty_group_allow,callback){
        IS_MULTIPLE_SELECTION = is_multiple_selection; //callback return will be lst or object depend on this param
        var html_str = 
            '<div id="group_select_dlg">' +
                '<table id="group_select_tbl" border="1"></table>' +
            '</div>';

        $(html_str).appendTo('body')
            .dialog(
            {
                modal: true,
                title : 'select group',
                zIndex: 10000,
                autoOpen: true,
                width: 800,
                height: 500,
                buttons : 
                [
                    {
                        text:'ok',
                        click:function(){
                            var result_lst = [];

                            $(".checkbox_class").each(function()
                            {
                                if($(this).is(':checked')){
                                    var group_id = $(this).attr('id');
                                    var group = group_json_helper.get_group_from_lst(group_id,GROUP_LST);
                                    result_lst.push(group);
                                }
                            });                        

                            if(result_lst.length == 0){
                                ui.ui_alert('you select nothing');
                                return;
                            }else{

                                if(!is_empty_group_allow){
                                    for(var i = 0;i<result_lst.length;i++){
                                        if(result_lst[i].store_product_set.length == 0){
                                            ui.ui_alert('group is emtpy');
                                            return;
                                        }
                                    }                                        
                                }


                                if(IS_MULTIPLE_SELECTION){
                                    $('#group_select_dlg').dialog('close');
                                    callback(null,result_lst);                                      
                                }else{
                                    if(result_lst.length > 1){
                                        ui.ui_alert('bug');
                                        return;                                        
                                    }else{
                                        $('#group_select_dlg').dialog('close');
                                        callback(null,result_lst[0]);                                               
                                    }
                                }
                            }
                        }
                    },                
                    {
                        text:'cancel',
                        click: function(){
                            $('#group_select_dlg').dialog('close');
                            callback(ERROR_CANCEL_group_select_cancel_button_press);                        
                        }
                    }
                ],
                open: function( event, ui_ ) 
                {
                    async.waterfall([group_lst_getter.exe],function(error,result){
                        if(error){
                            error_lib.alert_error(error);
                            return;
                        }else{
                            GROUP_LST = result;
                            group_data_2_ui();
                        }
                    })
                },
                close: function (event, ui) {
                    $(this).remove();
                }
            });  
    }

    return{
         exe:exe
        ,ERROR_CANCEL_group_select_cancel_button_press:ERROR_CANCEL_group_select_cancel_button_press
    }
});