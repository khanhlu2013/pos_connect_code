/*
    High level: this api store and retrieve Hold model (which is a ds_lst + timestamp)
    Low level: we convert between ps and ds when storing and retrieve hold model respectively. 
*/

define(
[
     'angular' 
    //--------
    ,'app/sale_app/service/displaying_scan/calculate_ds_lst'
    ,'app/sale_app/service/hold/model'
    ,'app/sale_app/model'
    ,'app/sale_app/service/pending_scan/get_api'
    ,'app/sale_app/service/pending_scan/set_api'    
]
,function
(
    angular
)
{
    var mod = angular.module('sale_app/service/hold/api',
    [
         'sale_app/service/displaying_scan/calculate_ds_lst'
        ,'sale_app/service/hold/model'
        ,'sale_app/model'
        ,'sale_app/service/pending_scan/get_api'
        ,'sale_app/service/pending_scan/set_api'            
    ]);
    mod.factory('sale_app/service/hold/api',
    [
         '$q'
        ,'$rootScope'
        ,'sale_app/service/displaying_scan/calculate_ds_lst'
        ,'sale_app/service/hold/model/Hold'
        ,'sale_app/model/Pending_scan'
        ,'sale_app/service/pending_scan/get_api'
        ,'sale_app/service/pending_scan/set_api'             
    ,function(
         $q
        ,$rootScope
        ,calculate_ds
        ,Hold
        ,Pending_scan
        ,get_ps_lst
        ,set_ps_lst
    ){
        function get_lst(){
            var defer = $q.defer();

            //take care of init hold_lst to emtpy array 
            var str = localStorage.getItem('hold_lst');
            if(str === null){localStorage.setItem('hold_lst',"[]");defer.resolve([]);return defer.promise;}

            //process str : aka converting ps_lst -> ds_lst
            var raw_lst = JSON.parse(str);
            var promise_lst = []
            for(var i = 0;i<raw_lst.length;i++){
                promise_lst.push(calculate_ds(raw_lst[i].ps_lst,[]/*sp_lst*/));
            }
            $q.all(promise_lst).then(
                function(lst_of_ds_lst){
                    var result = [];
                    for(var i = 0;i<raw_lst.length;i++){
                        var timestamp = raw_lst[i].timestamp;
                        var ds_lst = lst_of_ds_lst[i];
                        var hold = new Hold(new Date(timestamp),ds_lst);
                        result.push(hold);
                    }
                    defer.resolve(result);
                },function(reason){defer.reject(reason);}
            )

            return defer.promise;
        }

        function set(hold_lst){
            var converted_result = []
            for(var i = 0;i<hold_lst.length;i++){
                var cur_hold = hold_lst[i];

                var ps_lst = [];
                for(var j = 0;j<cur_hold.ds_lst.length;j++){
                    var cur_ds = cur_hold.ds_lst[j];
                    ps_lst.push(new Pending_scan(
                         cur_ds.store_product == null ? null : cur_ds.store_product.sp_doc_id
                        ,cur_ds.non_inventory
                        ,cur_ds.qty
                        ,cur_ds.override_price
                        ,cur_ds.discount
                        ,cur_ds.date
                    ));
                }
                converted_result.push({timestamp:cur_hold.timestamp,ps_lst:ps_lst});
            }
            localStorage.setItem('hold_lst',JSON.stringify(converted_result));
        }

        function hold_current_pending_scan_lst(){
            var str = localStorage.getItem('hold_lst');
            var raw_lst;
            if(str === null){
                localStorage.setItem('hold_lst',"[]");
                raw_lst = [];
            }else{
                raw_lst = JSON.parse(str);
            }
            //constructing current hold and append it to local storage if exist
            var cur_ps_lst = get_ps_lst();
            if(cur_ps_lst.length != 0){
                var new_hold = {timestamp:new Date(),ps_lst:cur_ps_lst}
                raw_lst.push(new_hold);
                localStorage.setItem('hold_lst',JSON.stringify(raw_lst));
                set_ps_lst([]);//clear out current pending scan
            }
        }

        return{
             get_lst:get_lst
            ,set:set
            ,hold_current_pending_scan_lst:hold_current_pending_scan_lst
        }
    }])
})