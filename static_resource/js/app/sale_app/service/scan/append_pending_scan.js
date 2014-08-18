define(
[
     'angular'
    //-------
    ,'app/sale_app/service/scan/get_pending_scan'
    ,'app/sale_app/model'
]
,function
(
    angular
)
{
    var mod = angular.module('sale_app/service/scan/append_pending_scan',
    [
         'sale_app/service/scan/get_pending_scan'
        ,'sale_app/model'
    ]);
    mod.factory('sale_app/service/scan/append_pending_scan',
    [   
         'sale_app/service/scan/get_pending_scan'
        ,'sale_app/model/Pending_scan'
    ,function(
         get_pending_scan
        ,Pending_scan
    ){
        return function(product_id,non_product_name,qty,overide_price){
            var ps_lst = get_pending_scan();
            var ps = new Pending_scan(
                 product_id
                ,non_product_name
                ,qty
                ,overide_price
                ,null//discount
            );
            if(ps_lst.length == 0){
                ps_lst.push(ps);
            }else{  
                if(non_product_name !=null){
                    ps_lst.push(ps);
                }else{
                    var last_ps = ps_lst[ps_lst.length-1];
                    if(last_ps.product_id === product_id && last_ps.overide_price === overide_price){
                        last_ps.qty += qty;
                    }else{
                        ps_lst.push(ps);
                    }
                }
            }
            localStorage.setItem('pending_scan_lst',JSON.stringify(ps_lst));
            return ps_lst;
        }
    }])
})