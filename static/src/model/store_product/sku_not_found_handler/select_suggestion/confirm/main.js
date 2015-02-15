var mod = angular.module('model.store_product');

mod.factory('model.store_product.sku_not_found_handler.select_product_confirmation',[
    '$modal',
    '$injector',
    '$templateCache',
function(
    $modal,
    $injector,
    $templateCache
){
    return function(network_product,product_lst,my_sp_lst,sku){
        var dlg = $modal.open({
             template:$templateCache.get('model.store_product.sku_not_found_handler.select_suggestion.confirm.main.html')
            ,controller:'model.store_product.sku_not_found_handler.select_suggestion.confirm.controller'
            ,size:'lg'
            ,backdrop : 'static'
            ,resolve : {
                 network_product : function(){
                    return network_product;
                }                    
                ,product_lst : function(){
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