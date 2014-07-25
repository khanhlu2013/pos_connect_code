define(
[
    'angular'
    //-------
    ,'app/group_app/model'
    ,'app/product_app/model'
]
,function
(
    angular
)
{
    var mod = angular.module('sp_app/model',['group_app/model','product_app/model']);

    //Store_product model
    mod.factory('sp_app/model/Store_product',['$injector',function($injector){
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
            this.product = product;
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
        function _build(raw_json){
            //build group
            var group_lst = null;
            if(raw_json.group_set != undefined){
                var Group = $injector.get('group_app/model/Group');
                group_lst = raw_json.group_set.map(Group.build)
            }

            //build product
            var product = null;
            if(raw_json.product != undefined){
                var Product = $injector.get('product_app/model/Product');
                product = Product.build(raw_json.product);
            }

            //build breakdown assoc list
            var breakdown_assoc_lst = [];
            if(raw_json.breakdown_assoc_lst != undefined && raw_json.breakdown_assoc_lst.length!=0){
                var Kit_breakdown_assoc = $injector.get('sp_app/model/Kit_breakdown_assoc')
                breakdown_assoc_lst = raw_json.breakdown_assoc_lst.map(Kit_breakdown_assoc.build)
            }

            //build kit assoc list
            var kit_assoc_lst = [];
            if(raw_json.kit_assoc_lst != undefined && raw_json.breakdown_assoc_lst.length != 0){
                kit_assoc_lst = raw_json.kit_assoc_lst.map(_build);
            }

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

    	Store_product.build = _build;
    	return Store_product;
    }])

    //Kit_breakdown_assoc
    mod.factory('sp_app/model/Kit_breakdown_assoc',['$injector',function($injector){
        function Kit_breakdown_assoc(id,breakdown,qty){
            this.id = id;
            this.breakdown = breakdown;
            this.qty = qty;
        }
        Kit_breakdown_assoc.build = function(raw_json){
            var Store_product = $injector.get('sp_app/model/Store_product')
            var breakdown = Store_product.build(raw_json.breakdown);

            return new Kit_breakdown_assoc(
                raw_json.id,
                breakdown,
                raw_json.qty
            );
        }
        return Kit_breakdown_assoc;
    }])
})

/*
sp json
{
    "id":272597,
    "product_id":369491,
    "product":
    {
        "prodskuassoc_set":
        [
            {
                "sku_str":"082184083062",
                "store_set":[221],
                "creator_id":null,
                "product_id":369491
            },
            {
                "sku_str":"082184038710",
                "store_set":[],
                "creator_id":null,
                "product_id":369491
            }
        ]
    },
    "store_id":221,
    "name":"Gentleman Jack 375",
    "price":14.99,
    "value_customer_price":null,
    "crv":0,
    "is_taxable":true,
    "is_sale_report":true,
    "p_type":"Liquor",
    "p_tag":null,
    "cost":10.93,
    "vendor":"coles",
    "buydown":null,
    "group_set":[],
    "breakdown_assoc_lst":[],
    "kit_assoc_lst":[]
}
*/