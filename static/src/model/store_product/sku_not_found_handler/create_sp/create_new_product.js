var mod = angular.module('model.store_product');

mod.factory('model.store_product.sku_not_found_handler.create.new',
[
     '$http'
    ,'$q'
    ,'model.store_product.prompt'
    ,'model.store_product.rest_crud'
,function(
     $http
    ,$q
    ,prompt_service
    ,sp_crud_api
){
    return function(sku){
        var defer = $q.defer();
        prompt_service(null/*original_sp*/,null/*suggest_product*/,null/*duplicate_sp*/,sku,false/*is_operate_offline*/).then(
             function(prompt_data){ 
                sp_crud_api.insert_new(prompt_data.sp,sku).then(
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
        );
        return defer.promise;
    }
}]);