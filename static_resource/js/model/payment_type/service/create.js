define(
[
    'angular'
    //---
    ,'model/payment_type/api'
    ,'model/payment_type/service/prompt'
]
,function
(
    angular
)
{
    var mod = angular.module('payment_type/service/create',
    [
         'payment_type/api'
        ,'payment_type/service/prompt'
    ]);
    mod.factory('payment_type/service/create',
    [
         '$http'
        ,'$q'
        ,'payment_type/api'
        ,'payment_type/service/prompt'
    ,function(
         $http
        ,$q
        ,api
        ,prompt_service
    ){
        return function(){
            var defer = $q.defer();

            prompt_service(null/*prefill*/).then(
                function(pt){
                    api.create(pt).then(
                         function(pt){ defer.resolve(pt); }
                        ,function(reason){ defer.reject(reason); }
                    )
                }
                ,function(reason){ defer.reject(reason); }
            )
            return defer.promise;
        }
    }]);
})