define(
[
     'angular'
    //-------
    ,'app/sale_app/service/pending_scan/get_ps_lst'
    ,'app/sale_app/service/pending_scan/set_ps_lst'
    ,'app/sale_app/model'
]
,function
(
    angular
)
{
    var mod = angular.module('sale_app/service/scan/append_pending_scan',
    [
         'sale_app/service/pending_scan/get_ps_lst'
        ,'sale_app/service/pending_scan/set_ps_lst'
        ,'sale_app/model'
    ]);
    mod.factory('sale_app/service/scan/append_pending_scan',
    [   
         'sale_app/service/pending_scan/get_ps_lst'
        ,'sale_app/service/pending_scan/set_ps_lst'
        ,'sale_app/model/Pending_scan'
        ,'$localStorage'
    ,function(
         get_ps_lst
        ,set_ps_lst
        ,Pending_scan
    ){
        return function(product_id,qty,non_product_name,override_price){
            var ps_lst = get_ps_lst();
            var ps = new Pending_scan(
                 product_id
                ,non_product_name
                ,qty
                ,override_price
                ,null//discount
            );
            if(ps_lst.length == 0){
                ps_lst.push(ps);
            }else{  
                if(non_product_name !=null){
                    ps_lst.push(ps);
                }else{
                    var last_ps = ps_lst[ps_lst.length-1];
                    if(last_ps.product_id === product_id && last_ps.override_price === override_price){
                        last_ps.qty += qty;
                    }else{
                        ps_lst.push(ps);
                    }
                }
            }
            set_ps_lst(ps_lst);
            return ps_lst;
        }
    }])
})