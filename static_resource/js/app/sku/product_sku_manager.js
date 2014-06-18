define(
[
     'lib/async'
    ,'app/store_product/sp_online_getter'
    ,'app/product/product_json_helper'
    ,'app/sku/product_sku_online_deletor'
    ,'app/sku/product_sku_online_adder'
    ,'app/local_db_initializer/sync_if_nessesary'
    ,'lib/error_lib'
    ,'app/sku/sku_remove_clean_up_util'
    ,'lib/ui/ui'
    ,'lib/ui/table'
    ,'lib/ui/button'
]
,function
(
     async
    ,sp_online_getter
    ,product_json_helper
    ,prod_sku_del
    ,prod_sku_add
    ,sync_if_nessesary
    ,error_lib
    ,sku_remove_clean_up_util
    ,ui
    ,ui_table
    ,ui_button
)
{
    var STORE_ID = null;
    var COUCH_SERVER_URL = null;
    
    function _helper_is_sku_removable(prod_sku_assoc_json){
        return prod_sku_assoc_json.store_set.length == 1 && prod_sku_assoc_json.creator_id == STORE_ID;
    }

    function remove_sku_handler(prod_sku_assoc){
        if(!_helper_is_sku_removable(prod_sku_assoc)){
            return;
        }
        ui.ui_confirm(
            'delete sku?'
            ,function(){
                var prod_sku_del_b = prod_sku_del.bind(prod_sku_del,prod_sku_assoc.product_id,prod_sku_assoc.sku_str,COUCH_SERVER_URL,STORE_ID);
                async.waterfall([prod_sku_del_b],function(error,result){
                    if(error){
                        alert(error);
                    }else{
                        var returned_product_json = result;
                        var sync_b = sync_if_nessesary.bind(sync_if_nessesary,STORE_ID,COUCH_SERVER_URL);
                        async.waterfall([sync_b],function(error,result){
                            if(error){
                                alert(error);
                            }else{
                                data_2_table(returned_product_json);
                                sku_remove_clean_up_util.exe(prod_sku_assoc.product_id,prod_sku_assoc.sku_str);
                            }
                        })
                    }
                });                 
            }
            ,function(){

            }
        );
    }

    function data_2_table(product_json){
        var prod_sku_assoc_set = product_json_helper.get_prod_sku_assoc_set(product_json);
        var tbl = document.getElementById('sku_tbl');        
        tbl.innerHTML="";

        var tr;var td;

        for(var i = 0;i<prod_sku_assoc_set.length;i++){
            var cur_prod_sku_assoc = prod_sku_assoc_set[i];
            tr = tbl.insertRow(-1);

            td = tr.insertCell(-1);
            td.innerHTML = cur_prod_sku_assoc.sku_str;

            td = tr.insertCell(-1);
            td.innerHTML = _helper_is_sku_removable(cur_prod_sku_assoc) ? '<span class="glyphicon glyphicon-trash"></span>' : '';
            td.className = 'danger';
            (function(v){
                td.addEventListener('click',function(){
                    remove_sku_handler(v);
                });
            })(cur_prod_sku_assoc)
        }

        ui_table.set_header(
            [
                {caption:'sku',width:60},
                {caption:'action',width:20},
            ],tbl
        );
    }

    function add_sku_handler(product_id){
        ui.ui_prompt('enter sku',null/*prefill*/,false/*is_null_allow*/,function(error,sku_str){
            if(error){
                error_lib.alert_error(error);
                return;
            }
            if(!sku_str){
                return;
            }

            var prod_sku_add_b = prod_sku_add.bind(prod_sku_add,product_id,sku_str,COUCH_SERVER_URL,STORE_ID);
            async.waterfall([prod_sku_add_b],function(error,result){
                if(error){
                    alert(error);
                }else{
                    var returned_product_json = result;
                    var sync_b = sync_if_nessesary.bind(sync_if_nessesary,STORE_ID,COUCH_SERVER_URL);
                    async.waterfall([sync_b],function(error,result){
                        if(error){
                            alert(error);
                        }else{
                            data_2_table(returned_product_json);
                        }
                    });
                }
            }); 
        });
    }

    return function (product_id,store_id,couch_server_url){
        STORE_ID = store_id;
        COUCH_SERVER_URL = couch_server_url;
        var html_str = 
            '<div id="sku_management_dialog">' +
                '<button id = "add_sku_btn" class="btn btn-primary">' +
                    '<span class="glyphicon glyphicon-plus"></span>' +
                '</button>' +
                '<table id=sku_tbl class="table table-hover table-bordered table-condensed table-striped"></table>' +
                '<br>' +        
            '</div>'
        ;

        $(html_str).appendTo('body')
            .dialog(
            {
                modal: true,
                title : null,
                zIndex: 10000,
                autoOpen: true,
                width: 300,
                height: 500, 
                buttons:
                {
                    exit_btn: {id:'_sp_sku_manage_exit_btn',click:function(){$('#sku_management_dialog').dialog('close');}}
                },
                open: function( event, ui ){
                    ui_button.set_css('_sp_sku_manage_exit_btn','orange','remove',true);
                    var sp_getter = sp_online_getter.bind(sp_online_getter,product_id,true/*is_include_other_store*/,false/*is_lookup_type_tag*/);
                    async.waterfall([sp_getter],function(error,result){

                        if(error){
                            alert(error);
                            return;
                        }
                        var product_json = result.product;
                        $('#sku_management_dialog').dialog( "option" , "title" , 'manage sku: ' + product_json.name);
                        var sp_json = product_json_helper.get_sp_from_p(product_json,STORE_ID);
                        data_2_table(product_json);

                        var add_sku_handler_b = add_sku_handler.bind(add_sku_handler,product_id);
                        $('#add_sku_btn').click(add_sku_handler_b);

                    });
                },
                close: function (event, ui) {
                    $(this).remove();
                }
            }); 
    }

});