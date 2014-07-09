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
    var SKU_SEARCH_ERROR_CONTAIN_SPACE = 'SKU_SEARCH_ERROR_CONTAIN_SPACE';
    var NAME_SEARCH_ERROR_2_WORDS_MAX = 'NAME_SEARCH_ERROR_2_WORDS_MAX';

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

    function sku_search_angular(sku_search_str,$http){
        var result = {error:null,promise:null};

        sku_search_str = sku_search_str.trim();
        if(sku_search_str.length == 0){
            result.error = SKU_SEARCH_ERROR_EMPTY;
            return result;
        }

        if(sku_search_str.indexOf(' ') >= 0){
            result.error = SKU_SEARCH_ERROR_CONTAIN_SPACE;
            return result;            
        }

        result.promise = $http({
            url:'/product/angular_product_page_search_by_sku',
            method:'GET',
            params:{sku_str:sku_search_str}
        });

        return result;
    }

    function name_search_angular(name_search_str,$http){
        var result = {error:null,promise:null};
        name_search_str = name_search_str.trim();
        
        if(name_search_str.length == 0){
            result.error = NAME_SEARCH_ERROR_EMPTY;
            return result;
        }
        
        var words = name_search_str.split(' ');
        if(words.length > 2){
            result.error = NAME_SEARCH_ERROR_2_WORDS_MAX;
            return result;
        }

        result.promise = $http({
            url: '/product/angular_product_page_search_by_name',
            method : "GET",
            params: {name_str:name_search_str}
        });
        return result;
    }

    return{
         NAME_SEARCH_ERROR_EMPTY : NAME_SEARCH_ERROR_EMPTY
        ,SKU_SEARCH_ERROR_EMPTY:SKU_SEARCH_ERROR_EMPTY 
        ,SKU_SEARCH_ERROR_CONTAIN_SPACE:SKU_SEARCH_ERROR_CONTAIN_SPACE
        ,NAME_SEARCH_ERROR_2_WORDS_MAX : NAME_SEARCH_ERROR_2_WORDS_MAX
        ,name_search : name_search
        ,sku_search: sku_search
        ,name_sku_search:name_sku_search
        ,name_search_angular:name_search_angular
        ,sku_search_angular:sku_search_angular
    }
});