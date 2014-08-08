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
    var mod = angular.module('sp_app/service/api',['sp_app/model','product_app/model']);
    mod.factory('sp_app/service/api',['$http','$q','sp_app/model/Store_product','product_app/model/Product',function($http,$q,Store_product,Product){
        return {
            name_search: function(name_search_str){
                name_search_str = name_search_str.trim();
                if(name_search_str.length == 0){
                    var defer = $q.defer();defer.reject('error: name search is empty');return defer.promise;
                }
                var words = name_search_str.split(' ');
                if(words.length > 2){
                    var defer = $q.defer();defer.reject('error: search 2 words maximum');return defer.promise;
                }
                var promise_ing = $http({
                    url: '/product/search_by_name_angular',
                    method : "GET",
                    params: {name_str:name_search_str}
                });
                var promise_ed = promise_ing.then(
                    function(data){
                        return data.data.map(Store_product.build)
                    },function(reason){
                        return $q.reject('name search ajax error');
                    }
                )
                return promise_ed;
            }

            ,sku_search: function(sku_search_str){
                sku_search_str = sku_search_str.trim();
                if(sku_search_str.length == 0){
                    var defer=$q.defer();defer.reject('error: sku is empty');return defer.promise;
                }               
                if(sku_search_str.indexOf(' ') >= 0){
                    var defer=$q.defer();defer.reject('error: sku cannot contain space');return defer.promise;
                }               
                var promise_ing = $http({
                    url:'/product/search_by_sku_angular',
                    method:'GET',
                    params:{sku_str:sku_search_str}
                });
                var promise_ed = promise_ing.then(
                    function(data){
                        var result = {
                             prod_store__prod_sku__1_1:data.data.prod_store__prod_sku__1_1.map(Store_product.build)
                            ,prod_store__prod_sku__1_0:data.data.prod_store__prod_sku__1_0.map(Store_product.build)
                            ,prod_store__prod_sku__0_0:data.data.prod_store__prod_sku__0_0.map(Product.build)
                        };
                        return result;
                    },
                    function(){
                        return $q.reject('sku search ajax error');
                    }
                )
                return promise_ed;
            }

            ,name_sku_search: function(search_str){
                var token_lst = search_str.split(' ');
                if(token_lst.length > 2){
                    var defer=$q.defer();defer.reject('2 words search max');return defer.promise;
                }
                var promise_ing = $http({
                    url : '/product/search_by_name_sku_angular',
                    method: 'GET',
                    params : {'search_str':search_str}
                });
                var promise_ed = promise_ing.then(
                     function(data){ return data.data.map(Store_product.build);}
                    ,function(){return $q.reject('name sku search ajax error')}
                )
                return promise_ed;
            }
        }
    }])
})