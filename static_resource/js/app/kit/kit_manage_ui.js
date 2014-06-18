define(
[
     'lib/async'
    ,'lib/error_lib'
    ,'lib/ui/ui'
    ,'lib/ajax_helper'
    ,'app/store_product/sp_search_ui'
    ,'app/store_product/sp_online_getter'
    ,'app/product/product_json_helper'
    ,'app/local_db_initializer/sync_if_nessesary'
    ,'app/kit/kit_breakdown_assoc_prompt_ui'
    ,'app/store_product/sp_json_helper'
    ,'lib/ui/table'
    ,'lib/ui/button'
]
,function
(
     async
    ,error_lib
    ,ui
    ,ajax_helper
    ,sp_search_ui
    ,sp_getter
    ,product_json_helper
    ,sync_if_nessesary
    ,kit_breakdown_assoc_prompt_ui
    ,sp_json_helper
    ,ui_table
    ,ui_button
)
{
    var KIT = null; //serialized json from server which is a sp containing breakdown_assoc_lst {breakdown(sp),qty}
    var ASSOC_TBL = null;
    var STORE_ID = null;
    var COUCH_SERVER_URL = null;

    function validate_recursive(sp){
        var bd_pid_lst = sp_json_helper.get_recursive_pid_lst(sp,true/*breakdown*/);
        var kit_pid_lst = sp_json_helper.get_recursive_pid_lst(sp,false/*kit*/);

        var intersection_lst = bd_pid_lst.filter(function(n) {
            return kit_pid_lst.indexOf(n) != -1
        });

        var result =  
            intersection_lst.length == 0 
            && bd_pid_lst.indexOf(sp.product_id)==-1 
            && kit_pid_lst.indexOf(sp.product_id) == -1;

        return result;
    }

    function set_kit(callback){
        var validate_result = validate_recursive(KIT);
        if(!validate_result){
            ui.ui_alert('Error: remove breakdown that contain kit.')
            return;
        }

        var breakdown_assoc_lst = [];//preparing param to post to server which is a list of dic {breakdown_id,qty}
        for(var i = 0;i<KIT.breakdown_assoc_lst.length;i++){
            var cur_assoc = KIT.breakdown_assoc_lst[i];
            breakdown_assoc_lst.push({breakdown_id:cur_assoc.breakdown.product_id,qty:cur_assoc.qty})
        }
        var data = {kit_id:KIT.product_id,breakdown_assoc_lst:breakdown_assoc_lst};
        var ajax_b = ajax_helper.exe.bind(ajax_helper.exe,'/product/kit/update','POST','updating kit ...',JSON.stringify(data));
        var sync_if_nessesary_b = sync_if_nessesary.bind(sync_if_nessesary,STORE_ID,COUCH_SERVER_URL);
        async.series([ajax_b,sync_if_nessesary_b],function(error,results){
            var product_json_serialized = (results ? results[0] : null)
            callback(error,product_json_serialized);
        });
    }

    function insert_assoc_handler(){
        var prompt_b = kit_breakdown_assoc_prompt_ui.exe.bind(kit_breakdown_assoc_prompt_ui.exe,null/*sp*/,null/*qty*/);
        async.waterfall([prompt_b],function(error,result){
            if(error){
                error_lib.alert_error(error);
                return;
            }
            KIT.breakdown_assoc_lst.push({breakdown:result.sp,qty:result.qty});
            refresh_table();
        });
    }

    function refresh_table(){
        ASSOC_TBL.innerHTML = '';
        var tr;var td;

        for(var i = 0;i<KIT.breakdown_assoc_lst.length;i++){
            var assoc = KIT.breakdown_assoc_lst[i];
            var tr = ASSOC_TBL.insertRow(-1);

            td = tr.insertCell(-1);
            td.innerHTML = assoc.breakdown.name

            td = tr.insertCell(-1);
            td.innerHTML = assoc.qty

            td = tr.insertCell(-1);
            td.innerHTML = '<span class="glyphicon glyphicon-trash"></span>';
            td.className = 'danger';
            (function(index){
                td.addEventListener('click',function(){
                    ui.ui_confirm('remove?',function(){
                        KIT.breakdown_assoc_lst.splice(index,1);
                        refresh_table();                        
                    });
                });
            })(i)
        }        
        ui_table.set_header(
            [
                {caption:'name',width:60},
                {caption:'qty',width:20},
                {caption:'remove',width:20},
            ],ASSOC_TBL
        );
    }

    function exe(kit_id,kit_name,store_id,couch_server_url,callback){
        /*
            DESC: it take kit_id, then ajax server to init KIT and use KIT.assoc_breakdown_lst as temporary storage to display,remove and post server
            RETURN: product_json serialized in callback
        */
        STORE_ID = store_id;
        COUCH_SERVER_URL = couch_server_url;

        var html_str = 
            '<div id="_kit_manage_dlg">' +
                '<button id="_breakdown_assoc_add_btn" class="btn btn-primary">' +
                    '<span class="glyphicon glyphicon-plus"></span>' +
                '</button>' +
                '<table id="_breakdown_assoc_tbl" class="table table-hover table-bordered table-condensed table-striped"></table>' +
            '</div>';

        $(html_str).appendTo('body')
            .dialog(
            {
                modal: true,
                title : 'kit manage: ' + kit_name,
                zIndex: 10000,
                autoOpen: true,
                width: 800,
                height: 500,
                buttons : 
                {
                    ok_btn: {
                        id:'_sp_kit_manage_ok_btn', 
                        click: function(){
                            async.waterfall([set_kit],function(error,result){
                                if(error){
                                    error_lib.alert_error(error);
                                    return;
                                }
                                $('#_kit_manage_dlg').dialog('close');
                                callback(null,result/*sp_serialized from server*/);
                            });                            
                        }
                    },
                    cancel_btn: {
                        id:'_sp_kit_manage_cancel_btn', 
                        click: function(){
                            $('#_kit_manage_dlg').dialog('close');
                            callback('ERROR_CANCEL_');                        
                        }
                    }
                },
                open: function( event, ui ) 
                {
                    ui_button.set_css('_sp_kit_manage_ok_btn','green','ok',true);
                    ui_button.set_css('_sp_kit_manage_cancel_btn','orange','remove',true);
                    ASSOC_TBL = document.getElementById("_breakdown_assoc_tbl");
                    $('#_breakdown_assoc_add_btn').click(insert_assoc_handler);

                    var sp_getter_b = sp_getter.bind(sp_getter,kit_id,false/*not_include_other_store*/,false/*not_include_lookup_type_tag*/);
                    async.waterfall([sp_getter_b],function(error,result){
                        if(error){
                            error_lib.alert_error(error);
                            return;
                        }
                        KIT = product_json_helper.get_sp_from_p(result.product);
                        refresh_table();
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