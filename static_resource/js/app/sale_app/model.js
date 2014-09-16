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
            ,non_inventory
            ,qty
            ,override_price
            ,discount
            ,date
        ){
            this.sp_doc_id = sp_doc_id;
            this.non_inventory = non_inventory;
            this.qty = qty;
            this.override_price = override_price;
            this.discount = discount;
            this.date = date;
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
            ,new_non_product_name
        ){
            this.is_delete = is_delete;
            this.new_qty = new_qty;
            this.new_price = new_price;
            this.new_discount = new_discount;    
            this.new_non_product_name = new_non_product_name;        
        }
        return Modify_ds_instruction;
    }])    

    mod.factory('sale_app/model/Non_inventory',[function(){
        //CONSTRUCTOR
        function Non_inventory(
             name
            ,price
        ){
            this.name = name;
            this.price = price;
        }
        return Non_inventory;
    }]);

    mod.factory('sale_app/model/Displaying_scan',[function(){
        //CONSTRUCTOR
        function Displaying_scan(
             store_product
            ,qty
            ,override_price
            ,discount
            ,mm_deal_info
            ,non_inventory
            ,date
        ){
            this.store_product = store_product;
            this.qty = qty;
            this.override_price = override_price;
            this.discount = discount;
            this.mm_deal_info = mm_deal_info;
            this.non_inventory = non_inventory;
            this.date = date;
        }
        Displaying_scan.prototype = {
             constructor:Displaying_scan
            /*
                get_name
                is_non_inventory
                get_preset_price
                get_override_price
                get_genesis_price
                get_mm_deal_info
                get_discount
                get_buydown
                get_total_discount
                get_advertise_price                
                get_crv                
                _get_b4_tax_price
                get_buydown_tax
                get_product_tax
                get_otd_price
                get_line_total            
            */             
            ,get_name:function(){
                if(this.is_non_inventory())     { return this.non_inventory.name; }
                else                            { return this.store_product.name }
            }             
            ,is_non_inventory:function(){ return this.store_product === null; }            
            ,get_preset_price:function(){
                if(this.is_non_inventory())     { return this.non_inventory.price; }
                else                            { return this.store_product.price; }
            }
            ,get_override_price: function(){ return this.override_price; }
            ,get_genesis_price : function(){
                if(this.override_price !== null)    { return this.override_price; }
                else                                { return this.get_preset_price(); }
            }            
            ,get_mm_deal_info:function(){ return this.mm_deal_info; }
            ,get_discount:function(){ return this.discount; }
            ,get_buydown:function(){
                if(this.is_non_inventory())     { return 0.0; }
                else                            { return this.store_product.get_buydown(); }
            }
            ,get_total_discount: function () {
                var result = 0.0;
                result += this.get_discount();
                result += this.get_buydown();
                if(this.get_mm_deal_info() !== null) { result += this.get_mm_deal_info().get_unit_discount(); }
                return result;
            }             
            ,get_advertise_price: function () { return this.get_genesis_price() - this.get_total_discount(); }
            ,get_crv: function(){
                if(this.is_non_inventory()){ return 0.0; }
                else{ return this.store_product.get_crv(); }
            }
            ,_get_b4_tax_price: function(){ return this.get_advertise_price() + this.get_crv(); }
            ,get_buydown_tax: function(tax_rate){
                if(
                       this.is_non_inventory()
                    || this.store_product.is_taxable === false 
                ){ return 0; }
                return this.store_product.get_buydown() * tax_rate/100.0
            }
            ,get_product_tax: function(tax_rate){
                if(this.is_non_inventory() || this.store_product.is_taxable === false) { return 0; }
                return this._get_b4_tax_price() * tax_rate/100.0;
            }   
            ,get_otd_price: function(tax_rate){ return this._get_b4_tax_price() + this.get_product_tax(tax_rate) + this.get_buydown_tax(tax_rate); }
            ,get_line_total: function(tax_rate){ return this.get_otd_price(tax_rate) * this.qty; }
        }
        return Displaying_scan;
    }]);    

    mod.factory('sale_app/model/Mix_match_deal_info',[function(){
        //CONSTRUCTOR
        function Mix_match_deal_info(
             mm_deal
            ,formation_ds_lst
            ,tax_rate
        ){
            this.mm_deal = mm_deal;
            this.formation_ds_lst = formation_ds_lst;
            this.tax_rate = tax_rate;
        }
        Mix_match_deal_info.prototype = {
             constructor:Mix_match_deal_info
            ,get_name: function(){ return this.mm_deal.name; }
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
            ,get_unit_discount: function(){
                if(this.mm_deal.is_include_crv_tax){
                    //CALCULATE TOTAL REGULAR PRICE: 
                    var total_reg_price = 0.0;
                    for(var i = 0;i<this.formation_ds_lst.length;i++){
                        var ds = this.formation_ds_lst[i];
                        total_reg_price += (ds.get_genesis_price() + ds.store_product.get_crv())//we DO include crv here
                    }

                    //UNIT DISCOUNT
                    var result =  
                        (total_reg_price / this.mm_deal.qty)
                        -
                        (100.0 * this.mm_deal.mm_price) / ((100.0 + (this.is_deal_taxable()? this.tax_rate : 0.0) ) * this.mm_deal.qty)
                    ;
                    return result;
                }else{
                    //CALCULATE TOTAL REGULAR PRICE: 
                    var total_reg_price = 0.0;
                    for(var i = 0;i<this.formation_ds_lst.length;i++){
                        var ds = this.formation_ds_lst[i];
                        total_reg_price += ds.get_genesis_price();//we NOT include crv here
                    }   

                    return (total_reg_price - this.mm_deal.mm_price) / this.mm_deal.qty;      
                }
            } 
        }
        return Mix_match_deal_info;
    }])        
})