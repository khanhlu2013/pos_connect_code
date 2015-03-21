var mod = angular.module('model.store_product');

mod.factory('model.store_product.rest_sku',
[
     '$http'
    ,'$q'
    ,'model.store_product.Store_product'
,function(
     $http
    ,$q
    ,Store_product
){
    return{
        add_sku : function(product_id,sku){
            var defer = $q.defer();
            $http({
                url:'/sp/sku_add_angular',
                method:'POST',
                data: {product_id:product_id,sku_str:sku}
            })
            .then(
                function(data){ 
                    defer.resolve(Store_product.build(data.data));
                }
                ,function(reason){
                    defer.reject(reason); 
                }
            )               
            return defer.promise;
        },

        delete_sku : function(product_id,sku){
            var defer = $q.defer();
            $http({
                url:'/sp/sku_assoc_delete_angular',
                method:'POST',
                data:{product_id:product_id,sku_str:sku}
            })
            .then(
                function(data){ 
                    defer.resolve(Store_product.build(data.data));
                }
                ,function(reason){ 
                    defer.reject(reason); 
                }
            )        
            return defer.promise;        
        }
    }
}])
