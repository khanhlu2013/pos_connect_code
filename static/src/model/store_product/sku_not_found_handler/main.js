var mod = angular.module('model.store_product');
mod.requires.push.apply(mod.requires,[
    'share.ui',
    'model.product'
]);

mod.factory('model.store_product.sku_not_found_handler',
[
    '$modal',
    '$http',
    '$q',
    'model.store_product.sku_not_found_handler.create.new',
    'model.store_product.sku_not_found_handler.create.old',
    'model.store_product.rest_sku',
    'model.store_product.sku_not_found_handler.select',
    'share.ui.alert',
    'model.store_product.Store_product',
    'model.product.Product',
function(
    $modal,
    $http,
    $q,
    create_new_sp_service,
    create_old_sp_service,
    api_sku,
    sku_not_found_handler_select,
    alert_service,
    Store_product,
    Product
){
    return function(product_lst,my_sp_lst,sku){
        var defer = $q.defer();
        sku_not_found_handler_select(product_lst,my_sp_lst,sku).then(
            function(select_option){
                if(select_option === null)
                {
                    create_new_sp_service(sku).then(
                        function(res){
                            defer.resolve(res);
                        },function(reason){
                            defer.reject(reason);
                        }
                    )
                }
                else if(select_option instanceof Store_product)
                {
                    var cur_store_sp = select_option;
                    api_sku.add_sku(cur_store_sp.product_id,sku).then(
                        function(res){
                            defer.resolve(res);
                        },function(reason){
                            defer.reject(reason);
                        }
                    )
                }
                else if(select_option instanceof Product)
                {
                    var suggest_product = select_option;
                    create_old_sp_service(suggest_product,sku).then(
                        function(res){
                            defer.resolve(res);
                        },function(reason){
                            defer.reject(reason);
                        }
                    )
                }else{
                    alert_service('Bug: Unexpected select option:' + select_option.constructor.name);
                }
            },
            function(reason){
                defer.reject(reason);
            }
        );
        return defer.promise;
    }
}]);