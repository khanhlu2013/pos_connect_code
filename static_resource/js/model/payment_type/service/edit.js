define(
[
    'angular'
    //--
    ,'model/payment_type/service/prompt'
    ,'model/payment_type/api'    
]
,function
(
    angular
)
{
    var mod = angular.module('payment_type/service/edit',
    [
         'payment_type/service/prompt'
        ,'payment_type/api'         
    ]);
    mod.factory('payment_type/service/edit',
    [
         '$http'
        ,'$q'
        ,'payment_type/service/prompt'
        ,'payment_type/api'
    ,function(
         $http
        ,$q
        ,prompt_service
        ,api
    ){
        return function(prefill_pt){
            var defer = $q.defer();
            prompt_service(prefill_pt).then(
                function(prompt_pt){
                    api.edit(prompt_pt).then(
                        function(edited_pt){ 
                            defer.resolve(edited_pt);
                        }
                        ,function(reason){ 
                            defer.reject(reason); 
                        }
                    )
                }
                ,function(reason){ defer.reject(reason); }
            )
            return defer.promise;
        }
    }]);
})