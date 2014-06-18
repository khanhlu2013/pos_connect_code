define(
[
     'lib/async'
    ,'app/store_product/sp_online_searcher'
    ,'app/product/product_json_helper'
    ,'lib/error_lib'
    ,'lib/ui/ui'
    ,'lib/ui/table'
    ,'lib/ui/button'
]
,function
(
     async
    ,sp_online_searcher
    ,product_json_helper
    ,error_lib
    ,ui
    ,ui_table
    ,ui_button
)
{
    var ERROR_CANCEL_product_search_exit_button_press = 'ERROR_CANCEL_product_search_exit_button_press';

    var SEARCH_RESULT_PRODUCT_LST = null;
    var IS_MULTIPLE_SELECTION = null;

    function init_search_text_enter(){
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
                        SEARCH_RESULT_PRODUCT_LST = result;

                        product_data_2_ui(result);      
                        if(result.length == 0){
                            ui.ui_alert('no result');
                        }              
                    }
                });
            }
        });         
    }

    function product_data_2_ui(product_lst){
        var tbl = document.getElementById('product_search_tbl');
        tbl.innerHTML = '';

        var tr;var td;

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
            td.innerHTML = '<input type="checkbox" class="checkbox_class" id=' + '"' + sp.product_id + '"' + '>';
        }

        ui_table.set_header(
            [
                {caption:'product',width:50},
                {caption:'price',width:10},
                {caption:'crv',width:10},
                {caption:'taxable',width:10},    
                {caption:'type',width:10},
                {caption:'tag',width:10},
                {caption:'select',width:10},                    
            ],tbl
        );
        $(".checkbox_class").each(function()
        {
            $(this).change(function()
            {
                if(!IS_MULTIPLE_SELECTION){
                    $(".checkbox_class").prop('checked',false);
                    $(this).prop('checked',true);
                }
            });
        });        
    }

    function exe(is_multiple_selection,callback){
        IS_MULTIPLE_SELECTION = is_multiple_selection; //callback return will be lst or object depend on this param
        var html_str = 
            '<div id="product_search_dlg">' +
                '<input type="text" id = "product_search_txt" placeholder="name/sku">' +
                '<table id="product_search_tbl" class="table table-hover table-bordered table-condensed table-striped"></table>' +
            '</div>';

        $(html_str).appendTo('body')
            .dialog(
            {
                modal: true,
                title : 'search product',
                zIndex: 10000,
                autoOpen: true,
                width: 800,
                height: 500,
                buttons : 
                {
                    ok_btn:{
                        id: '_sp_search_ok_btn',
                        click:function(){
                            var result_lst = [];

                            $(".checkbox_class").each(function()
                            {
                                if($(this).is(':checked')){
                                    var pid = $(this).attr('id');
                                    var product = product_json_helper.get_p_from_lst(pid,SEARCH_RESULT_PRODUCT_LST);
                                    var sp = product_json_helper.get_sp_from_p(product,null/*store_id*/);
                                    result_lst.push(sp);
                                }
                            });                        

                            if(result_lst.length == 0){
                                ui.ui_alert('you select nothing');
                                return;
                            }else{
                                if(IS_MULTIPLE_SELECTION){
                                    $('#product_search_dlg').dialog('close');
                                    callback(null,result_lst);                                      
                                }else{
                                    if(result_lst.length > 1){
                                        ui.ui_alert('bug');
                                        return;                                        
                                    }else{
                                        $('#product_search_dlg').dialog('close');
                                        callback(null,result_lst[0]);                                               
                                    }
                                }
                            }
                        }
                    },                
                    cancel_btn:{
                        id : '_sp_search_cancel_btn',
                        click: function(){
                            $('#product_search_dlg').dialog('close');
                            callback(ERROR_CANCEL_product_search_exit_button_press);                        
                        }
                    }
                },
                open: function( event, ui ) 
                {
                    ui_button.set_css('_sp_search_ok_btn','green','ok',true);
                    ui_button.set_css('_sp_search_cancel_btn','orange','remove',true);
                    init_search_text_enter();
                    product_data_2_ui([]);
                },
                close: function (event, ui) {
                    $(this).remove();
                }
            });  
    }

    return{
         exe:exe
        ,ERROR_CANCEL_product_search_exit_button_press:ERROR_CANCEL_product_search_exit_button_press
    }
});