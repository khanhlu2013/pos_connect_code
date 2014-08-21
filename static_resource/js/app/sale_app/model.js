define(
[
    'angular'
]
,function
(
    angular
)
{
    var mod = angular.module('sale_app/model',[]);
    mod.factory('sale_app/model/Pending_scan',[function(){
        //CONSTRUCTOR
        function Pending_scan(
             product_id
            ,non_product_name
            ,qty
            ,override_price
            ,discount
        ){
            this.product_id = product_id;
            this.non_product_name = non_product_name;
            this.qty = qty;
            this.override_price = override_price;
            this.discount = discount;
        }

        return Pending_scan;
    }])

    mod.factory('sale_app/model/Displaying_scan',[function(){
        //CONSTRUCTOR
        function Displaying_scan(
             store_product
            ,non_product_name
            ,qty
            ,override_price
            ,discount
            ,mm_deal_info
        ){
            this.store_product = store_product;
            this.non_product_name = non_product_name;
            this.qty = qty;
            this.override_price = override_price;
            this.discount = discount;
            this.mm_deal_info = mm_deal_info;
        }

        return Displaying_scan;
    }])    
})