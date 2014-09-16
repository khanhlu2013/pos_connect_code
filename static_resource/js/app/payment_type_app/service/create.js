define(
[
    'angular'
    //---
    ,'service/ui'
    ,'app/payment_type_app/service/api'
]
,function
(
    angular
)
{
    var mod = angular.module('payment_type_app/service/create',
    [
         'service/ui'
        ,'payment_type_app/service/api'
    ]);
    mod.factory('payment_type_app/service/create',
    [
         '$http'
        ,'$q'
        ,'service/ui/prompt'
        ,'payment_type_app/service/api'
    ,function(
         $http
        ,$q
        ,prompt_service
        ,api
    ){
        return function(){
            var defer = $q.defer();

            prompt_service('create new payment type',null/*prefill*/,false/*is_null_allow*/,false/*is_float*/).then(
                function(prompt_str){
                    api.create(prompt_str).then(
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