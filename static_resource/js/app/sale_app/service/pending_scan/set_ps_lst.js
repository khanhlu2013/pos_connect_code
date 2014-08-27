define(
[
     'angular'
    //--------
]
,function
(
    angular
)
{
    var mod = angular.module('sale_app/service/pending_scan/set_ps_lst',[]);
    mod.factory('sale_app/service/pending_scan/set_ps_lst',[function(){
        return function(lst){
            localStorage.setItem('pending_scan_lst',JSON.stringify(lst))
        }
    }]);
})