/*
    
*/

define(
[
    'angular'
]
,function
(
    angular
)
{
    var mod = angular.module('sale_app/service/displaying_scan/compress_ds_lst',[]);
    mod.factory('sale_app/service/displaying_scan/compress_ds_lst',[function(){
        return function(ds_lst,is_consider_mm_deal){
            var result = [];

            for(var i = 0;i<ds_lst.length;i++){
                if(i == 0){
                    result.push(ds_lst[0]);
                    continue;
                }

                var last_item = result[result.length-1];
                var cur_item = ds_lst[i];

                if(last_item.store_product == null || cur_item.store_product == null){
                    result.push(cur_item);
                    continue;
                }            

                var mm_deal_condition = true;
                if(is_consider_mm_deal){
                    mm_deal_condition = (
                           (last_item.mm_deal_info !== null && cur_item.mm_deal_info !== null && last_item.mm_deal_info.mm_deal === cur_item.mm_deal_info.mm_deal)
                        || (last_item.mm_deal_info === null && cur_item.mm_deal_info === null)
                    )                    
                }
                if(
                       last_item.store_product.product_id === cur_item.store_product.product_id
                    && last_item.get_regular_price() === cur_item.get_regular_price()
                    && last_item.discount === cur_item.discount
                    && mm_deal_condition
                ){
                    last_item.qty += 1;
                }else{
                    result.push(cur_item);
                }
            }

            return result;
        }
    }])
})