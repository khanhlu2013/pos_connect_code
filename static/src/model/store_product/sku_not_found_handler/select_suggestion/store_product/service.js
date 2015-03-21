var mod = angular.module('model.store_product');
mod.factory('model.store_product.sku_not_found_handler.select_suggestion.store_product',[
    '$modal',
    '$templateCache',       
function(
    $modal,
    $templateCache
){
    return function(product_lst,my_sp_lst,sku){
        var dlg = $modal.open({
             template:$templateCache.get('model.store_product.sku_not_found_handler.select_suggestion.store_product.template.html')
            ,controller:'model.store_product.sku_not_found_handler.select_suggestion.store_product.controller'
            ,size:'lg'
            ,backdrop : 'static'
            ,resolve : {
                 product_lst : function(){
                    return product_lst;
                }
                ,my_sp_lst : function(){
                    return my_sp_lst;
                }
                ,sku : function(){
                    return sku;
                }
            }
        })
        return dlg.result;
    }    
}]);