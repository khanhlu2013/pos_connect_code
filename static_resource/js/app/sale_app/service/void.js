define(
[
     'angular'
    //--------
    ,'app/sale_app/service/pending_scan/clear'
]
,function
(
    angular
)
{
    var mod = angular.module('sale_app/service/void',['sale_app/service/pending_scan/clear']);
    mod.factory('sale_app/service/void',['sale_app/service/pending_scan/clear',function(clear_ps){
        return function(){
            clear_ps();
        }
    }])
}