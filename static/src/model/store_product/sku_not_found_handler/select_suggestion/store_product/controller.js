var mod = angular.module('model.store_product');
mod.controller('model.store_product.sku_not_found_handler.select_suggestion.store_product.controller',
[
    '$scope',
    '$modalInstance',
    '$injector',
    'share.ui.confirm',    
    'product_lst',
    'my_sp_lst',
    'sku',
function(
    $scope,
    $modalInstance,
    $injector,
    confirm_service,
    product_lst,
    my_sp_lst,
    sku
){
    $scope.product_lst = product_lst;
    $scope.my_sp_lst = my_sp_lst;
    $scope.sku = sku;                
    $scope.cancel = function(){
        $modalInstance.dismiss('_cancel_');
    }
    $scope.return_sp = function(sp){
        confirm_service('Confirm: adding ' + sku + ' sku to ' + sp.name + ' ?').then(
            function(){
                $modalInstance.close(sp);
            }
        )
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
    $scope.create_new_product = function(){
        $modalInstance.close(null);
    }
}]);