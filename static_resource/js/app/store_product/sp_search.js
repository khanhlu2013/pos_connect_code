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
    ,'app/product/product_util'
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
    ,product_util
    ,sp_updator
    ,sync_if_nessesary
)
{
    var exist_product_lst = null;

    function update_sp_in_product_lst(sp,product_lst){
        for(var i = 0;i<product_lst.length;i++){
            if(product_lst[i].product_id == sp.product_id){
                sp_lst = product_lst[i].store_product_set;

                for(var j = 0;j<sp_lst.length;i++){
                    if(sp_lst[j].store_id == sp.store_id){
                        sp_lst[j] = sp;
                        break;
                    }
                }
                break;
            }
        }
    }

    function product_lst_2_ui(exist_product_lst,store_id,couch_server_url){
        var prod_tbl = document.getElementById('product_tbl');
        prod_tbl.innerHTML=('');

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

            sp = product_util.get_sp_item_from_prod_json(store_id,exist_product_lst[i])
            
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
                var sp_updator_b = sp_updator.exe.bind(sp_updator.exe,sp.product_id,store_id);
                async.waterfall([sp_updator_b],function(error,result){
                    if(error){
                        alert(error);
                    }else{
                        var sp = result;
                        update_sp_in_product_lst(sp,exist_product_lst);
                        product_lst_2_ui(exist_product_lst,store_id,couch_server_url);
                        var sync_if_nessesary_b = sync_if_nessesary.bind(sync_if_nessesary,store_id,couch_server_url);
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

    function sku_exe(store_id,couch_server_url){
        var sku_str = $('#sku_txt').val();
        if(!sku_str) return;

        $.ajax({
             url: '/product/search/sku_ajax'
            ,type: 'GET'
            ,data: {sku_str:sku_str}
            ,dataType: 'json'
            ,success: function(data,status_str,xhr){
                exist_product_lst = data.exist_product_lst;
                product_lst_2_ui(exist_product_lst,store_id,couch_server_url);
                if(exist_product_lst.length == 0){
                    var suggest_product_lst = data.suggest_product_lst;
                    var lookup_type_tag = data.lookup_type_tag;
                    var sp_creator_b = sp_creator.exe.bind(sp_creator.exe,sku_str,suggest_product_lst,lookup_type_tag,store_id,couch_server_url);
                    async.waterfall([sp_creator_b],function(error,result){
                        if(error == sp_creator.ERROR_SP_CREATOR_CANCEL){
                            return;//do nothing
                        }else{
                            sku_exe(store_id,couch_server_url);
                        }
                    });
                }
            }
            ,error: function(xhr,status_str,error){
                alert('there is an error');
            }
        });           
    }

    function name_exe(){

    }

    $('#sku_txt').keypress(function(event){
        var keycode = (event.keyCode ? event.keyCode : event.which);
        if(keycode == '13'){
            sku_exe(STORE_ID,COUCH_SERVER_URL);
        }
    });

    $('#name_txt').keypress(function(event){
        var keycode = (event.keyCode ? event.keyCode : event.which);
        if(keycode == '13'){
            name_exe();
        }
    });
    csrf_ajax_protection_setup();
    $( "#store_product_prompt_dialog" ).dialog({ autoOpen: false,modal:true,width:600,heigh:400 });
});