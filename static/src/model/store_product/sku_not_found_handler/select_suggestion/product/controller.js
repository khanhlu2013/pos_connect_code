var mod = angular.module('model.store_product');

mod.controller('model.store_product.sku_not_found_handler.select_suggestion.product.controller',
[
    '$scope',
    '$modalInstance',
    '$injector',
    'model.store_product.sku_not_found_handler.select_suggestion.product.confirm',
    'product_lst',
    'my_sp_lst',
    'sku',
function(
    $scope,
    $modalInstance,
    $injector,
    select_product_confirmation,
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
    $scope.select_product = function(product){
        select_product_confirmation(product,product_lst,my_sp_lst,sku).then(
            function(response){
                $modalInstance.close(response);
            }
            ,function(reason){
                $modalInstance.dismiss(reason);
            }
        )
    }
    $scope.select_sp = function(){
        var select_sp_service = $injector.get('model.store_product.sku_not_found_handler.select_suggestion.store_product')
        select_sp_service(product_lst,my_sp_lst,sku).then(
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
}])