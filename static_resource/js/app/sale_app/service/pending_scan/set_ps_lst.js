define(
[
     'angular'
    //--------
    ,'lib/ngStorage'
]
,function
(
    angular
)
{
    var mod = angular.module('sale_app/service/pending_scan/set_ps_lst',['ngStorage']);
    mod.factory('sale_app/service/pending_scan/set_ps_lst',['$localStorage',function($localStorage){
        return function(lst){
            $localStorage.pending_scan_lst = JSON.stringify(lst);
        }
    }]);
})