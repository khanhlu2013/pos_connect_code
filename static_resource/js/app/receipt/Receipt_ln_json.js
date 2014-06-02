define(
    [
         'constance'
        ,'app/sale/displaying_scan/displaying_scan_util'
        ,'lib/number/number'
    ]
    ,function
    (
         constance
        ,ds_util
        ,number
    )
{
    function Receipt_ln_json(receipt_ln_json){
        var ln = receipt_ln_json;

        this.qty = ln.qty;
        this.store_product = ln.store_product;
        this.price = number.str_2_float(ln.price);
        this.crv = number.str_2_float(ln.crv);
        this.discount = number.str_2_float(ln.discount);
        this.discount_mm_deal = number.str_2_float(ln.discount_mm_deal);
        this.non_product_name = ln.non_product_name;
        this.is_taxable = ln.is_taxable;
        this.p_type = ln.p_type;
        this.p_tag = ln.p_tag;
        this.cost = number.str_2_float(ln.cost);
        this.buydown = number.str_2_float(ln.buydown);
    }
    
    Receipt_ln_json.prototype = {
         constructor:Receipt_ln_json
        ,get_total_discount: function(){
            return this.discount_mm_deal + this.discount_mm_deal + this.buydown;
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
            var result = this.buydown * tax_rate/100.0
            return number.round_2_decimal(result);
        }        
        ,get_tax: function(tax_rate){
            if(!this.is_taxable){
                return 0;
            }
            var result = this.get_otd_wot_price()*tax_rate/100.0;
            return number.round_2_decimal(result);
        }        
        ,get_otd_wt_price: function(tax_rate){
            return this.get_otd_wot_price() + this.get_tax(tax_rate) + this.get_buydown_tax(tax_rate);
        } 
        ,get_line_total: function(tax_rate){
            var result =  this.get_otd_wt_price(tax_rate) * this.qty;
            return number.round_2_decimal(result);
        }               
    }

    return Receipt_ln_json;
});