define(
[
     'lib/async'
    ,'lib/error_lib'
    ,'lib/ui/ui'
    ,'lib/ajax_helper'
    ,'app/store_product/sp_search_ui'
    ,'app/store_product/sp_online_getter'
    ,'app/product/product_json_helper'
    ,'app/store_product/store_product_util'
    ,'app/local_db_initializer/sync_if_nessesary'

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
    ,sp_util
    ,sync_if_nessesary
)
{
    var ERROR_CANCEL_kit_manage_ui_cancel_button_pressed = 'ERROR_CANCEL_kit_manage_ui_cancel_button_pressed';
    var SP_TBL = null;
    var KIT_CHILD_LST = null;
    var PRODUCT_ID = null;
    var STORE_ID = null;
    var COUCH_SERVER_URL = null;

    function set_kit(callback){
        var pid_comma_separated_lst_str = sp_util.get_comma_separated_pid_lst(KIT_CHILD_LST);
        var data = {product_id:PRODUCT_ID,pid_comma_separated_lst_str:pid_comma_separated_lst_str};
        var ajax_b = ajax_helper.exe.bind(ajax_helper.exe,'/product/kit/update','POST','updating kit ...',data);
        var sync_if_nessesary_b = sync_if_nessesary.bind(sync_if_nessesary,STORE_ID,COUCH_SERVER_URL);
        async.series([ajax_b,sync_if_nessesary_b],function(error,results){
            var product_json_serialized = (results ? results[0] : null)
            callback(error,product_json_serialized);
        });
    }

    function insert_sp_handler(){
        var sp_search_b = sp_search_ui.exe.bind(sp_search_ui.exe,true/*multiple select*/);
        async.waterfall([sp_search_b],function(error,result){
            if(error){
                error_lib.alert_error(error);
                return;
            }
            var sp_lst = result;
            
            //validate parent can not contain itself 
            if(product_json_helper.get_sp_from_sp_lst(PRODUCT_ID,sp_lst) != null){
                ui.ui_alert('kit can not contain itself');
                return;
            }     

            //validate kit can not contain kit
            for(var i = 0;i<sp_lst.length;i++){
                if(sp_lst[i].kit_child_set != undefined && sp_lst[i].kit_child_set.length != 0){
                    ui.ui_alert('kit can not contain other kit: ' + sp_lst[i].name);
                    return;                    
                }            
            }

            for(var i = 0;i<sp_lst.length;i++){
                if(product_json_helper.get_sp_from_sp_lst(sp_lst[i].product_id,KIT_CHILD_LST) == null){
                    KIT_CHILD_LST.push(sp_lst[i]);
                }                
            }
            refresh_table();
        });
    }

    function refresh_table(){
        SP_TBL.innerHTML = '';

        var tr;var td;

        var column_name = ['name','remove'];
        tr = SP_TBL.insertRow(-1);        
        for(var i = 0;i<column_name.length;i++){
            td = tr.insertCell(-1);
            td.innerHTML = column_name[i];
        }

        for(var i = 0;i<KIT_CHILD_LST.length;i++){
            var sp = KIT_CHILD_LST[i];
            var tr = SP_TBL.insertRow(-1);

            td = tr.insertCell(-1);
            td.innerHTML = sp.name;

            td = tr.insertCell(-1);
            td.innerHTML = 'remove';

            (function(index){
                td.addEventListener('click',function(){
                    KIT_CHILD_LST.splice(index,1);
                    refresh_table();
                });
            })(i)
        }        
    }

    function exe(product_id,product_name,store_id,couch_server_url,callback){
        /*
            return product_json serialized
        */
        PRODUCT_ID = product_id;
        COUCH_SERVER_URL = couch_server_url;
        var add_sp_btn_id = '_kit_manage_ui_add_sp_btn_';
        var sp_tbl_id = '_kit_manage_ui_sp_tbl_';

        var html_str = 
            '<div id="kit_manage_dlg">' +
                '<input type="button" id=' + '"' + add_sp_btn_id + '"' + 'value="add product">' +            
                '<table id=' + '"' + sp_tbl_id + '"' + 'border="1"></table>' +
            '</div>';
        $(html_str).appendTo('body')
            .dialog(
            {
                modal: true,
                title : 'kit manage: ' + product_name,
                zIndex: 10000,
                autoOpen: true,
                width: 800,
                height: 500,
                buttons : 
                [
                    {
                        text:'ok', 
                        click: function(){
                            async.waterfall([set_kit],function(error,result){
                                if(error){
                                    error_lib.alert_error(error);
                                    return;
                                }
                                $('#kit_manage_dlg').dialog('close');
                                callback(null);
                            });                            
                        }
                    },
                    {
                        text:'cancel',
                        click: function(){
                            $('#kit_manage_dlg').dialog('close');
                            callback(ERROR_CANCEL_kit_manage_ui_cancel_button_pressed);                        
                        }
                    }
                ],
                open: function( event, ui ) 
                {
                    SP_TBL = document.getElementById(sp_tbl_id);
                    $('#'+add_sp_btn_id).click(insert_sp_handler);

                    var sp_getter_b = sp_getter.bind(sp_getter,product_id,false/*not_include_other_store*/,false/*not_include_lookup_type_tag*/);
                    async.waterfall([sp_getter_b],function(error,result){
                        if(error){
                            error_lib.alert_error(error);
                            return;
                        }
                        var kit_child_st = product_json_helper.get_sp_from_p(result.product).kit_child_set;
                        KIT_CHILD_LST = (kit_child_st === undefined? [] : kit_child_st);
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
        ,ERROR_CANCEL_kit_manage_ui_cancel_button_pressed:ERROR_CANCEL_kit_manage_ui_cancel_button_pressed
    }
});