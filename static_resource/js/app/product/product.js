requirejs.config({
     baseUrl: STATIC_URL + 'js'
    ,paths: {
         app : 'app'
        ,lib : 'lib'
        // ,pouch_db : 'lib/db/pouchdb-2.0.1'
        // ,jquery : 'lib/jquery/jquery-1_10_2'
        // ,jquery_block_ui : 'lib/jquery/jquery_blockUI'
        // ,jquery_ui : 'lib/jquery/jquery-ui'
    }
    // ,shim: {
    //      'pouch_db': {
    //         exports: 'Pouch_db'
    //     }
    //     ,'jquery_block_ui': ['jquery']
    //     ,'jquery_ui' : ['jquery']
    // }
});


require(
[
     'lib/async'
    ,'lib/misc/csrf_ajax_protection_setup' 
    ,'app/store_product/sp_creator'
    ,'app/store_product/Store_product'
    ,'app/store_product/sp_updator'
    ,'app/store_product/sp_prompt'
    ,'app/store_product/sp_online_searcher'
    ,'app/product/product_json_helper'
    ,'app/sku/product_sku_manager'
    ,'lib/error_lib'

    //-----------------    
    // ,'jquery_block_ui'
    // ,'jquery_ui'    
]
,function
(
     async
    ,csrf_ajax_protection_setup
    ,sp_creator
    ,Store_product
    ,sp_updator
    ,sp_prompt
    ,sp_online_searcher
    ,product_json_helper
    ,product_sku_manager
    ,error_lib

)
{
    var product_data_lst = null;
    var search_sku_str = null;

    function product_data_2_ui(){
        var prod_tbl = document.getElementById('product_tbl');
        prod_tbl.innerHTML=('');

        var exist_product_lst = product_json_helper.extract_prod_store__prod_sku(product_data_lst,STORE_ID,true/*is_prod_store*/,true/*is_prod_sku*/,search_sku_str);
        if(exist_product_lst.length == 0){
            return;
        }

        var tr;
        var td;

        tr = prod_tbl.insertRow();

        //table column
        var column_name = [ "product" , "price" , "crv" , "taxable" , "is_sale_report" , "p_type" , "p_tag" , "edit" ];
        for( var i = 0;i<column_name.length;i++){
            td = tr.insertCell(-1);
            td.innerHTML = column_name[i];
        }

        for(var i = 0;i<exist_product_lst.length;i++){
            var tr = prod_tbl.insertRow(-1);
            var td;
            sp = product_json_helper.get_sp_from_p(exist_product_lst[i],STORE_ID);
            
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
            td.addEventListener('click',function(){
                var sp_updator_b = sp_updator.exe.bind(sp_updator.exe,sp.product_id,STORE_ID,COUCH_SERVER_URL);
                async.waterfall([sp_updator_b],function(error,result){
                    if(error){
                        if(error == sp_prompt.MANAGE_SKU_BUTTON_PRESS){
                            product_sku_manager(sp.product_id,STORE_ID,COUCH_SERVER_URL);
                        }
                        else{
                            error_lib.alert_error(error);
                        }
                        return;
                    }else{
                        var update_product = result;
                        for(var i = 0;i<product_data_lst.length;i++){
                            if(product_data_lst[i].product_id == update_product.product_id){
                                product_data_lst[i] = update_product;
                                break;
                            }
                        }

                        product_data_2_ui();
                    }
                })
            });
            td.innerHTML = 'edit';                                 
        }
    }

    csrf_ajax_protection_setup();

    $('#sku_txt').keypress(function(event){
        var keycode = (event.keyCode ? event.keyCode : event.which);
        if(keycode == '13'){
            var sku_str = $('#sku_txt').val().trim();
            if(!sku_str){return;}

            search_sku_str = sku_str;

            var sku_search_b = sp_online_searcher.sku_search.bind(sp_online_searcher.sku_search,sku_str);
            async.waterfall([sku_search_b],function(error,result){
                if(error){error_lib.alert_error(error); }
                else{
                    product_data_lst = result.prod_lst;

                    var prodStore_prodSku_0_1 = product_json_helper.extract_prod_store__prod_sku(product_data_lst,STORE_ID,false/*is_prod_store*/,true/*is_prod_sku*/,search_sku_str);
                    if(prodStore_prodSku_0_1.length != 0)
                    {
                        alert('Please report bug: data integrity constrain failed');
                        return;
                    }

                    product_data_2_ui();

                    var prodStore_prodSku_1_1 = product_json_helper.extract_prod_store__prod_sku(product_data_lst,STORE_ID,true/*is_prod_store*/,true/*is_prod_sku*/,search_sku_str);
                    if(prodStore_prodSku_1_1.length==0) {
                        var sp_creator_b = sp_creator.exe.bind(sp_creator.exe,  sku_str,product_data_lst,result.lookup_type_tag,STORE_ID,COUCH_SERVER_URL);
                        async.waterfall([sp_creator_b],function(error,result){
                            if(error){
                                error_lib.alert_error(error);
                                return;
                            }
                            
                            product_data_lst = [result,]
                            product_data_2_ui();
                        });
                    }
                }
            });
        }
    });

    $('#name_txt').keypress(function(event){
        var keycode = (event.keyCode ? event.keyCode : event.which);
        if(keycode == '13'){
            var name_str = $('#name_txt').val().trim(); 
            if(!name_str){return;}

            search_sku_str = null; //reset
            var name_search_b = sp_online_searcher.name_search.bind(sp_online_searcher.name_search,name_str);
            async.waterfall([name_search_b],function(error,result){
                if(error){error_lib.alert_error(error); }
                else{
                    product_data_lst = result;
                    product_data_2_ui();                    
                }
            });
        }
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