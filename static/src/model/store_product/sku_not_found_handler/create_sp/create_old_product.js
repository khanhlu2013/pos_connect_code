var mod = angular.module('model.store_product');

mod.factory('model.store_product.sku_not_found_handler.create.old',
[
    '$http',
    '$q',
    'model.store_product.prompt',
    'model.store_product.rest_sku',
    'model.store_product.rest_crud',
function(
    $http,
    $q,
    prompt_service,
    api_sku,
    sp_crud_api
){
    return function(suggest_product,sku){
        var defer = $q.defer();
        prompt_service(null/*original_sp*/,suggest_product,null/*duplicate_sp*/,sku,false/*is_operate_offline*/).then(
             function(prompt_data){ 
                sp_crud_api.insert_old(suggest_product.product_id,sku,prompt_data.sp).then(
                    function(res){
                        defer.resolve(res);
                    },function(reason){
                        defer.reject(reason);
                    }
                )
            }
            ,function(reason){ 
                defer.reject(reason);
            }
        )
        return defer.promise;
    }
}]);