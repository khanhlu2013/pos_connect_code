requirejs.config({
     baseUrl: STATIC_URL + 'js'
    ,paths: {
         app : 'app'
        ,lib : 'lib'
        ,pouch_db : 'lib/db/pouchdb-2.0.1'
    }
    ,shim: {
         'pouch_db': {
            exports: 'Pouch_db'
        }
    }
});


require(
[
     'lib/async'
    ,'lib/misc/csrf_ajax_protection_setup' 
    ,'app/store_product/store_product_creator'
]
,function
(
     async
    ,csrf_ajax_protection_setup
    ,sp_creator
)
{
    function product_lst_2_ui(exist_product_lst){
        var prod_tbl = document.getElementById('product_tbl');
        prod_tbl.innerHTML=('');

        for(var i = 0;i<exist_product_lst.length;i++){
            var tr = prod_tbl.insertRow();
            var td;

            td = tr.insertCell(-1);
            td.innerHTML = exist_product_lst[i].name;
        }
    }


    function sku_exe(store_id,couch_server_url){
        var sku_str = $('#sku_txt').val();
        if(!sku_str) return;

        $.ajax({
             url: '/product/search_product_by_sku_ajax'
            ,type: 'GET'
            ,data: {sku_str:sku_str}
            ,dataType: 'json'
            ,success: function(data,status_str,xhr){
                var exist_product_lst = data.exist_product_lst;
                product_lst_2_ui(exist_product_lst);
                if(exist_product_lst.length == 0){
                    var suggest_product_lst = data.suggest_product_lst;
                    var sp_creator_b = sp_creator.exe.bind(sp_creator.exe,sku_str,suggest_product_lst,store_id,couch_server_url);
                    async.waterfall([sp_creator_b],function(error,result){
                        
                    });
                }
            }
            ,error: function(xhr,status_str,error){
                alert('there is an error: ' + xhr.responseText);
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