/*
    provide a service to toogle value customer price
*/
define(
[
     'angular'
    //-------
    ,'app/sale_app/service/displaying_scan/set_ds_lst'
]
,function
(
    angular
)
{
    var mod = angular.module('sale_app/service/scan/toogle_value_customer_price',
    [
         'sale_app/service/displaying_scan/set_ds_lst'
    ]);
    mod.factory('sale_app/service/scan/toogle_value_customer_price',
    [
         '$q'
        ,'IS_USE_VALUE_CUSTOMER_PRICE'
        ,'sale_app/service/displaying_scan/set_ds_lst'
    ,function(
         $q
        ,iuvcp
        ,set_ds_lst
    ){
        
        function _get_local_storage(){
            var result;
            var str = localStorage.getItem(iuvcp);
            if(str === null){
                _set_local_storage(false);
                result = false;
            }else{
                result = JSON.parse(str); 
            }
            return result;
        }
        function _set_local_storage(is_set){
            localStorage.setItem(iuvcp,is_set);
        }
        function _turn(is_on,ds_lst){
            /*return a promise that resolve to the new ds_lst*/
            var defer = $q.defer();

            for(var i = 0;i<ds_lst.length;i++){
                var cur_item = ds_lst[i];
                if(cur_item.is_non_inventory()){continue;}
                if(cur_item.store_product.value_customer_price === null){continue;}
                cur_item.override_price = (is_on ? cur_item.store_product.value_customer_price : null);
            }
            set_ds_lst(ds_lst);
            defer.resolve(ds_lst);
                    
            return defer.promise;
        }

        //------------------------
        return function(ds_lst){
            /*return a promise that resolve to the new ds_lst*/
            var cur_status = _get_local_storage();
            _set_local_storage(!cur_status);
            var promise = _turn(!cur_status,ds_lst);
            return promise;
        }
    }])
})