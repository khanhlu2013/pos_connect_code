define(
[
    'angular'
    //-------
    ,'app/sp_app/model'
]
,function
(
    angular
)
{
    var mod = angular.module('sp_app/service/api/group',
    [
        'sp_app/model'
    ]);
    mod.factory('sp_app/service/api/group',
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
            update : function(sp){
                var defer = $q.defer();
                $http({
                    url: '/product/group/update_angular',
                    method : "POST",
                    data: {sp:JSON.stringify(sp)}
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
})