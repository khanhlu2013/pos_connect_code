var mod = angular.module('model.store_product');

mod.controller('model.store_product.sku_not_found_handler.select_suggestion.confirm.controller',
[
    '$scope',
    '$modalInstance',
    '$injector',
    'share_setting',
    'network_product',
    'product_lst',
    'my_sp_lst',
    'sku',
function(
    $scope,
    $modalInstance,
    $injector,
    share_setting,
    network_product,
    product_lst,
    my_sp_lst,
    sku
){
    $scope.network_product = network_product;
    $scope.share_setting = share_setting;
    $scope.cancel = function(){
        $modalInstance.dismiss('_cancel_');
    }
    $scope.return_product = function(){
        $modalInstance.close(network_product);
    }
    $scope.select_product = function(){
        var select_product_service = $injector.get('model.store_product.sku_not_found_handler.select_product')
        select_product_service(product_lst,my_sp_lst,sku).then(
            function(response){
                $modalInstance.close(response);
            }
            ,function(reason){
                $modalInstance.dismiss(reason);
            }
        )
    }
}]);