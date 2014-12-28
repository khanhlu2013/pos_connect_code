define(
[
    'angular'
    //---
    ,'model/report/api'
]
,function
(
    angular
)
{
    var mod = angular.module('report/service/create',
    [
         'report/service/prompt'
        ,'report/api'
    ]);
    mod.factory('report/service/create',
    [
         '$q'
        ,'report/service/prompt'
        ,'report/api'
    ,function
    (
         $q
        ,prompt_service
        ,api
    ){
        return function(){
            var prompt_promise = prompt_service(null);
            var create_promise = prompt_promise.then(
                 function(report_prompt_result){ 
                    return api.create(report_prompt_result);
                }
                ,function(reason){
                    return $q.reject(reason);
                }
            );
            return create_promise;
        }
    }])
})