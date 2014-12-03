define(
[
     'angular'
    ,'model/product/model'
]
,function
(
    angular
)
{
    var mod = angular.module('product/network_product_api',
    [
        'product/model'
    ]);
    mod.factory('product/network_product_api',
    [
         '$http'
        ,'$q'
        ,'product/model/Product'
    ,function(
         $http
        ,$q
        ,Product
    ){
        return function(product_id){
            var defer = $q.defer();
            var data = 
            {
                product_id:product_id
            };
            $http({
                 url : 'product/network_product'
                ,method: 'GET'
                ,params:{
                    data: JSON.stringify(data)
                }
            }).then(
                function(data){
                    defer.resolve(Product.build(data.data));
                },function(response){
                    defer.reject(response);
                }
            )
            return defer.promise;
        }    
    }])
})