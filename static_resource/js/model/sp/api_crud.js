define(
[
    'angular'
    //----
    ,'model/sp/model'
]
,function
(
    angular
)
{
    var mod = angular.module('sp/api_crud',
    [
         'sp/model'
    ]);
    mod.factory('sp/api_crud',
    [
         '$http'
        ,'$q'
        ,'sp/model/Store_product'
    ,function(
         $http
        ,$q
        ,Store_product
    ){
        return{
            insert_new : function(sp,sku){
                var defer = $q.defer();
                $http({
                    url:'/sp/insert_new_sp_angular',
                    method: 'POST',
                    data:{sku_str:sku,sp:JSON.stringify(sp)}
                }).then(
                    function(data){ 
                        defer.resolve(Store_product.build(data.data)) 
                    }
                    ,function(reason){ 
                        defer.reject(reason);
                    }
                )
                return defer.promise;
            },

            insert_old : function(product_id,sku,sp){
                var defer = $q.defer();
                $http({
                    url:'/sp/sp_insert_old_angular',
                    method:'POST',
                    data:{product_id:product_id,sku_str:sku,sp:JSON.stringify(sp)}
                }).then(
                    function(data){ 
                        defer.resolve(Store_product.build(data.data)); 
                    }
                    ,function(reason){ 
                        defer.reject(reason);
                    }
                )
                return defer.promise;
            },

            update : function(sp){
                var defer = $q.defer();
                $http({
                    url:'/sp/update_sp_angular',
                    method: 'POST',
                    data:{sp:JSON.stringify(sp)}
                }).then(
                    function(data){ 
                        defer.resolve(Store_product.build(data.data))
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