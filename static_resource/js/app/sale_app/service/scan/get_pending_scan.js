define(
[
    'angular'
]
,function
(
    angular
)
{
    var mod = angular.module('sale_app/service/scan/get_pending_scan',[]);
    mod.factory('sale_app/service/scan/get_pending_scan',[function(){
        return function(){
            var str = localStorage.getItem('pending_scan_lst');
            if(str == null){
                return [];
            }else{
                return JSON.parse(str);
            } 
        }
    }])
})