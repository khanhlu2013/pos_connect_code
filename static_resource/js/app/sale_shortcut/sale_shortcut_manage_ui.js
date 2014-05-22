define(
[
     'lib/async'
    ,'lib/error_lib'
    ,'lib/ui/ui'
    ,'app/sale_shortcut/sale_shortcut_get'
    ,'app/sale_shortcut/parent_name_setter'
    ,'app/sale_shortcut/child_info_prompt'
    ,'app/sale_shortcut/sale_shortcut_util'    
    ,'lib/ajax_helper'
]
,function
(
     async
    ,error_lib
    ,ui
    ,sale_shortcut_get
    ,parent_name_setter
    ,child_info_prompt
    ,sale_shortcut_util    
    ,ajax_helper
)
{
    var SHORTCUT_LST = null;
    var ROW_COUNT = 5
    var COLUMN_COUNT = 3;
    var CUR_SELECT_PARENT_SHORTCUT = 0;
    var TABLE = null;

    function update_shortcut_lst(lst,shortcut){
        for(var i = 0;i<lst.length;i++){
            if(lst[i].position == shortcut.position){
                lst[i] = shortcut;
                return;
            }
        }
        lst.push(shortcut);
    }

    function set_parent_name(parent_position){
        var parent = sale_shortcut_util.get_parent(parent_position,SHORTCUT_LST)
        var name = prompt("Enter name",parent == null ? '' : parent.caption);
        if(name == null){
            return;
        }
        var parent_name_setter_b = parent_name_setter.bind(parent_name_setter,name,parent_position)
        async.waterfall([parent_name_setter_b],function(error,result){
            if(error){
                error_lib.alert_error(error);
            }else{
                update_shortcut_lst(SHORTCUT_LST,result)
                display_shortcut_table();
            }
        });
    }

    function remove_child(child){
        var ajax_b = ajax_helper.exe.bind(ajax_helper.exe,'/sale_shortcut/delete_child','POST','deleting shortcut ...',{id:child.id});
        async.waterfall([ajax_b],function(error,result){
            if(error){
                error_lib.alert_error(error);
                return;
            }
            
            var cur_parent = SHORTCUT_LST[CUR_SELECT_PARENT_SHORTCUT];
            for(var i = 0;i<cur_parent.child_set.length;i++){
                if(cur_parent.child_set[i].id == child.id){
                    cur_parent.child_set.splice(i,1);
                    break;
                }
            }
            display_shortcut_table();
        })        
    }

    function child_button_press_handler(child_pos){
        var child = null;
        var parent = sale_shortcut_util.get_parent(CUR_SELECT_PARENT_SHORTCUT,SHORTCUT_LST);
        if(parent!=null){
            child = sale_shortcut_util.get_child(parent,child_pos);
        }
        var caption = null;
        var product_name = null;
        var product_id = null;

        if(child!=null){
            caption = child.caption;
            product_name = child.product_name;
            product_id = child.product_id;
        }

        var child_info_prompt_b = child_info_prompt.exe.bind(child_info_prompt.exe,caption,product_name,product_id);
        async.waterfall([child_info_prompt_b],function(error,result){
            if(error){
                if(error == child_info_prompt.ERROR_remove_button_pressed){
                    if(child != null){
                        remove_child(child);      
                    }
                }else{
                    error_lib.alert_error(error);
                }
            }else{
                var data = {
                     parent_position:CUR_SELECT_PARENT_SHORTCUT
                    ,child_position: child_pos
                    ,child_caption:result.caption
                    ,product_id:result.product_id
                }
                ui.ui_block('saving shortcut ...')
                $.ajax({
                     url : "/sale_shortcut/set_child_info"
                    ,type : "POST"
                    ,dataType: "json"
                    ,data : data
                    ,success : function(data,status_str,xhr){
                        ui.ui_unblock();
                        update_shortcut_lst(SHORTCUT_LST,data)
                        display_shortcut_table();
                    }
                    ,error : function(xhr,status_str,err){
                        ui.ui_unblock();
                        alert(xhr);
                    }
                });  
            }
        });
    }

    function refresh_shortcut_parent_button(tr,parent_position){
        var parent = sale_shortcut_util.get_parent(parent_position,SHORTCUT_LST);
        var class_name = parent_position == CUR_SELECT_PARENT_SHORTCUT ? 'sale_shortcut_setup_parent_selected' : 'sale_shortcut_setup_parent_unselected'
        
        //MAIN
        td = tr.insertCell(-1);
        td.innerHTML = (parent == null ? null : parent.caption);   
        td.addEventListener("click", function() {
            CUR_SELECT_PARENT_SHORTCUT = parent_position;
            display_shortcut_table();
        });
        td.className = class_name;

        //EDIT
        td = tr.insertCell(-1);
        td.innerHTML = ('edit');  
        td.addEventListener("click", function() {
            set_parent_name(parent_position);
        });
    }

    function refresh_shortcut_children(tr,row){
        var cur_parent = sale_shortcut_util.get_parent(CUR_SELECT_PARENT_SHORTCUT,SHORTCUT_LST);
        
        for(var cur_column = 0;cur_column<COLUMN_COUNT;cur_column++){
            td = tr.insertCell(-1);
            
            var child_position = COLUMN_COUNT*row+cur_column
            if(cur_parent!=null){
                var child = sale_shortcut_util.get_child(cur_parent,child_position);
                if(child != null){
                    td.innerHTML = child.caption;
                }
            }
            
            var handler_b = child_button_press_handler.bind(child_button_press_handler,child_position);
            td.addEventListener("click", handler_b);            
        }
    }

    function display_shortcut_table(){
        TABLE.innerHTML = "";

        for(var cur_row = 0;cur_row<ROW_COUNT;cur_row++){

            var tr = TABLE.insertRow(-1);

            refresh_shortcut_parent_button(tr,cur_row);
            refresh_shortcut_children(tr,cur_row);
            refresh_shortcut_parent_button(tr,cur_row + ROW_COUNT);
        }
    }

    function exe(callback){
        var html_str = 
            '<div id="sale_shortcut_manage_dlg">' +
                '<table id="sale_shortcut_setup_tbl" border="1"></table>' +
            '</div>';

        $(html_str).appendTo('body')
            .dialog(
            {
                modal: true,
                title : 'shortcut',
                zIndex: 10000,
                autoOpen: true,
                width: 800,
                height: 500,
                buttons : [{text:'exit', click: function(){callback(null);$('#sale_shortcut_manage_dlg').dialog('close'); } } ],
                open: function( event, ui ) 
                {
                    TABLE = document.getElementById('sale_shortcut_setup_tbl');
                    async.waterfall([sale_shortcut_get.exe],function(error,result){
                        SHORTCUT_LST = result;
                        display_shortcut_table();
                    })
                },
                close: function (event, ui) {
                    $(this).remove();
                }
            });  
    }

    return{
         exe:exe
    }
});