var mod = angular.module('model.store_product');

mod.factory('model.store_product.rest_crud',
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
        insert_new : function(sp,sku){
            var defer = $q.defer();
            $http({
                url:'/sp/insert_new_sp_angular',
                method: 'POST',
                data:{sku_str:sku,sp:JSON.stringify(sp)}
            }).then(
                function(data){ 
                    defer.resolve(Store_product.build(data.data));
                }
                ,function(reason){ 
                    if(reason.data !== null && reason.data !== undefined && reason.data.indexOf('duplicate key value violates unique constraint') !== -1 && reason.data.indexOf('Key (name, store_id)=') !== -1){
                        defer.reject(sp.name + ' is existed. Please select another name');
                    }else{
                        defer.reject(reason);
                    }
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
                    if(reason.data !== null && reason.data !== undefined && reason.data.indexOf('duplicate key value violates unique constraint') !== -1 && reason.data.indexOf('Key (name, store_id)=') !== -1){
                        defer.reject(sp.name + ' is existed. Please select another name');
                    }else{
                        defer.reject(reason);
                    }
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
}]);