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
                var last_item = result[result.length-1];var cur_item = ds_lst[i];

                var non_product_condition = 
                       last_item.non_inventory !== null 
                    && cur_item.non_inventory !== null
                    && last_item.non_inventory.name === cur_item.non_inventory.name;

                var product_condition = 
                       last_item.store_product !== null 
                    && cur_item.store_product !== null
                    && last_item.store_product.sp_doc_id === cur_item.store_product.sp_doc_id;            

                //mm deal condition
                var mm_deal_condition = true;
                if(is_consider_mm_deal){
                    mm_deal_condition = (
                           (last_item.mm_deal_info !== null && cur_item.mm_deal_info !== null && last_item.mm_deal_info.mm_deal === cur_item.mm_deal_info.mm_deal)
                        || (last_item.mm_deal_info === null && cur_item.mm_deal_info === null)
                    )                    
                }

                if(
                       (non_product_condition || product_condition)
                    && last_item.get_genesis_price() === cur_item.get_genesis_price()
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