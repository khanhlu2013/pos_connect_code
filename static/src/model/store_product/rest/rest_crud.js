var mod = angular.module('model.store_product');

mod.factory('model.store_product.rest_crud',
[
    '$http',
    '$rootScope',
    '$q',
    'model.store_product.Store_product',
function(
    $http,
    $rootScope,
    $q,
    Store_product
){
    var _response = function(response_data,defer){
        var response_sp = Store_product.build(response_data);
        var type_tag_obj = {
            p_type : response_sp.p_type,
            p_tag : response_sp.p_tag
        }
        $rootScope.$emit('type_tag_uploaded_to_server',type_tag_obj)
        defer.resolve(response_sp);
    }

    var insert_new = function(sp,sku){
        var defer = $q.defer();
        $http({
            url:'/sp/insert_new_sp_angular',
            method: 'POST',
            data:{sku_str:sku,sp:JSON.stringify(sp)}
        }).then(
            function(data){ 
                _response(data.data,defer);
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
    }

    var insert_old = function(product_id,sku,sp){
        var defer = $q.defer();
        $http({
            url:'/sp/sp_insert_old_angular',
            method:'POST',
            data:{product_id:product_id,sku_str:sku,sp:JSON.stringify(sp)}
        }).then(
            function(data){ 
                _response(data.data,defer);
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
    }

    var update = function(sp){
        var defer = $q.defer();
        $http({
            url:'/sp/update_sp_angular',
            method: 'POST',
            data:{sp:JSON.stringify(sp)}
        }).then(
            function(data){ 
                _response(data.data,defer);
            }
            ,function(reason){ 
                defer.reject(reason);
            }
        )
        return defer.promise;        
    }


    return{
        insert_new : insert_new,
        insert_old : insert_old,
        update : update
    }
}]);