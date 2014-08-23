define(
[
     'angular'
    //-------
    ,'app/sale_app/service/pending_scan/set_ps_lst'
    ,'app/sale_app/service/displaying_scan/compress_ds_lst'
    ,'app/sale_app/model'
]
,function
(
    angular
)
{
    var mod = angular.module('sale_app/service/displaying_scan/modify_ds',
    [
         'sale_app/service/pending_scan/set_ps_lst'
        ,'sale_app/service/displaying_scan/compress_ds_lst'
        ,'sale_app/model'
    ]);
    mod.factory('sale_app/service/displaying_scan/modify_ds',
    [
         'sale_app/service/pending_scan/set_ps_lst'
        ,'sale_app/service/displaying_scan/compress_ds_lst'
        ,'sale_app/model/Pending_scan'
    ,function(
         set_ps_lst
        ,compress_ds_lst
        ,Pending_scan
    ){
        return function(index,instruction,ds_lst){

            //exe instruction
            if(instruction.is_delete){
                ds_lst.splice(index,1);
            }else{
                var ds = ds_lst[index];
                if(instruction.new_qty!=null){ds.qty = instruction.new_qty;}
                if(instruction.new_price!=null){ds.override_price = instruction.new_price;}
                if(instruction.discount!=null){ds.discount = instruction.new_discount;}
            }            

            //reforming ps_lst
            var ds_lst_compressed = compress_ds_lst(ds_lst,false/*is_consider_mm_deal*/);
            var ps_lst = []
            for(var i = 0;i<ds_lst_compressed.length;i++){
                var cur_ds = ds_lst[i];
                ps_lst.push(new Pending_scan(
                     cur_ds.store_product == null ? null : cur_ds.store_product.product_id
                    ,cur_ds.non_product_name
                    ,cur_ds.qty
                    ,cur_ds.override_price
                    ,cur_ds.discount
                ));
            }
            set_ps_lst(ps_lst);
        }
    }])
})