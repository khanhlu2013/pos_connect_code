define
(
[
    'lib/ui/ui'
]
,function
(
    ui
)
{
    var NAME_SEARCH_ERROR_EMPTY = "NAME_SEARCH_ERROR_EMPTY";
    var SKU_SEARCH_ERROR_EMPTY = "SKU_SEARCH_ERROR_EMPTY";

    function name_sku_search(search_str,callback){
        var search_str = search_str.trim();
        if(!search_str){
            callback(NAME_SEARCH_ERROR_EMPTY/*error*/);
            return;
        }
        ui.ui_block('searching product ...');
        $.ajax({
             url: '/product/search_by_name_sku'
            ,type: 'GET'
            ,data: {search_str:search_str}
            ,dataType: 'json'
            ,success: function(data,status_str,xhr){
                ui.ui_unblock();
                callback(null/*error*/,data/*prod_lst*/);
            }
            ,error: function(xhr,status_str,err){
                ui.ui_unblock();
                callback(xhr);
            }
        });         
    }

    function name_search(name_str,callback){
        var name_str = name_str.trim();
        if(!name_str){
            callback(NAME_SEARCH_ERROR_EMPTY/*error*/);
            return;
        }
        ui.ui_block('name searching ...');
        $.ajax({
             url: '/product/search_by_name'
            ,type: 'GET'
            ,data: {name_str:name_str}
            ,dataType: 'json'
            ,success: function(data,status_str,xhr){
                ui.ui_unblock();
                callback(null/*error*/,data/*product_lst*/);
            }
            ,error: function(xhr,status_str,err){
                ui.ui_unblock();
                callback(xhr);
            }
        });           
    }

    function sku_search(sku_str,callback){
        var sku_str = sku_str.trim();
        if(!sku_str){
            callback(SKU_SEARCH_ERROR_EMPTY/*error*/);
            return;
        }
        ui.ui_block('sku searching ...');
        $.ajax({
             url: '/product/search_by_sku'
            ,type: 'GET'
            ,data: {sku_str:sku_str}
            ,dataType: 'json'
            ,success: function(data,status_str,xhr){
                ui.ui_unblock();
                callback(null,data);
            }
            ,error: function(xhr,status_str,err){
                ui.ui_unblock();
                callback(xhr);
            }
        });           
    }

    return{
         NAME_SEARCH_ERROR_EMPTY : NAME_SEARCH_ERROR_EMPTY
        ,SKU_SEARCH_ERROR_EMPTY:SKU_SEARCH_ERROR_EMPTY 
        ,name_search : name_search
        ,sku_search: sku_search
        ,name_sku_search:name_sku_search
    }
});