define(['lib/number/number'],function(number){

	function Displaying_scan(qty,store_product,price,discount,non_product_name){
		//this object is use for display purpose and not persistable. there is no id.
		this.qty = qty;
		this.store_product = store_product;
		this.price = price;
		this.discount = discount;
        this.non_product_name = non_product_name;
	};
    
	Displaying_scan.prototype = {
    	 constructor: Displaying_scan
        ,get_name: function(){
            if(this.store_product == null){
                return this.non_product_name;
            }else{
                return this.store_product.name;
            }
        }
    	,get_total_discount: function () {
            if(this.discount == null || this.discount == undefined){
                return 0;
            }
            return this.discount;
        }
        ,get_discount_price: function () {
            if(this.price == null || this.price == undefined){
                return null;
            }
            return this.price - this.get_total_discount();
        }
        ,get_crv: function(){
            if(this.store_product == null){
                return 0;
            }else if(this.store_product.crv == null || this.store_product.crv == undefined){
                return 0;
            }else{
                return this.store_product.crv;
            }
        }
        ,get_discount_price_and_crv: function(){
            if(this.get_discount_price() == null){
                return null;
            }
            return this.get_discount_price() + this.get_crv();
        }
        ,get_tax: function(tax_rate){
            if(this.store_product == null || this.store_product.is_taxable == false){
                return 0;
            }

            if(tax_rate == null || tax_rate == undefined){
                return null;
            }

            if(this.get_discount_price_and_crv() == null){
                return null;
            }
            var tax = this.get_discount_price_and_crv()*tax_rate/100;
            return number.round_2_decimal(tax);
        }
        ,get_out_the_door_price: function(tax_rate){
            if(this.get_discount_price_and_crv() == null){
                return null;
            }

            if(this.get_tax(tax_rate) == null){
                return null;
            }

            return this.get_discount_price_and_crv() + this.get_tax(tax_rate);
        }
        ,get_line_total: function(tax_rate){
            if(this.get_out_the_door_price(tax_rate) == null){
                return null;
            }

            return this.get_out_the_door_price(tax_rate) * this.qty;
        }
    };

    return Displaying_scan;
});