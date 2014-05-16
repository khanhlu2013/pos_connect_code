define(
    [
         'lib/misc/csrf_ajax_protection_setup'
        ,'lib/async'
        ,'lib/error_lib'  
        ,'app/group/group_inserter'
        ,'app/group/group_updator'
        ,'app/group/group_action_perform'
        //-----------------
        ,'jquery'
        ,'jquery_block_ui'
        ,'jquery_ui'
    ]
    ,function
    (
         csrf_ajax_protection_setup
        ,async
        ,error_lib
        ,group_inserter
        ,group_updator
        ,group_action_perform
    )
{    
    var GROUP_LST = MY_GROUP_LST;
    var group_tbl = document.getElementById('group_tbl');
    csrf_ajax_protection_setup();

    function update_group_lst(lst,item){
        for(var i = 0;i<lst.length;i++){
            if(lst[i].id == item.id){
                lst[i] = item;
                break;
            }
        }
    }

    function action_group_handler(group){
        if(group.store_product_set.length == 0){
            alert('group is empty');
            return;
        }

        action_perform_b = group_action_perform.exe.bind(group_action_perform.exe,group);
        async.waterfall([action_perform_b],function(error,result){
            if(error){
                error_lib.alert_error(error);
                return;
            }
            GROUP_LST = result.group_lst;
            display_group_table();
            alert(result.row_update + ' item(s) are updated');
        });
    }

    function update_group_handler(group){
        var updator_b = group_updator.exe.bind(group_updator.exe,group);
        async.waterfall([updator_b],function(error,result){
            if(error){
                error_lib.alert_error(error);
                return;
            }
            update_group_lst(GROUP_LST,result)
            display_group_table();
        });
    }

    function insert_group_handler(){
        async.waterfall([group_inserter.exe],function(error,result){
            if(error){
                error_lib.alert_error(error);
                return;
            }
            GROUP_LST.push(result);
            display_group_table();

        });
    }

    function display_group_table(){
        group_tbl.innerHTML = "";
        var tr;var td;

        //columns
        tr = group_tbl.insertRow(-1);
        var columns = ['name','action','edit']
        for(var i = 0;i<columns.length;i++){
            td = tr.insertCell(-1);
            td.innerHTML = columns[i];
        }
        
        for(var i = 0;i<GROUP_LST.length;i++){

            tr = group_tbl.insertRow(-1);
            var cur_group = GROUP_LST[i];

            //name
            td = tr.insertCell(-1);
            td.innerHTML = cur_group.name;

            //action
            td = tr.insertCell(-1);
            td.innerHTML = 'action';   
            (function(group){
                td.addEventListener('click',function(){
                    action_group_handler(group);
                });   
            })(GROUP_LST[i]);

            //edit
            td = tr.insertCell(-1)
            td.innerHTML = 'edit';
            (function(group){
                td.addEventListener('click',function(){
                    update_group_handler(group);
                });   
            })(GROUP_LST[i]);
        }
    }

    $('#add_group_btn').off('click').click(insert_group_handler);
    display_group_table();

});