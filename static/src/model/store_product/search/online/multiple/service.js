var mod = angular.module('model.store_product');
mod.factory('model.store_product.search.online.multiple',
[
    '$modal',
    '$templateCache',
function(
    $modal,
    $templateCache
){
    return function(){
        var dlg = $modal.open({
            template:$templateCache.get('model.store_product.search.online.multiple.template.html'),
            controller:'model.store_product.search.online.multiple.controller',
            size:'lg'
        });
        return dlg.result
    }
}]);
