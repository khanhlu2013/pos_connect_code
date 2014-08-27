define(
[
     'angular'
    //-------

]
,function
(
    angular
)
{
    var mod = angular.module('sale_app/service/pending_scan/get_ps_lst',[]);
    mod.factory('sale_app/service/pending_scan/get_ps_lst',[function(){
        return function(){
            var str = localStorage.getItem('pending_scan_lst');
            if(str == undefined){
                return undefined;
            }else{
                return JSON.parse(str);
            }
        }
    }])
})