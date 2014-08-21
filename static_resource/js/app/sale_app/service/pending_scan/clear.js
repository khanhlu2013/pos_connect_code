define(
[
    'angular'
]
,function
(
    angular
)
{
    var mod = angular.module('sale_app/service/pending_scan/clear',[]);
    mod.factory('sale_app/service/pending_scan/clear',[function(){
        return function(){
            localStorage.removeItem('pending_scan_lst');
        }
    }]);
})