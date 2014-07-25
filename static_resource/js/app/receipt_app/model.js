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
    var mod = angular.module('receipt_app/model',['sp_app/model']);

    //Receipt model
    mod.factory('receipt_app/model/Receipt',['receipt_app/model/Tender_ln','receipt_app/model/Receipt_ln',function(Tender_ln,Receipt_ln){
    	function Receipt(
    		id,
    		date,
    		tax_rate,
    		tender_ln_lst,
    		receipt_ln_lst
    	){
    		this.id = id;
    		this.date = date;
    		this.tax_rate = tax_rate;
    		this.tender_ln_lst = tender_ln_lst;
    		this.receipt_ln_lst = receipt_ln_lst
    	}

        Receipt.prototype = {
             constructor: Receipt
            ,get_total: function(){
                var result = 0.0;
                var ln_lst = this.receipt_ln_lst;
                for(var i = 0;i<ln_lst.length;i++){
                    result += ln_lst[i].get_line_total(this.tax_rate);
                }
                return result;
            }
        }

    	Receipt.build = function(raw_json){
            var tender_ln_lst = raw_json.tender_ln_set.map(Tender_ln.build);
            var receipt_ln_lst = raw_json.receipt_ln_set.map(Receipt_ln.build);

            return new Receipt(
                raw_json.id,
                new Date(raw_json.time_stamp),
                parseFloat(raw_json.tax_rate),
                tender_ln_lst,
                receipt_ln_lst
            )
    	}
    	return Receipt;
    }]);

    mod.factory('receipt_app/model/Receipt_ln',['sp_app/model/Store_product',function(Store_product){
        function Receipt_ln(
            id,
            qty,
            store_product,
            price,
            crv,
            discount,
            discount_mm_deal,
            non_product_name,
            is_taxable,
            p_type,
            p_tag,
            cost,
            buydown
        ){
            this.id = id;
            this.qty = qty;
            this.store_product = store_product;
            this.price = price;
            this.crv = crv;
            this.discount = discount;
            this.discount_mm_deal = discount_mm_deal;
            this.non_product_name = non_product_name;
            this.is_taxable = is_taxable;
            this.p_type = p_type;
            this.p_tag = p_tag;
            this.cost = cost;
            this.buydown = buydown;
        }

        Receipt_ln.prototype = {
             constructor:Receipt_ln
            ,get_total_discount: function(){
                return this.discount + this.discount_mm_deal + this.buydown;
            } 
            ,get_total_discount_price: function(){
                return this.price - this.get_total_discount();
            }
            ,get_otd_wot_price: function(){
                return this.get_total_discount_price() + this.crv;
            }        
            ,get_buydown_tax: function(tax_rate){
                if(!this.is_taxable){
                    return 0;
                }
                return this.buydown * tax_rate/100.0
            }        
            ,get_tax: function(tax_rate){
                if(!this.is_taxable){
                    return 0;
                }
                return this.get_otd_wot_price()*tax_rate/100.0;
            }        
            ,get_otd_wt_price: function(tax_rate){
                return this.get_otd_wot_price() + this.get_tax(tax_rate) + this.get_buydown_tax(tax_rate);
            } 
            ,get_line_total: function(tax_rate){
                return  this.get_otd_wt_price(tax_rate) * this.qty;
            }               
        }
        function str_2_float(str){
            if(str == null){
                return 0.0;
            }else{
                return parseFloat(str);
            }
        }
        Receipt_ln.build = function(raw_json){
            var store_product = Store_product.build(raw_json.store_product);
            return new Receipt_ln(
                raw_json.id,
                raw_json.qty,
                store_product,
                str_2_float(raw_json.price),
                str_2_float(raw_json.crv),
                str_2_float(raw_json.discount),
                str_2_float(raw_json.discount_mm_deal),
                raw_json.non_product_name,
                raw_json.is_taxable,
                raw_json.p_type,
                raw_json.p_tag,
                str_2_float(raw_json.cost),
                str_2_float(raw_json.buydown)
            );
        }
        return Receipt_ln;
    }])

    mod.factory('receipt_app/model/Tender_ln',[function(){
        function Tender_ln(
            id,
            amount,
            name
        ){
            this.id = id;
            this.amount = amount;
            this.name = name;
        }
        Tender_ln.build = function(raw_json){
            return new Tender_ln(
                raw_json.id,
                parseFloat(raw_json.amount),
                raw_json.name
            )
        }
        return Tender_ln;
    }]);
})



/*

{
    "id":23,
    "time_stamp":"2014-07-22T19:09:21.450Z",
    "tax_rate":"32.0530",
    "tender_ln_set":[{"id":16,"amount":"1.00","name":null}],
    "receipt_ln_set":
    [
        {
            "id":24,
            "qty":1,
            "store_product":
            {
                "id":281530,
                "product_id":381276,
                "store_id":223,
                "name":"11111",
                "price":"1.00",
                "value_customer_price":null,
                "crv":"0.000",
                "is_taxable":false,
                "is_sale_report":true,
                "p_type":null,
                "p_tag":null,
                "cost":"141.44",
                "vendor":null,
                "buydown":null,
                "breakdown_assoc_lst":[],
                "kit_assoc_lst":[]
            },
            "price":"1.00",
            "crv":"0.000",
            "discount":null,
            "discount_mm_deal":"0.00",
            "non_product_name":null,
            "is_taxable":false,
            "p_type":null,
            "p_tag":null,
            "cost":"141.44",
            "buydown":null
        }
    ]
}

*/