define(
[
     'angular'
    ,'app/product_app/model'
]
,function
(
    angular
)
{
    var mod = angular.module('product_app/api/network_product',
    [
        'product_app/model'
    ]);
    mod.factory('product_app/api/network_product',
    [
         '$http'
        ,'$q'
        ,'product_app/model/Product'
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