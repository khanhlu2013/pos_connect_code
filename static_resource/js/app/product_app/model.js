define(
[
    'angular'
    //---
]
,function
(
    angular
)
{
    //PRODUCT APP MODEL
    var mod = angular.module('product_app/model',[]);

    //Product
    mod.factory('product_app/model/Product',['product_app/model/Prod_sku_assoc',function(Prod_sku_assoc){
    	function Product(product_id,name,sp_lst,prod_sku_assoc_lst){
    		this.product_id = product_id;
    		this.name = name;
    		this.sp_lst = sp_lst;
    		this.prod_sku_assoc_lst = prod_sku_assoc_lst;
    	}
    	Product.build = function(raw_json){
            //buid sp_lst: todo
    		var sp_lst = null;

            //build prod_sku_assoc
    		var prod_sku_assoc_lst = null;
            if(raw_json.prodskuassoc_set!=undefined){
                prod_sku_assoc_lst = raw_json.prodskuassoc_set.map(Prod_sku_assoc.build);
            }

            //actual build
    		return new Product(
    			 raw_json.product_id
    			,raw_json.name
    			,sp_lst
    			,prod_sku_assoc_lst
			)
    	}
        return Product;
    }])

    //Prod_sku_assoc
    mod.factory('product_app/model/Prod_sku_assoc',[function(){
        function Prod_sku_assoc(product_id,creator_id,store_lst,sku_str){
            this.product_id = product_id;
            this.creator_id = creator_id;
            this.store_lst = store_lst;
            this.sku_str = sku_str;
        }
        Prod_sku_assoc.build = function(raw_json){
            return new Prod_sku_assoc(
                 raw_json.product_id
                ,raw_json.creator_id
                ,raw_json.store_set
                ,raw_json.sku_str
            );
        }
        return Prod_sku_assoc;
    }])
})





























