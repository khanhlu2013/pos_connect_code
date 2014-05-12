/*
    <div id="product_search_dlg" title "search product">
        <label for='product_search_txt'>search</label>
        <input type='text' id = 'product_search_txt'>

        <table id='product_search_tbl' border='1'></table>
    </div>
*/

define(
[
     'lib/async'
    ,'app/store_product/sp_online_searcher'
    ,'app/product/product_json_helper'
    ,'lib/error_lib'
    ,'lib/ui/ui'
]
,function
(
     async
    ,sp_online_searcher
    ,product_json_helper
    ,error_lib
    ,ui
)
{
    var ERROR_CANCEL_product_search_exit_button_press = 'ERROR_CANCEL_product_search_exit_button_press'

    function exit_handler(callback){
        $('#product_search_dlg').dialog('close');
        callback(ERROR_CANCEL_product_search_exit_button_press);
    }

    function init_search_text_enter(callback){
        $('#product_search_txt').keypress(function(event){
            var keycode = (event.keyCode ? event.keyCode : event.which);
            if(keycode == '13'){
                var name_str = $('#product_search_txt').val().trim(); 
                if(!name_str){return;}

                if(name_str.split(' ').length > 2){
                    ui.ui_alert('2 words maximum search');
                    return;
                }

                var search_b = sp_online_searcher.name_sku_search.bind(sp_online_searcher.name_sku_search,name_str);
                async.waterfall([search_b],function(error,result){
                    if(error){error_lib.alert_error(error); }
                    else{
                        product_data_2_ui(result,callback);      
                        if(result.length == 0){
                            ui.ui_alert('no result');
                        }              
                    }
                });
            }
        });         
    }

    function product_data_2_ui(product_lst,callback){
        var tbl = document.getElementById('product_search_tbl');
        tbl.innerHTML = '';

        var tr;var td;

        var column_name = ['product','price','crv','taxable','type','tag','select']
        tr = tbl.insertRow(-1);        
        for(var i = 0;i<column_name.length;i++){
            td = tr.insertCell(-1);
            td.innerHTML = column_name[i];
        }

        for(var i = 0;i<product_lst.length;i++){
            var tr = tbl.insertRow(-1);
            var store_id = null;//when we search by name, we only limit to the current store. so, we don't need to supply what store we are looking at
            var sp = product_json_helper.get_sp_from_p(product_lst[i],store_id);

            td = tr.insertCell(-1);
            td.innerHTML = sp.name;

            td = tr.insertCell(-1);
            td.innerHTML = sp.price;            

            td = tr.insertCell(-1);
            td.innerHTML = sp.crv; 

            td = tr.insertCell(-1);
            td.innerHTML = sp.is_taxable;      

            td = tr.insertCell(-1);
            td.innerHTML = sp.p_type;

            td = tr.insertCell(-1);
            td.innerHTML = sp.p_tag;  

            td = tr.insertCell(-1);
            td.innerHTML = 'select';

            (function(v){
                td.addEventListener('click',function(){
                    $('#product_search_dlg').dialog('close');
                    callback(null,v);                
                });
            })(sp);
        }
    }

    function exe(callback){
        var exit_handler_b = exit_handler.bind(exit_handler,callback);
        $('#product_search_dlg').dialog({
             title : 'search product'
            ,buttons : [{text:'exit',click: exit_handler_b}]
            ,modal : true
            ,width: 800
            ,height: 500
        });     

        init_search_text_enter(callback);
        //reset ui
        $('#product_search_txt').val('');
        product_data_2_ui([],callback);
        $('#product_search_dlg').dialog('open');
    }

    return{
         exe:exe
        ,ERROR_CANCEL_product_search_exit_button_press:ERROR_CANCEL_product_search_exit_button_press
    }
});