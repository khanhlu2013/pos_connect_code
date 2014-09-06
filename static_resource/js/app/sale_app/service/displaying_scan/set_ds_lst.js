/*
    DESC    : giving the ds_lst as param, this service compressed it to form an equivalent ps_lst and saved it
    RETURN  : void
*/

define(
[
    'angular'
    //-------
    ,'app/sale_app/service/pending_scan/set_api'
    ,'app/sale_app/service/displaying_scan/compress_ds_lst'
    ,'app/sale_app/model'    
]
,function
(
    angular
)
{
    var mod = angular.module('sale_app/service/displaying_scan/set_ds_lst',
    [
         'sale_app/service/pending_scan/set_api'
        ,'sale_app/service/displaying_scan/compress_ds_lst'
        ,'sale_app/model'
    ]);
    mod.factory('sale_app/service/displaying_scan/set_ds_lst',[
         'sale_app/service/pending_scan/set_api'
        ,'sale_app/service/displaying_scan/compress_ds_lst'
        ,'sale_app/model/Pending_scan'
    ,function(
         set_ps_lst
        ,compress_ds_lst
        ,Pending_scan
    ){
        return function(ds_lst){
            var ds_lst_compressed = compress_ds_lst(ds_lst,false/*is_consider_mm_deal*/);
            var ps_lst = []
            for(var i = 0;i<ds_lst_compressed.length;i++){
                var cur_ds = ds_lst[i];
                ps_lst.push(new Pending_scan(
                     cur_ds.store_product == null ? null : cur_ds.store_product.sp_doc_id
                    ,cur_ds.non_inventory
                    ,cur_ds.qty
                    ,cur_ds.override_price
                    ,cur_ds.discount
                ));
            }
            set_ps_lst(ps_lst);            
        }
    }])
})