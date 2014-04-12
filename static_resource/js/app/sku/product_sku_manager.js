define(
[
     'lib/async'
    ,'app/store_product/sp_online_getter'
    ,'app/product/product_json_helper'
    ,'app/sku/product_sku_online_deletor'
    ,'app/sku/product_sku_online_adder'
    ,'app/local_db_initializer/sync_if_nessesary'

]
,function
(
     async
    ,sp_online_getter
    ,product_json_helper
    ,prod_sku_del
    ,prod_sku_add
    ,sync_if_nessesary

)
{
    function _helper_is_sku_removable(prod_sku_assoc_json){
        return prod_sku_assoc_json.store_set.length == 1 && prod_sku_assoc_json.creator_id == STORE_ID;
    }

    function data_2_table(product_json,table,store_id,couch_server_url){
        var prod_sku_assoc_set = product_json_helper.get_prod_sku_assoc_set(product_json);
        table.innerHTML="";

        var tr;var td;

        tr = table.insertRow();
        td = tr.insertCell(-1);
        td.innerHTML = 'sku';

        td = tr.insertCell(-1);
        td.innerHTML = 'action';

        for(var i = 0;i<prod_sku_assoc_set.length;i++){
            var cur_prod_sku_assoc = prod_sku_assoc_set[i];
            tr = table.insertRow(-1);

            td = tr.insertCell(-1);
            td.innerHTML = cur_prod_sku_assoc.sku_str;

            td = tr.insertCell(-1);
            td.innerHTML = _helper_is_sku_removable(cur_prod_sku_assoc) ? 'remove' : '';

            td.addEventListener('click',function(){
                if(!_helper_is_sku_removable(cur_prod_sku_assoc)){
                    return;
                }

                if(!confirm('delete?')){
                    return;
                }

                var prod_sku_del_b = prod_sku_del.bind(prod_sku_del,cur_prod_sku_assoc.product_id,cur_prod_sku_assoc.sku_str);
                async.waterfall([prod_sku_del_b],function(error,result){
                    if(error){
                        alert(error);
                    }else{
                        var returned_product_json = result;
                        var sync_b = sync_if_nessesary.bind(sync_if_nessesary,store_id,couch_server_url);
                        async.waterfall([sync_b],function(error,result){
                            if(error){
                                alert(error);
                            }else{
                                data_2_table(returned_product_json,table,store_id,couch_server_url);
                            }
                        })
                    }
                });
            });
        }
    }

    function add_sku_handler(product_id,table,store_id,couch_server_url){
        var sku_str = prompt('enter sku');
        if(!sku_str){
            return;
        }
        
        var prod_sku_add_b = prod_sku_add.bind(prod_sku_add,product_id,sku_str);
        async.waterfall([prod_sku_add_b],function(error,result){
            if(error){
                alert(error);
            }else{
                var returned_product_json = result;
                var sync_b = sync_if_nessesary.bind(sync_if_nessesary,store_id,couch_server_url);
                async.waterfall([sync_b],function(error,result){
                    if(error){
                        alert(error);
                    }else{
                        data_2_table(returned_product_json,table,store_id,couch_server_url);
                    }
                });
            }
        });        
    }

    return function (product_id,store_id,couch_server_url){
        var sp_getter = sp_online_getter.bind(sp_online_getter,product_id,true/*is_include_other_store*/,false/*is_lookup_type_tag*/);
        async.waterfall([sp_getter],function(error,result){

            if(error){
                alert(error);
                return;
            }
            var product_json = result.product;
            var sp_json = product_json_helper.get_sp_from_p(product_json,STORE_ID);
            var sku_tbl = document.getElementById('sku_tbl');
            data_2_table(product_json,sku_tbl,store_id,couch_server_url);

            var add_sku_handler_b = add_sku_handler.bind(add_sku_handler,product_id,sku_tbl,store_id,couch_server_url);
            $('#add_sku_btn').off('click').click(add_sku_handler_b);

            $('#sku_management_dialog').dialog({title:sp_json.name,buttons:[{text:'exit',click:function(){$('#sku_management_dialog').dialog('close');}}]});
        });
    }

});