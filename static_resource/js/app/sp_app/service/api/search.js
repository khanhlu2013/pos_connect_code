define(
[
    'angular'
    //---
    ,'app/sp_app/model'
    ,'app/product_app/model'
]
,function
(
    angular
)
{
    var mod = angular.module('sp_app/service/api/search',
    [
         'sp_app/model'
        ,'product_app/model'
    ]);
    mod.factory('sp_app/service/api/search',
    [
         '$http'
        ,'$q'
        ,'sp_app/model/Store_product'
        ,'product_app/model/Product'
    ,function(
         $http
        ,$q
        ,Store_product
        ,Product
    ){
        return {
            product_id_search : function(product_id){
                var defer = $q.defer();
                $http({
                    url:'/product/search_by_product_id',
                    method:'GET',
                    params:{product_id:product_id}
                }).then(
                     function(data){ 
                        var sp = Store_product.build(data.data);
                        defer.resolve(sp); 
                    }
                    ,function(reason){ 
                        defer.reject(reason); 
                    }
                )

                return defer.promise;
            }
            ,name_search: function(name_search_str,after){
                var defer = $q.defer();

                name_search_str = name_search_str.trim();
                if(name_search_str.length == 0){
                    defer.reject('error: name search is empty');
                    return defer.promise;
                }

                var words = name_search_str.split(' ');
                if(words.length > 2){
                    defer.reject('error: search 2 words maximum');
                    return defer.promise;
                }

                $http({
                    url: '/product/search_by_name_angular',
                    method : "GET",
                    params: {name_str:name_search_str,after:after}
                })
                .then(
                    function(data){
                        defer.resolve(data.data.map(Store_product.build));
                    },function(reason){
                        defer.reject(reason);
                    }
                )
                return defer.promise
            }
            ,sku_search: function(sku_search_str){
                sku_search_str = sku_search_str.trim();
                if(sku_search_str.length == 0){ return $q.reject('error: sku is empty'); }
                if(sku_search_str.indexOf(' ') >= 0){ return $q.reject('error: sku cannot contain space'); }

                var defer = $q.defer();
                $http({
                    url:'/product/search_by_sku_angular',
                    method:'GET',
                    params:{sku_str:sku_search_str}
                }).then(
                    function(data){
                        var result = {
                             prod_store__prod_sku__1_1:data.data.prod_store__prod_sku__1_1.map(Store_product.build)
                            ,prod_store__prod_sku__1_0:data.data.prod_store__prod_sku__1_0.map(Store_product.build)
                            ,prod_store__prod_sku__0_0:data.data.prod_store__prod_sku__0_0.map(Product.build)
                        };
                        defer.resolve(result);
                    },
                    function(reason){ 
                        defer.reject(reason); 
                    }
                )
                return defer.promise;
            }
            ,name_sku_search: function(search_str,after){
                var token_lst = search_str.split(' ');
                if(token_lst.length > 2){
                    return $q.reject('2 words search max');
                }

                var defer = $q.defer();
                $http({
                    url : '/product/search_by_name_sku_angular',
                    method: 'GET',
                    params : {'search_str':search_str,'after':0}
                })
                .then(
                    function(data){ 
                        defer.resolve(data.data.map(Store_product.build));
                    }
                    ,function(reason){
                        defer.reject(reason);
                    }
                )
                return defer.promise;
            }
        }
    }])
})