requirejs.config({
     baseUrl: STATIC_URL + 'js'
    ,paths: {
         app : 'app'
        ,lib : 'lib'
        ,pouch_db : 'lib/db/pouchdb-2.0.1'
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
    ,'lib/misc/csrf_ajax_protection_setup' 
    ,'app/store_product/store_product_creator'
    ,'app/store_product/Store_product'
    ,'app/store_product/store_product_updator'
    ,'app/local_db_initializer/sync_if_nessesary'
    //-----------------    
    ,'jquery_block_ui'
    ,'jquery_ui'    
]
,function
(
     async
    ,csrf_ajax_protection_setup
    ,sp_creator
    ,Store_product
    ,sp_updator
    ,sync_if_nessesary

)
{
    var saved_prod_lst = null;

    function get_sp_item_from_prod_json(store_id,prod_json){
        
        var sp = null;

        for(var i = 0;i<prod_json.store_product_set.length;i++){
            cur_sp = prod_json.store_product_set[i]
            if(cur_sp.store_id == store_id){

                sp = new Store_product(
                     null//_id
                    ,null//_rev
                    ,null//key
                    ,cur_sp.store_id
                    ,cur_sp.product_id
                    ,cur_sp.name
                    ,cur_sp.price
                    ,cur_sp.crv
                    ,cur_sp.is_taxable
                    ,cur_sp.is_sale_report
                    ,cur_sp.p_type
                    ,cur_sp.p_tag
                    ,cur_sp.sku_lst                 
                );

                break;
            }
        }
        return sp;
    }

    function _helper_extract_prod_lst(prod_lst,store_id,include_exist_in_store){
        var result = new Array();

        for(var i = 0;i<prod_lst.length;i++){
            
            var store_product_set = prod_lst[i].store_product_set;
            var exist_in_store = false;
            for(var j = 0;j<store_product_set.length;j++){
                if(store_product_set[j].store_id == store_id){
                    exist_in_store = true;
                    break;
                }
            }

            if(include_exist_in_store && exist_in_store){
                result.push(prod_lst[i]);
            }
        }
        return result;
    }

    function data_2_ui(prod_lst){
        var prod_tbl = document.getElementById('product_tbl');
        prod_tbl.innerHTML=('');

        var exist_product_lst = _helper_extract_prod_lst(prod_lst,STORE_ID,true)
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

            sp = get_sp_item_from_prod_json(STORE_ID,exist_product_lst[i])
            
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
                var sp_updator_b = sp_updator.exe.bind(sp_updator.exe,sp.product_id,STORE_ID);
                async.waterfall([sp_updator_b],function(error,result){
                    if(error){
                        alert(error);
                    }else{
                        var update_product = result;
                        
                        for(var i = 0;i<saved_prod_lst.length;i++){
                            if(saved_prod_lst[i].product_id == update_product.product_id){
                                saved_prod_lst[i] = update_product;
                                break;
                            }
                        }

                        data_2_ui(saved_prod_lst);

                        var sync_if_nessesary_b = sync_if_nessesary.bind(sync_if_nessesary,STORE_ID,COUCH_SERVER_URL);
                        async.waterfall([sync_if_nessesary_b],function(error,result){
                            if(error){
                                alert(error);
                            }
                        });
                    }
                })
            });
            td.innerHTML = 'edit';                                 
        }
    }

    csrf_ajax_protection_setup();
    $( "#store_product_prompt_dialog" ).dialog({ autoOpen: false,modal:true,width:600,heigh:400 });

    function name_exe(name_str){
        var name_str = name_str.trim();
        if(!name_str) return;

        $.ajax({
             url: '/product/search/name_ajax'
            ,type: 'GET'
            ,data: {name_str:name_str}
            ,dataType: 'json'
            ,success: function(data,status_str,xhr){
                saved_prod_lst = data.prod_lst;
                data_2_ui(saved_prod_lst);
            }
            ,error: function(xhr,status_str,error){
                alert('there is an error');
            }
        });           
    }

    function sku_exe(sku_str){
        var sku_str = sku_str.trim();
        if(!sku_str) return;

        $.ajax({
             url: '/product/search/sku_ajax'
            ,type: 'GET'
            ,data: {sku_str:sku_str}
            ,dataType: 'json'
            ,success: function(data,status_str,xhr){
                saved_prod_lst = data.prod_lst;
                data_2_ui(saved_prod_lst);
                var exist_product_lst = _helper_extract_prod_lst(saved_prod_lst,STORE_ID,true);

                if(exist_product_lst.length==0) {
                    var suggest_product_lst = _helper_extract_prod_lst(saved_prod_lst,STORE_ID,false);
                    var sp_creator_b = sp_creator.exe.bind(sp_creator.exe,sku_str,suggest_product_lst,data.lookup_type_tag,STORE_ID,COUCH_SERVER_URL);
                    async.waterfall([sp_creator_b],function(error,result){
                        if(error){
                            if(error == sp_creator.ERROR_SP_CREATOR_CANCEL){
                                //do nothing
                            }else{
                                alert('there is error');
                            }               
                            return;             
                        }
                        
                        saved_prod_lst = [result,]
                        data_2_ui(saved_prod_lst);
                    });
                }
            }
            ,error: function(xhr,status_str,error){
                alert('there is an error');
            }
        });           
    }

    $('#sku_txt').keypress(function(event){
        var keycode = (event.keyCode ? event.keyCode : event.which);
        if(keycode == '13'){
            var sku_str = $('#sku_txt').val().trim();
            sku_exe(sku_str)

        }
    });

    $('#name_txt').keypress(function(event){
        var keycode = (event.keyCode ? event.keyCode : event.which);
        if(keycode == '13'){
            var name_str = $('#name_txt').val();
            name_exe(name_str);
        }
    });
});