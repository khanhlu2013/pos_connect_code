define(
[
    'angular'
]
,function
(
    angular
)
{
    var mod = angular.module('sale_app/model',[]);
    mod.factory('sale_app/model/Pending_scan',[function(){
        //CONSTRUCTOR
        function Pending_scan(
             sp_doc_id
            ,non_product_name
            ,qty
            ,override_price
            ,discount
        ){
            this.sp_doc_id = sp_doc_id;
            this.non_product_name = non_product_name;
            this.qty = qty;
            this.override_price = override_price;
            this.discount = discount;
        }

        return Pending_scan;
    }])

    mod.factory('sale_app/model/Modify_ds_instruction',[function(){
        //CONSTRUCTOR
        function Modify_ds_instruction(
             is_delete
            ,new_qty
            ,new_price
            ,new_discount
        ){
            this.is_delete = is_delete;
            this.new_qty = new_qty;
            this.new_price = new_price;
            this.new_discount = new_discount;            
        }
        return Modify_ds_instruction;
    }])    

    mod.factory('sale_app/model/Displaying_scan',[function(){
        //CONSTRUCTOR
        function Displaying_scan(
             store_product
            ,non_product_name
            ,qty
            ,override_price
            ,discount
            ,mm_deal_info
        ){
            this.store_product = store_product;
            this.non_product_name = non_product_name;
            this.qty = qty;
            this.override_price = override_price;
            this.discount = discount;
            this.mm_deal_info = mm_deal_info;
        }
        Displaying_scan.prototype = {
             constructor:Displaying_scan
            ,get_name:function(){
                if(this.store_product==null){ return this.non_product_name; }
                else{ return this.store_product.name }
            }
            ,get_total_discount: function (tax_rate) {
                var result = 0.0;
                if(this.discount){
                    result += this.discount;
                }
                if(this.mm_deal_info){
                    result += this.mm_deal_info.get_unit_discount(tax_rate);
                }
                result += this.store_product.get_buydown()
                return result
            }             
            ,get_regular_price : function(){
                if(this.store_product == null){
                    return this.override_price;
                }else if(this.override_price!=null){
                    return this.override_price;
                }else{
                    return this.store_product.price;
                }
            }
            ,get_total_discount_price: function (tax_rate) {
                return this.get_regular_price() - this.get_total_discount(tax_rate);
            }            
            ,get_otd_wot_price: function(tax_rate){
                return this.get_total_discount_price(tax_rate) + this.store_product.get_crv();
            }            
            ,get_buydown_tax: function(tax_rate){
                if(
                       this.store_product == null 
                    || this.store_product.is_taxable == false 
                    || this.store_product.get_buydown() == null
                ){
                    return 0;
                }
                return this.store_product.get_buydown() * tax_rate/100.0
            }
            ,get_tax: function(tax_rate){
                if(this.store_product == null || this.store_product.is_taxable == false){
                    return 0;
                }
                return this.get_otd_wot_price(tax_rate)*tax_rate/100.0;
            }   
            ,get_otd_wt_price: function(tax_rate){
                return this.get_otd_wot_price(tax_rate) + this.get_tax(tax_rate) + this.get_buydown_tax(tax_rate);
            }        
            ,get_line_total: function(tax_rate){
                var result =  this.get_otd_wt_price(tax_rate) * this.qty;
                return result;
            }                         
        }
        return Displaying_scan;
    }])    

    mod.factory('sale_app/model/Mix_match_deal_info',[function(){
        //CONSTRUCTOR
        function Mix_match_deal_info(
             mm_deal
            ,formation_ds_lst
        ){
            this.mm_deal = mm_deal;
            this.formation_ds_lst = formation_ds_lst;
        }
        Mix_match_deal_info.prototype = {
             constructor:Mix_match_deal_info
            ,is_deal_taxable: function(){
                var is_taxable = false;
                for(var i = 0;i<this.formation_ds_lst.length;i++){
                    if(this.formation_ds_lst[i].store_product.is_taxable){
                        is_taxable = true;
                        break;
                    }
                }     
                return is_taxable           
            } 
            ,get_unit_discount: function(tax_rate){
                if(this.mm_deal.is_include_crv_tax){
                    //CALCULATE TOTAL REGULAR PRICE: 
                    var total_reg_price = 0.0;
                    for(var i = 0;i<this.formation_ds_lst.length;i++){
                        var ds = this.formation_ds_lst[i];
                        total_reg_price += (ds.get_regular_price() + ds.store_product.get_crv())//we DO include crv here
                    }

                    //UNIT DISCOUNT
                    var result =  
                        (total_reg_price / this.mm_deal.qty)
                        -
                        (100.0 * this.mm_deal.mm_price) / ((100.0 + (this.is_deal_taxable()? tax_rate : 0.0) ) * this.mm_deal.qty)
                    ;
                    return result;
                }else{
                    //CALCULATE TOTAL REGULAR PRICE: 
                    var total_reg_price = 0.0;
                    for(var i = 0;i<this.formation_ds_lst.length;i++){
                        var ds = this.formation_ds_lst[i];
                        total_reg_price += ds.get_regular_price();//we NOT include crv here
                    }   

                    return (total_reg_price - this.mm_deal.mm_price) / this.mm_deal.qty;      
                }
            } 
        }
        return Mix_match_deal_info;
    }])        
})