define
(
[
]
,function
(
)
{
	var NAME_SEARCH_ERROR_EMPTY = "NAME_SEARCH_ERROR_EMPTY";
	var SKU_SEARCH_ERROR_EMPTY = "SKU_SEARCH_ERROR_EMPTY";

    function name_search(name_str,callback){
        var name_str = name_str.trim();
        if(!name_str){
        	callback(NAME_SEARCH_ERROR_EMPTY/*error*/);
        	return;
        }

        $.ajax({
             url: '/product/search_by_name'
            ,type: 'GET'
            ,data: {name_str:name_str}
            ,dataType: 'json'
            ,success: function(data,status_str,xhr){
            	callback(null/*error*/,data.prod_lst);
            }
            ,error: function(xhr,status_str,err){
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

        $.ajax({
             url: '/product/search_by_sku'
            ,type: 'GET'
            ,data: {sku_str:sku_str}
            ,dataType: 'json'
            ,success: function(data,status_str,xhr){
            	callback(null,data);
            }
            ,error: function(xhr,status_str,err){
                callback(xhr);
            }
        });           
    }

    return{
    	 NAME_SEARCH_ERROR_EMPTY : NAME_SEARCH_ERROR_EMPTY
    	,SKU_SEARCH_ERROR_EMPTY:SKU_SEARCH_ERROR_EMPTY 
    	,name_search : name_search
    	,sku_search: sku_search
    }
});