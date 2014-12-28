define(
[
    'angular'
    //---
    ,'model/report/service/prompt'
    ,'model/report/api'
]
,function
(
    angular
)
{
    var mod = angular.module('report/service/edit',
    [
         'report/service/prompt'
        ,'report/api'
    ]);
    mod.factory('report/service/edit',
    [
         '$http'
        ,'$q'
        ,'report/service/prompt'
        ,'report/api'
    ,function(
         $http
        ,$q
        ,report_prompt
        ,api
    ){
        return function(original_report){
            var defer = $q.defer();

            api.get_item(original_report.id)
            .then(
                function(report){ 
                    return report_prompt(report); 
                }
                ,function(reason){
                    defer.reject(reason); 
                }
            )
            .then(
                function(prompt_data){
                    api.edit_item(prompt_data,original_report.id)
                    .then(
                        function(report){
                            defer.resolve(report);
                        }
                        ,function(reason){
                            defer.reject(reason);
                        }
                    )
                },
                function(reason){
                    defer.reject(reason);
                }
            );

            return defer.promise;
        }
    }])
})