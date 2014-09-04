define(
[
    'angular'
    //----
    ,'app/sp_app/model'
]
,function
(
    angular
)
{
    var mod = angular.module('sp_app/service/api/crud',
    [
         'sp_app/model'
    ]);
    mod.factory('sp_app/service/api/crud',
    [
         '$http'
        ,'$q'
        ,'sp_app/model/Store_product'
    ,function(
         $http
        ,$q
        ,Store_product
    ){
        return{
            insert_new : function(sp,sku){
                var defer = $q.defer();
                $http({
                    url:'/product/insert_new_sp_angular',
                    method: 'POST',
                    data:{sku_str:sku,sp:JSON.stringify(sp)}
                }).then(
                     function(data){ defer.resolve(Store_product.build(data.data)) }
                    ,function(reason){ defer.reject('create new product ajax error')}
                )
                return defer.promise;
            },

            insert_old : function(product_id,sku,sp){
                var promise_ing = $http({
                    url:'/product/sp_insert_old_angular',
                    method:'POST',
                    data:{product_id:product_id,sku_str:sku,sp:JSON.stringify(sp)}
                });
                var promise_ed = promise_ing.then(
                    function(data){
                        var defer = $q.defer();defer.resolve(Store_product.build(data.data));return defer.promise;
                    },
                    function(reason){
                        return $q.reject('insert old sp product ajax error');
                    }
                )
                return promise_ed;              
            },

            update : function(sp){
                var promise_ing =  $http({
                    url:'/product/update_sp_angular',
                    method: 'POST',
                    data:{sp:JSON.stringify(sp)}
                });
                var promise_ed = promise_ing.then(
                     function(data){ var defer = $q.defer();defer.resolve(Store_product.build(data.data));return defer.promise;}
                    ,function(){ return $q.reject('update product ajax error');}
                )
                return promise_ed;
            }
        }
    }])
})