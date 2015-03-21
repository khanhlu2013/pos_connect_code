var mod = angular.module('model.store_product');

mod.factory('model.store_product.rest_type_tag',
[
    '$rootScope',
    '$http',
    '$q',
function(
    $rootScope,
    $http,
    $q
){
    return function(){
        var defer = $q.defer();

        $http({
            url:'/sp/get_lookup_type_tag',
            method:'GET'
        }).then(
             function(data){
                $rootScope.$emit('type_tag_downloaded_from_server',data.data);
                defer.resolve(data.data);
            }
            ,function(reason){
                defer.reject(reason);
            }
        )

        return defer.promise;   
    }
}]);
