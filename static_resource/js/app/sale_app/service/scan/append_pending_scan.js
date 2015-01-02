define(
[
     'angular'
    //-------
    ,'app/sale_app/service/pending_scan/get_api'
    ,'app/sale_app/service/pending_scan/set_api'
    ,'app/sale_app/model'
    ,'model/sp/api_offline'
]
,function
(
    angular
)
{
    var mod = angular.module('sale_app/service/scan/append_pending_scan',
    [
         'sale_app/service/pending_scan/get_api'
        ,'sale_app/service/pending_scan/set_api'
        ,'sale_app/model'
        ,'sp/api_offline'
    ]);
    mod.factory('sale_app/service/scan/append_pending_scan',
    [   
         '$q'
        ,'sale_app/service/pending_scan/get_api'
        ,'sale_app/service/pending_scan/set_api'
        ,'sale_app/model/Pending_scan'
        ,'sp/api_offline'
        ,'blockUI'           
    ,function(
         $q
        ,get_ps_lst
        ,set_ps_lst
        ,Pending_scan
        ,offline_sp_api
        ,blockUI
    ){
        function by_product_id(product_id,qty,non_inventory,override_price,GLOBAL_SETTING){
            blockUI.start();
            var defer = $q.defer();
            offline_sp_api.by_product_id(product_id,GLOBAL_SETTING).then(
                 function(sp){
                    var ps_lst = by_doc_id(sp.sp_doc_id,qty,non_inventory,override_price);
                    defer.resolve(ps_lst); 
                    blockUI.stop();
                }
                ,function(reason){blockUI.stop();return $q.reject(reason)}
            )
            return defer.promise;
        }

        function by_doc_id(ps_doc_id,qty,non_inventory,override_price){
            // blockUI.start();

            var ps_lst = get_ps_lst();
            var ps = new Pending_scan(
                 ps_doc_id
                ,non_inventory
                ,qty
                ,override_price
                ,null//discount
                , new Date()
            );
            if(ps_lst.length == 0){
                ps_lst.push(ps);
            }else{  
                if(non_inventory !==null){
                    ps_lst.push(ps);
                }else{
                    var last_ps = ps_lst[ps_lst.length-1];
                    if(last_ps.ps_doc_id === ps_doc_id && last_ps.override_price === override_price){
                        last_ps.qty += qty;
                    }else{
                        ps_lst.push(ps);
                    }
                }
            }
            set_ps_lst(ps_lst);
            // blockUI.stop();
            return ps_lst;
        }

        return{
             by_product_id : by_product_id
            ,by_doc_id : by_doc_id
        }
    }])
})