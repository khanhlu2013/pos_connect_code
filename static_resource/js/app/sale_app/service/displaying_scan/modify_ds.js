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
    var mod = angular.module('sale_app/service/displaying_scan/modify_ds',
    [
        'sale_app/service/displaying_scan/set_ds_lst'
    ]);
    mod.factory('sale_app/service/displaying_scan/modify_ds',
    [
        'sale_app/service/displaying_scan/set_ds_lst'
    ,function(
        set_ds_lst
    ){
        return function(index,instruction,ds_lst){
            //exe instruction
            if(instruction.is_delete){
                ds_lst.splice(index,1);
            }else{
                var ds = ds_lst[index];
                if(instruction.new_qty!==undefined && instruction.new_qty!==null){ds.qty = instruction.new_qty;}
                if(instruction.new_price!==undefined){ds.override_price = instruction.new_price;}
                if(instruction.discount!=undefined){ds.discount = instruction.new_discount;}
                if(instruction.new_non_product_name!=undefined){ds.non_product_name = instruction.new_non_product_name;}
            }            
            set_ds_lst(ds_lst);
        }
    }])
})