define(
[
     'lib/async'
    ,'lib/error_lib'
    ,'lib/ui/ui'
    ,'app/group/group_lst_getter'
    ,'app/group/group_inserter'
    ,'app/group/group_updator'
    ,'app/group/group_action_perform'    
    ,'app/group/group_prompt'
    ,'app/group/group_remove'
    ,'lib/ui/table'
    ,'lib/ui/button'
]
,function
(
     async
    ,error_lib
    ,ui
    ,group_lst_getter
    ,group_inserter
    ,group_updator
    ,group_action_perform    
    ,group_prompt
    ,group_remove
    ,ui_table
    ,ui_button
)
{
    var group_tbl = null;
    var GROUP_LST = null;

    function update_group_lst(lst,item){
        for(var i = 0;i<lst.length;i++){
            if(lst[i].id == item.id){
                lst[i] = item;
                break;
            }
        }
    }

    function update_group_handler(group){
        var updator_b = group_updator.exe.bind(group_updator.exe,group);
        async.waterfall([updator_b],function(error,result){
            if(error){
                if(error == group_prompt.ERROR_REMOVE_GROUP_PROMPT ){
                    var group_remove_b = group_remove.exe.bind(group_remove.exe,group.id);
                    async.waterfall([group_remove_b],function(error,result){
                        if(error){
                            error_lib.alert_error(error);     
                            return;
                        }else{
                            for(var i = 0;i<GROUP_LST.length;i++){
                                if(GROUP_LST[i].id == group.id){
                                    GROUP_LST.splice(i,1);
                                    break;
                                }
                            }
                            display_group_table();
                        }
                    })
                }else{
                    error_lib.alert_error(error);                    
                }
                return;
            }

            update_group_lst(GROUP_LST,result)
            display_group_table();
        });
    }

    function action_group_handler(group){
        if(group.store_product_set.length == 0){
            ui.ui_alert('group is empty');
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

        for(var i = 0;i<GROUP_LST.length;i++){

            tr = group_tbl.insertRow(-1);
            var cur_group = GROUP_LST[i];

            //name
            td = tr.insertCell(-1);
            td.innerHTML = cur_group.name;

            //action
            td = tr.insertCell(-1);
            td.innerHTML = '<span class="glyphicon glyphicon-play"></span>';   
            td.className = 'info';
            (function(group){
                td.addEventListener('click',function(){
                    action_group_handler(group);
                });   
            })(GROUP_LST[i]);

            //edit
            td = tr.insertCell(-1)
            td.innerHTML = '<span class="glyphicon glyphicon-pencil"></span>';
            td.className = 'info';
            (function(group){
                td.addEventListener('click',function(){
                    update_group_handler(group);
                });   
            })(GROUP_LST[i]);
        }
        
        ui_table.set_header(
            [
                {caption:'name',width:60},
                {caption:'action',width:20},
                {caption:'edit',width:20},
            ],group_tbl
        );
    }

    function exe(){
        
        var html_str = 
            '<div id="group_manage_dlg">' +
                '<button id="_manage_group_add_group_btn" class="btn"></button>' +
                '<table id="group_tbl" class="table table-hover table-bordered table-condensed table-striped"></table>' +
            '</div>';

        $(html_str).appendTo('body')
            .dialog(
            {
                modal: true,
                title : 'manage group',
                zIndex: 10000,
                autoOpen: true,
                width: 800,
                height: 700,
                buttons : 
                {
                    cancel_btn: {
                        click: function(){
                            $('#group_manage_dlg').dialog('close');
                        },
                        id : '_manage_group_cancel_btn'
                    }
                },
                open: function( event, ui ) 
                {
                    group_tbl = document.getElementById('group_tbl');
                    ui_button.set_css('_manage_group_add_group_btn','blue','plus',false);
                    ui_button.set_css('_manage_group_cancel_btn','orange','remove',true);

                    $('#_manage_group_add_group_btn').click(insert_group_handler);
                    async.waterfall([group_lst_getter.exe],function(error,result){
                        GROUP_LST = result;
                        display_group_table();
                    }); 
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