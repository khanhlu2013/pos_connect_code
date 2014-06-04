define(['lib/number/number'],function(number){

    function Displaying_scan(qty,store_product,price,discount,non_product_name){
        //this object is use for display purpose and not persistable. there is no id.
        this.qty = qty;
        this.store_product = store_product;
        this.price = price;
        this.discount = discount;
        this.non_product_name = non_product_name;
        this.mm_deal_info = null;
    };
    
    Displaying_scan.prototype = {
         constructor: Displaying_scan
        ,get_name: function(){
            if(this.store_product == null){
                return this.non_product_name;
            }

            return this.store_product.name;
        }
        ,get_buydown: function(){
            var result = 0.0;
            if(this.store_product != null){
                result = (this.store_product.get_buydown())
            }
            return result;
        }        
        ,get_total_discount: function () {
            var result = 0.0;
            if(this.discount){
                result += this.discount;
            }

            if(this.mm_deal_info){
                result += this.mm_deal_info.unit_discount;
            }

            result += this.get_buydown()

            return result;
        }
        ,get_total_discount_price: function () {
            return this.price - this.get_total_discount();
        }
        ,get_crv: function(){
            var result = 0.0;
            if(this.store_product != null){
                result = (this.store_product.get_crv())
            }
            return result;
        }
        ,get_otd_wot_price: function(){
            return this.get_total_discount_price() + this.get_crv();
        }
        ,get_buydown_tax: function(tax_rate){
            if(this.store_product == null || this.store_product.is_taxable == false){
                return 0;
            }
                        
            var result = this.get_buydown() * tax_rate/100.0
            return number.round_2_decimal(result);
        }
        ,get_tax: function(tax_rate){
            if(this.store_product == null || this.store_product.is_taxable == false){
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
    };

    return Displaying_scan;
});