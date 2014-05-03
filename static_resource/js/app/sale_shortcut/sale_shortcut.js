require(
    [
         'lib/misc/csrf_ajax_protection_setup'
        ,'lib/async'
        ,'app/sale_shortcut/parent_name_setter'
        ,'app/sale_shortcut/child_info_prompt'
        ,'app/sale_shortcut/sale_shortcut_util'
        ,'lib/error_lib'

        //-----------------
        ,'jquery'
        ,'jquery_block_ui'
        ,'jquery_ui'      
    ]
    ,function
    (
         csrf_ajax_protection_setup
        ,async
        ,parent_name_setter
        ,child_info_prompt
        ,sale_shortcut_util
        ,error_lib
    )
{
    
    var SHORTCUT_LST = MY_SHORTCUT_LST;
    var CUR_SELECT_PARENT_SHORTCUT = 0;
    var shortcut_tbl = document.getElementById('shortcut_tbl');
    csrf_ajax_protection_setup();


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

    function child_button_press_handler(child_pos){
        var child = null;
        var parent = sale_shortcut_util.get_parent(CUR_SELECT_PARENT_SHORTCUT,SHORTCUT_LST);
        if(parent!=null){
            child = sale_shortcut_util.get_child(parent,child_pos);
        }
        var caption = null;
        var product_name = null;
        var pid = null;

        if(child!=null){
            caption = child.caption;
            product_name = child.product_name;
            pid = child.pid;
        }

        var child_info_prompt_b = child_info_prompt.exe.bind(child_info_prompt.exe,caption,product_name,pid);
        async.waterfall([child_info_prompt_b],function(error,result){
            if(error){
                if(error == child_info_prompt.ERROR_remove_button_pressed){
                    if(child != null){
                        alert('remove code go here');                        
                    }
                }else{
                    error_lib.alert_error(error);
                }
            }else{
                var data = {
                     parent_position:CUR_SELECT_PARENT_SHORTCUT
                    ,child_position: child_pos
                    ,child_caption:result.caption
                    ,product_id:result.pid
                }
                $.ajax({
                     url : "/sale_shortcut/set_child_info"
                    ,type : "POST"
                    ,dataType: "json"
                    ,data : data
                    ,success : function(data,status_str,xhr){
                        update_shortcut_lst(SHORTCUT_LST,data)
                        display_shortcut_table();
                    }
                    ,error : function(xhr,status_str,err){
                        alert(xhr);
                    }
                });  
            }
        });
    }

    function refresh_shortcut_parent_button(tr,parent_position){
        var parent = sale_shortcut_util.get_parent(parent_position,SHORTCUT_LST);

        //MAIN
        td = tr.insertCell(-1);
        td.innerHTML = (parent == null ? null : parent.caption);   
        td.addEventListener("click", function() {
            CUR_SELECT_PARENT_SHORTCUT = parent_position;
            display_shortcut_table();
        });

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
        shortcut_tbl.innerHTML = "";

        for(var cur_row = 0;cur_row<ROW_COUNT;cur_row++){

            var tr = shortcut_tbl.insertRow(-1);

            refresh_shortcut_parent_button(tr,cur_row);
            refresh_shortcut_children(tr,cur_row);
            refresh_shortcut_parent_button(tr,cur_row + ROW_COUNT);
        }
    }

    display_shortcut_table();
});