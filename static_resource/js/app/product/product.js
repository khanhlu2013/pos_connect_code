define(
[
     'lib/async'
    ,'lib/misc/csrf_ajax_protection_setup' 
    ,'app/store_product/sp_creator'
    ,'app/store_product/sp_updator'
    ,'app/store_product/sp_prompt'
    ,'app/store_product/sp_online_searcher'
    ,'app/product/product_json_helper'
    ,'app/sku/product_sku_manager'
    ,'lib/error_lib'
    ,'lib/ui/ui'
    ,'app/store_product/sp_group_manage_ui'
    ,'lib/ui/menu'
    ,'app/tax/tax_manage_ui'
    ,'app/group/group_manage_ui'
    ,'app/sale_shortcut/sale_shortcut_manage_ui'
    ,'app/mix_match/mix_match_manage_ui'
    ,'app/sale_report/date_range_report_ui'
    ,'app/receipt/receipt_report_ui'
    //-----------------
    ,'jquery'
    ,'jquery_block_ui'
    ,'jquery_ui'
]
,function
(
     async
    ,csrf_ajax_protection_setup
    ,sp_creator
    ,sp_updator
    ,sp_prompt
    ,sp_online_searcher
    ,product_json_helper
    ,product_sku_manager
    ,error_lib
    ,ui
    ,sp_group_manage_ui
    ,menu
    ,tax_manage_ui
    ,group_manage_ui
    ,sale_shortcut_manage_ui
    ,mix_match_manage_ui
    ,date_range_report_ui
    ,receipt_report_ui
)
{
    var PRODUCT_DATA_LST = null;
    var SEARCH_SKU_STR = null;

    function if_sku_search_does_not_find_sp_for_cur_store_then_popup_product_creator(lookup_type_tag){
        var prodStore_prodSku_1_1 = product_json_helper.extract_prod_store__prod_sku(PRODUCT_DATA_LST,STORE_ID,true/*is_prod_store*/,true/*is_prod_sku*/,SEARCH_SKU_STR);
        if(prodStore_prodSku_1_1.length==0) {
            var sp_creator_b = sp_creator.exe.bind(sp_creator.exe,  SEARCH_SKU_STR,PRODUCT_DATA_LST,lookup_type_tag,STORE_ID,COUCH_SERVER_URL);
            async.waterfall([sp_creator_b],function(error,result){
                if(error){
                    error_lib.alert_error(error);
                    return;
                }
                
                PRODUCT_DATA_LST = [result,]
                product_data_2_ui();
            });
        }
    }

    function update_sp(pid,product_name){
        var sp_updator_b = sp_updator.exe.bind(sp_updator.exe,pid,STORE_ID,COUCH_SERVER_URL);
        async.waterfall([sp_updator_b],function(error,result){
            if(error){
                if(error == sp_prompt.MANAGE_SKU_BUTTON_PRESS){
                    product_sku_manager(pid,STORE_ID,COUCH_SERVER_URL);
                }else if(error == sp_prompt.MANAGE_GROUP_BUTTON_PRESS){
                    var sp_group_manage_b = sp_group_manage_ui.exe.bind(sp_group_manage_ui.exe,pid,product_name)
                    async.waterfall([sp_group_manage_b],function(error,result){
                        if(error){
                            error_lib.alert_error(error);
                            return;
                        }
                    });
                }
                else{
                    error_lib.alert_error(error);
                }
                return;
            }else{
                var update_product = result;
                for(var i = 0;i<PRODUCT_DATA_LST.length;i++){
                    if(PRODUCT_DATA_LST[i].product_id == update_product.product_id){
                        PRODUCT_DATA_LST[i] = update_product;
                        break;
                    }
                }
                product_data_2_ui();
            }
        });
    }

    function product_data_2_ui(){
        var prod_tbl = document.getElementById('product_tbl');
        prod_tbl.innerHTML=('');

        var prodStore_prodSku_1_1 = product_json_helper.extract_prod_store__prod_sku(PRODUCT_DATA_LST,STORE_ID,true/*is_prod_store*/,true/*is_prod_sku*/,SEARCH_SKU_STR);
        if(prodStore_prodSku_1_1.length == 0){
            return;
        }

        var tr;
        var td;

        tr = prod_tbl.insertRow();

        //table column
        var column_name = [ "product" , "price" , "crv" , "taxable" , "is_sale_report" , "p_type" , "p_tag" ,"vendor", "cost", "buydown", "edit" ];
        for( var i = 0;i<column_name.length;i++){
            td = tr.insertCell(-1);
            td.innerHTML = column_name[i];
        }

        for(var i = 0;i<prodStore_prodSku_1_1.length;i++){
            var tr = prod_tbl.insertRow(-1);
            var td;
            sp = product_json_helper.get_sp_from_p(prodStore_prodSku_1_1[i],STORE_ID);
            
            td = tr.insertCell(-1);
            td.innerHTML = sp.name;

            td = tr.insertCell(-1);
            td.innerHTML = sp.price;            

            td = tr.insertCell(-1);
            td.innerHTML = sp.crv; 

            td = tr.insertCell(-1);
            td.innerHTML = sp.is_taxable;      

            td = tr.insertCell(-1);
            td.innerHTML = sp.is_sale_report;   

            td = tr.insertCell(-1);
            td.innerHTML = sp.p_type;

            td = tr.insertCell(-1);
            td.innerHTML = sp.p_tag;   

            td = tr.insertCell(-1);
            td.innerHTML = sp.vendor; 

            td = tr.insertCell(-1);
            td.innerHTML = sp.cost; 

            td = tr.insertCell(-1);
            td.innerHTML = sp.buydown; 

            td = tr.insertCell(-1);
            td.innerHTML = 'edit';   
            (function(pid,product_name){
                td.addEventListener('click',function(){
                    update_sp(pid,product_name);
                });  
            })(sp.product_id,sp.name);
        }
    }

    csrf_ajax_protection_setup();

    $('#sku_txt').keypress(function(event){
        var keycode = (event.keyCode ? event.keyCode : event.which);
        if(keycode == '13'){
            var sku_str = $('#sku_txt').val().trim();
            if(!sku_str){return;}

            SEARCH_SKU_STR = sku_str;

            var sku_search_b = sp_online_searcher.sku_search.bind(sp_online_searcher.sku_search,sku_str);
            async.waterfall([sku_search_b],function(error,result){
                if(error){error_lib.alert_error(error); }
                else{
                    PRODUCT_DATA_LST = result.prod_lst;

                    var prodStore_prodSku_0_1 = product_json_helper.extract_prod_store__prod_sku(PRODUCT_DATA_LST,STORE_ID,false/*is_prod_store*/,true/*is_prod_sku*/,SEARCH_SKU_STR);
                    if(prodStore_prodSku_0_1.length != 0)
                    {
                        alert('Please report bug: data integrity constrain failed');
                        return;
                    }
                    product_data_2_ui();
                    if_sku_search_does_not_find_sp_for_cur_store_then_popup_product_creator(result.lookup_typ_tag);
                }
            });
        }
    });

    $('#name_txt').keypress(function(event){
        var keycode = (event.keyCode ? event.keyCode : event.which);
        if(keycode == '13'){
            var name_str = $('#name_txt').val().trim(); 
            if(!name_str){return;}

            var lst = name_str.split(' ');
            if(lst.length >2){
                ui.ui_alert('2 words maximum search');
                return;
            }

            SEARCH_SKU_STR = null; //reset
            var name_search_b = sp_online_searcher.name_search.bind(sp_online_searcher.name_search,name_str);
            async.waterfall([name_search_b],function(error,result){
                if(error){error_lib.alert_error(error); }
                else{
                    PRODUCT_DATA_LST = result;
                    product_data_2_ui();
                    if(PRODUCT_DATA_LST.length == 0){
                        ui.ui_alert('no result');
                    }                    
                }
            });
        }
    });

    menu.init_menu();

    $('#tax_menu').click(function(e) 
    { 
        async.waterfall([tax_manage_ui.exe],function(error,result){
            if(error){
                error_lib.alert_error(error);
                return;
            }
        });
    });
    
    $('#group_menu').click(function(e) 
    { 
        group_manage_ui.exe();
    });

    $('#sale_shortcut_menu').click(function(e) 
    { 
        sale_shortcut_manage_ui.exe();
    });

    $('#mix_match_menu').click(function(e) 
    { 
        mix_match_manage_ui.exe();
    });    

    $('#date_range_report_menu').click(function(e) 
    { 
        date_range_report_ui.exe(STORE_ID,COUCH_SERVER_URL);
    });        

    $('#receipt_report_menu').click(function(e) 
    { 
        receipt_report_ui.exe(STORE_ID,COUCH_SERVER_URL);
    });      
});

/*

    (s_prod__sku_prod_1_0,s_prod__sku_prod_0_0) = (y,y)
    . product                   . add sku       . add product
    -----------------------------------------------------------
    . s_prod__sku_prod_1_0      . _add_sku_     .
    . s_prod__sku_prod_0_0      .               . _add_product_
    . _add_new_



    (s_prod__sku_prod_1_0,s_prod__sku_prod_0_0) = (y,n)
    . product                   . add sku       . add product
    -----------------------------------------------------------
    . s_prod__sku_prod_1_0      . _add_sku_     .
    . s_prod__sku_prod_0_0      .               .             
    . _add_new_



    (s_prod__sku_prod_1_0,s_prod__sku_prod_0_0) = (n,y)
    . product                   . add sku       . add product
    -----------------------------------------------------------
    . s_prod__sku_prod_1_0      .               .
    . s_prod__sku_prod_0_0      .               . _add_product_             
    . _add_new_



    (s_prod__sku_prod_1_0,s_prod__sku_prod_0_0) = (n,y)
    . product                   . add sku       . add product
    -----------------------------------------------------------
    . s_prod__sku_prod_1_0      .               .
    . s_prod__sku_prod_0_0      .               .              
    . _add_new_

*/            