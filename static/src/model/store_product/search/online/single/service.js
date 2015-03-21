var mod = angular.module('model.store_product');

mod.factory('model.store_product.search.online.single',
[
    '$modal',
    '$templateCache',
function(
    $modal,
    $templateCache
){
    return function(){
        var dlg = $modal.open({
            template:$templateCache.get('model.store_product.search.online.single.template.html'),
            controller:'model.store_product.search.online.single.controller',
            size:'lg',
        });
        return dlg.result
    }
}]); 