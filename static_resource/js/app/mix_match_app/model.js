define(
[
    'angular'
    //---
    ,'app/sp_app/model'
]
,function
(
    angular
)
{
    var mod = angular.module('mix_match_app/model',['sp_app/model']);
    mod.factory('mix_match_app/model/Mix_match',['sp_app/model/Store_product',function(Store_product){
    	function Mix_match(id,name,mm_price,is_include_crv_tax,qty,sp_lst){
    		this.id = id;
    		this.name = name;
    		this.mm_price = mm_price;
    		this.is_include_crv_tax = is_include_crv_tax
    		this.qty = qty;
    		this.sp_lst = sp_lst;
    	}
 		Mix_match.build = function(raw_json){
            var raw_sp_lst = [];
            for(var i = 0;i<raw_json.mix_match_child_set.length;i++){
                raw_sp_lst.push(raw_json.mix_match_child_set[i].store_product);
            }
            var sp_lst = raw_sp_lst.map(Store_product.build);
    		return new Mix_match(
    			raw_json.id,
    			raw_json.name,
    			parseFloat(raw_json.mm_price),
    			raw_json.is_include_crv_tax,
    			raw_json.qty,
    			sp_lst
    		)
    	}
    	return Mix_match;
    }])
})
