define(
[
    'angular'
    //-------
    ,'model/sp/model'
]
,function
(
    angular
)
{
    var mod = angular.module('sp/api_group',
    [
        'sp/model'
    ]);
    mod.factory('sp/api_group',
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
            update : function(sp){
                var defer = $q.defer();
                $http({
                    url: '/sp/group/update_angular',
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