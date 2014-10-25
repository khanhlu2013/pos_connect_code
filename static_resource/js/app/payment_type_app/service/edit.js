define(
[
    'angular'
    //--
    ,'app/payment_type_app/service/prompt'
    ,'app/payment_type_app/service/api'    
]
,function
(
    angular
)
{
    var mod = angular.module('payment_type_app/service/edit',
    [
         'payment_type_app/service/prompt'
        ,'payment_type_app/service/api'         
    ]);
    mod.factory('payment_type_app/service/edit',
    [
         '$http'
        ,'$q'
        ,'payment_type_app/service/prompt'
        ,'payment_type_app/service/api'
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