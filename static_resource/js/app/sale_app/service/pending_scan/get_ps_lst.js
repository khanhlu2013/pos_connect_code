define(
[
     'angular'
    //-------
    ,'lib/ngStorage'
]
,function
(
    angular
)
{
    var mod = angular.module('sale_app/service/pending_scan/get_ps_lst',['ngStorage']);
    mod.factory('sale_app/service/pending_scan/get_ps_lst',['$localStorage',function($localStorage){
        return function(){
            var str = $localStorage.pending_scan_lst;
            if(str == undefined){
                return undefined;
            }else{
                return JSON.parse(str);
            }
        }
    }])
})