define(
[
    'angular'
    //-------
    ,'app/group_app/model'
]
,function
(
    angular
)
{
    var mod = angular.module('sp_app/model',[]);
    mod.factory('sp_app/model/Store_product',function(){

    	function Store_product(
            id,
            product_id,
            store_id,
            name,
            price,
            value_customer_price,
            crv,
            is_taxable,
            is_sale_report,
            p_type,
            p_tag,
            cost,
            vendor,
            buydown,
            product,
            group_lst,
            breakdown_assoc_lst,
            kit_assoc_lst
    	){
    		this.id = id;
    		this.product_id = product_id;
    		this.store_id = store_id;
    		this.name = name;
    		this.price = price;
    		this.value_customer_price = value_customer_price;
    		this.crv = crv;
    		this.is_taxable = is_taxable;
    		this.is_sale_report = is_sale_report;
    		this.p_type = p_type;
    		this.p_tag = p_tag;
    		this.cost = cost;
    		this.vendor = vendor;
    		this.buydown = buydown;
            this.product = product
    		this.group_lst = group_lst;
    		this.breakdown_assoc_lst = breakdown_assoc_lst;
    		this.kit_assoc_lst = kit_assoc_lst;
 		}
    	function str_2_float(str){
    		if(str == null){
    			return null;
    		}else{
    			return parseFloat(str);
    		}
    	}    	
    	Store_product.build = function(raw_json){
            var product = null;
            var group_lst = null;
            var breakdown_assoc_lst = null;
            var kit_assoc_lst = null;

    		return new Store_product(
                raw_json.id,
                raw_json.product_id,
                raw_json.store_id,
                raw_json.name,
                str_2_float(raw_json.price),
                str_2_float(raw_json.value_customer_price),
                str_2_float(raw_json.crv),
                raw_json.is_taxable,
                raw_json.is_sale_report,
                raw_json.p_type,
                raw_json.p_tag,
                str_2_float(raw_json.cost),
                raw_json.vendor,
                str_2_float(raw_json.buydown),
                product,
                group_lst,
                breakdown_assoc_lst,
                kit_assoc_lst
            );
    	}
    	return Store_product;
    })
})