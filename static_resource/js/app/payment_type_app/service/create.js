define(
[
    'angular'
    //---
    ,'app/payment_type_app/service/api'
    ,'app/payment_type_app/service/prompt'
]
,function
(
    angular
)
{
    var mod = angular.module('payment_type_app/service/create',
    [
         'payment_type_app/service/api'
        ,'payment_type_app/service/prompt'
    ]);
    mod.factory('payment_type_app/service/create',
    [
         '$http'
        ,'$q'
        ,'payment_type_app/service/api'
        ,'payment_type_app/service/prompt'
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