requirejs.config({
     baseUrl: '/static/js'
    ,paths: {
         app : 'app'
        ,lib : 'lib'
        ,pouch_db : 'lib/db/pouchdb'
        ,jquery : 'lib/jquery/jquery-1_10_2'
        ,jquery_block_ui : 'lib/jquery/jquery_blockUI'
        ,jquery_ui : 'lib/jquery/jquery-ui'
    }
    ,shim: {
         'pouch_db': {
            exports: 'Pouch_db'
        }
        ,'jquery_block_ui': ['jquery']
        ,'jquery_ui' : ['jquery']

    }
});


require(
    [
         'lib/async'
        ,'app/sale_shortcut/parent_lst_getter'
        ,'app/sale_shortcut/parent_name_setter'
        ,'lib/misc/csrf_ajax_protection_setup'
        ,'app/store_product/store_product_getter'
        ,'app/local_db_initializer/oneshot_sync'
        ,'app/local_db_initializer/customize_db'
        ,'app/sale_shortcut/child_info_prompt'
        ,'app/sale_shortcut/sale_shortcut_util'
        //-----------------
        ,'jquery_block_ui'
        ,'jquery_ui'        
    ]
    ,function
    (
         async
        ,parent_lst_getter
        ,parent_name_setter
        ,csrf_ajax_protection_setup
        ,sp_getter
        ,oneshot_sync
        ,customize_db        
        ,child_info_prompt
        ,sale_shortcut_util
    )
{
    
    var cur_selected_parent_index = 0;
    var table = document.getElementById('shortcut_tbl');

    $( "#child_info_prompt_dlg" ).dialog({ autoOpen: false,modal:true });


    function set_name(position,parent_lst,store_idb){
        var parent = sale_shortcut_util.get_parent(position,parent_lst)
        var name = prompt("Enter name",parent == null ? null : parent.caption);
        if(name == null){
            return;
        }
        var parent_name_setter_b = parent_name_setter.bind(parent_name_setter,name,position)
        async.waterfall([parent_name_setter_b],function(error,result){
            if(error){
                alert(error);
            }else{
                refresh_table(store_idb);
            }
        });
    }

    function child_button_press_handler(cur_row,cur_column,store_idb){
        var child_info_prompt_b = child_info_prompt.exe.bind(child_info_prompt.exe,store_idb);

        async.waterfall([child_info_prompt_b],function(error,result){
            if(error!=null){
                if(error == child_info_prompt.ERROR_CANCEL){
                    //donothing
                }else{
                    alert(error);
                }                
                return;
            }

            var data = {
                 parent_position:cur_selected_parent_index
                ,child_position: (COLUMN_COUNT*cur_row+cur_column)
                ,child_caption:result.child_caption
                ,product_id:result.product_id
            }
            $.ajax({
                 url : "/sale_shortcut/set_child_info"
                ,type : "POST"
                ,dataType: "json"
                ,data : data
                ,success : function(data,status_str,xhr){
                    refresh_table(store_idb);
                }
                ,error : function(xhr,status_str,err){
                    alert(xhr);
                }
            });  
        })
    }


    function refresh_row(cur_row,parent_lst,store_idb){
        var tr = table.insertRow(-1);
        var td;
        

        //LEFT PARENT
        var left_parent_position = cur_row;
        var left_parent = sale_shortcut_util.get_parent(left_parent_position,parent_lst);
        td = tr.insertCell(-1);
        td.innerHTML = (left_parent == null ? null : left_parent.caption);   
        td.addEventListener("click", function() {
            cur_selected_parent_index = left_parent_position
            refresh_table(store_idb);
        });
        //LEFT PARENT - EDIT
        td = tr.insertCell(-1);
        td.innerHTML = ('edit');  
        td.addEventListener("click", function() {
            set_name(cur_row,parent_lst,store_idb);
        });


        //MIDDLE CHILDREN
        for(var cur_column = 0;cur_column<COLUMN_COUNT;cur_column++){
            td = tr.insertCell(-1);
            
            var child = null;
            var cur_parent = sale_shortcut_util.get_parent(cur_selected_parent_index,parent_lst);
            if(cur_parent!=null){
                var child_position = COLUMN_COUNT*cur_row+cur_column
                child = sale_shortcut_util.get_child(cur_parent,child_position);
            }
            
            td.innerHTML = (child == null ? null : child.caption);
            var handler_b = child_button_press_handler.bind(child_button_press_handler,cur_row,cur_column,store_idb);
            td.addEventListener("click", handler_b);
        }


        //RIGHT PARENT
        var right_parent_position = cur_row + ROW_COUNT;
        var right_parent = sale_shortcut_util.get_parent(right_parent_position,parent_lst);
        td = tr.insertCell(-1);
        td.innerHTML = (right_parent == null ? null : right_parent.caption);    
        td.addEventListener("click", function() {
            cur_selected_parent_index = right_parent_position
            refresh_table(store_idb);
        });
        //RIGHT PARENT - EDIT
        td = tr.insertCell(-1);
        td.innerHTML = ('edit'); 
        td.addEventListener("click", function() {
            set_name(cur_row + ROW_COUNT,parent_lst,store_idb);
        });
    }


    function refresh_table(store_idb){
        async.waterfall([parent_lst_getter],function(error,result){
            if(error){
                alert(error);
            }else{
                var parent_lst = result;

                while(table.hasChildNodes())
                {
                   table.removeChild(table.firstChild);
                }  

                for(var cur_row = 0;cur_row<ROW_COUNT;cur_row++){
                    refresh_row(cur_row,parent_lst,store_idb); 
                }                
            }
        });
    }
    csrf_ajax_protection_setup();

    $.blockUI({ message: 'please wait for setup ...' });

    var oneshot_sync_b = oneshot_sync.bind(oneshot_sync,STORE_ID,COUCH_SERVER_URL);
    var customize_db_b =  customize_db.bind(customize_db,STORE_DB_NAME);
    async.waterfall([oneshot_sync_b,customize_db_b],function(error,result){
        if(error){
            $.unblockUI();
            alert("There is error initializing db: " + error);
            return;
        }

        var store_idb = result;

        refresh_table(store_idb)

        $.unblockUI();
    });
});