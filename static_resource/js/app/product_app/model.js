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
    mod.factory('product_app/model/Product',['product_app/model/Prod_sku_assoc','$injector',function(Prod_sku_assoc,$injector){
    	function Product(product_id,name,sp_lst,prod_sku_assoc_lst){
    		this.product_id = product_id;
    		this.name = name;
    		this.sp_lst = sp_lst;
    		this.prod_sku_assoc_lst = prod_sku_assoc_lst;
    	}

        Product.prototype = {
             constructor : Product
            ,get_suggest_main : function(field){
                if(field=='name'){
                    return this.name;
                }
                var result = null;
                var lst = this.get_suggest_extra(field);
                if(lst!=null){
                    if(field == 'price' || field == 'cost'){
                        result = get_median(lst);
                    }else if(field == 'crv' || field == 'is_taxable'){
                        result = get_mode(lst);
                    }                       
                }
                return result;
            }
            ,get_suggest_extra : function(field){
                var lst = [];
                var sp_lst = this.sp_lst;
                for(var i = 0;i<sp_lst.length;i++){
                         if(field == 'price')       {if(sp_lst[i].price!=null)      {lst.push(sp_lst[i].price);}}
                    else if(field == 'cost')        {if(sp_lst[i].get_cost()!=null) {lst.push(sp_lst[i].get_cost());}}
                    else if(field == 'crv')         {if(sp_lst[i].get_crv()!=null)  {lst.push(sp_lst[i].get_crv());}}
                    else if(field == 'is_taxable')                                  {lst.push(sp_lst[i].is_taxable);}
                    else if(field == 'name')                                        {lst.push(sp_lst[i].name);}
                    else                                                            {return null;}
                }
                return lst;
            }
            ,get_tax_suggest_statistic: function(){
                var lst = this.get_suggest_extra('is_taxable');
                var taxable_count = 0;nontaxable_count = 0;
                for(var i = 0;i<lst.length;i++){
                    if(lst[i] == true){
                        taxable_count ++;
                    }else{
                        nontaxable_count ++;
                    }
                }
                tax_percent = Math.round((taxable_count * 100)/ lst.length);
                var taxable_stat = {is_taxable:true, value: tax_percent};
                var nontaxable_stat = {is_taxable:false, value: 100-tax_percent};
                return [taxable_stat,nontaxable_stat];
            }
        }

        function get_mode(array)
        {
            if(array.length == 0)
                return null;
            
            var modeMap = {};
            var maxEl = array[0], maxCount = 1;
            for(var i = 0; i < array.length; i++)
            {
                var el = array[i];
                if(modeMap[el] == null)
                    modeMap[el] = 1;
                else
                    modeMap[el]++;  
                if(modeMap[el] > maxCount)
                {
                    maxEl = el;
                    maxCount = modeMap[el];
                }
            }
            return maxEl;
        }

        function get_median(values) {

            if(values.length == 0){
                return null;
            }

            values.sort( function(a,b) {return a - b;} );
            var half = Math.floor(values.length/2); 
            if (values.length % 2) { return values[half]; } 
            else { return (values[half-1] + values[half]) / 2.0; } 
        } 
    	Product.build = function(raw_json){
            Store_product = $injector.get('sp_app/model/Store_product');
            var sp_lst = null;
            if(raw_json.store_product_set != undefined){
                sp_lst = raw_json.store_product_set.map(Store_product.build);
            }

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





























