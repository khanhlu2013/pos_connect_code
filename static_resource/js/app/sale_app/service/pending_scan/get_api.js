define(
[
     'angular'
    //-------
    ,'app/sale_app/service/pending_scan/set_api'

]
,function
(
    angular
)
{
    var mod = angular.module('sale_app/service/pending_scan/get_api',
    [
        'sale_app/service/pending_scan/set_api'
    ]);
    mod.factory('sale_app/service/pending_scan/get_api',
    [
        'sale_app/service/pending_scan/set_api'
    ,function(
        set_ps_lst
    ){
        return function(){
            var str = localStorage.getItem('pending_scan_lst');
            if(str == undefined){
                var ps_lst = []
                set_ps_lst(ps_lst);
                return ps_lst;
            }else{
                return JSON.parse(str);
            }
        }
    }])
})