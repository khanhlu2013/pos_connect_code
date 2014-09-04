/*
    this service get the ps_lst and convert it to ds_lst
*/

define(
[
     'angular'
    //--------
    ,'app/sale_app/service/pending_scan/get_api'
    ,'app/sale_app/service/displaying_scan/calculate_ds_lst'
]
,function
(
    angular
)
{
    var mod = angular.module('sale_app/service/displaying_scan/get_ds_lst',
    [
         'sale_app/service/pending_scan/get_api'
        ,'sale_app/service/displaying_scan/calculate_ds_lst' 
    ]);
    
    mod.factory('sale_app/service/displaying_scan/get_ds_lst',
    [
         'sale_app/service/pending_scan/get_api'
        ,'sale_app/service/displaying_scan/calculate_ds_lst'
    ,function(
         get_ps_lst
        ,calculate_ds_lst
    ){
        return function(){
            var promise = calculate_ds_lst(get_ps_lst());
            return promise;
        }
    }])
})