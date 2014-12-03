define(
[
    'angular'
    //---
    ,'model/sp/model'
]
,function
(
    angular
)
{
    var mod = angular.module('mix_match/model',
    [
        'sp/model'
    ]);
    mod.factory('mix_match/model/Mix_match',
    [
        'sp/model/Store_product'
    ,function(
        Store_product
    ){
        function Mix_match(id,name,mm_price,is_include_crv_tax,qty,sp_lst,is_disable){
            this.id = id;
            this.name = name;
            this.mm_price = mm_price;
            this.is_include_crv_tax = is_include_crv_tax
            this.qty = qty;
            this.sp_lst = sp_lst;
            this.is_disable = is_disable;
        }
        Mix_match.build = function(raw_json){
            return new Mix_match(
                 raw_json.id
                ,raw_json.name
                ,parseFloat(raw_json.mm_price)
                ,raw_json.is_include_crv_tax
                ,raw_json.qty
                ,raw_json.sp_lst.map(Store_product.build)//sp_lst
                ,raw_json.is_disable
            )
        }
        return Mix_match;
    }])
})
