define(
[
    'angular'
    //---
    ,'app/sp_app/model'
    ,'app/payment_type_app/model'
    ,'app/sale_app/model'
]
,function
(
    angular
)
{
    var mod = angular.module('receipt_app/model',
    [
         'sp_app/model'
        ,'payment_type_app/model'
        ,'sale_app/model'
    ]);

    function str_2_float(str){
        if(str == null){
            return 0.0;
        }else{
            return parseFloat(str);
        }
    }   

    //Receipt model
    mod.factory('receipt_app/model/Receipt',['receipt_app/model/Tender_ln','receipt_app/model/Receipt_ln',function(Tender_ln,Receipt_ln){
        function Receipt(
            id,
            date,
            tax_rate,
            tender_ln_lst,
            receipt_ln_lst,
            receipt_doc_id
        ){
            this.id = id;
            this.date = date;
            this.tax_rate = tax_rate;
            this.tender_ln_lst = tender_ln_lst;
            this.receipt_ln_lst = receipt_ln_lst;
            this.doc_id = receipt_doc_id;
        }

        Receipt.prototype = {
             constructor: Receipt
            ,get_change: function(){
                return this.get_tender() - this.get_otd_price();
            }
            ,get_tender: function(){
                var result = 0.0;
                for(var i = 0;i<this.tender_ln_lst.length;i++){
                    result += this.tender_ln_lst[i].amount;
                }
                return result;
            } 
            ,get_saving: function(){
                var result = 0.0;
                var ln_lst = this.receipt_ln_lst;
                for(var i = 0;i<ln_lst.length;i++){
                    result += (ln_lst[i].get_saving() * ln_lst[i].qty);
                }
                return result;                
            }                
            ,get_genesis_price: function(){
                var result = 0.0;
                var ln_lst = this.receipt_ln_lst;
                for(var i = 0;i<ln_lst.length;i++){
                    result += (ln_lst[i].get_genesis_price() * ln_lst[i].qty);
                }
                return result;                
            } 
            ,get_advertise_price: function(){
                var result = 0.0;
                var ln_lst = this.receipt_ln_lst;
                for(var i = 0;i<ln_lst.length;i++){
                    result += (ln_lst[i].get_advertise_price() * ln_lst[i].qty);
                }
                return result;                
            } 
            ,get_crv: function(){
                var result = 0.0;
                var ln_lst = this.receipt_ln_lst;
                for(var i = 0;i<ln_lst.length;i++){
                    result += (ln_lst[i].get_crv() * ln_lst[i].qty);
                }
                return result;                
            }             
            ,_get_b4_tax_price: function(){
                var result = 0.0;
                var ln_lst = this.receipt_ln_lst;
                for(var i = 0;i<ln_lst.length;i++){
                    result += (ln_lst[i]._get_b4_tax_price() * ln_lst[i].qty);
                }
                return result;                
            } 
            ,get_buydown_tax: function(){
                var result = 0.0;
                var ln_lst = this.receipt_ln_lst;
                for(var i = 0;i<ln_lst.length;i++){
                    result += (ln_lst[i].get_buydown_tax(this.tax_rate) * ln_lst[i].qty);
                }
                return result;                
            }              
            ,get_product_tax: function(){
                var result = 0.0;
                var ln_lst = this.receipt_ln_lst;
                for(var i = 0;i<ln_lst.length;i++){
                    result += (ln_lst[i].get_product_tax(this.tax_rate) * ln_lst[i].qty);
                }
                return result;                
            }            
            ,get_otd_price: function(){
                var result = 0.0;
                var ln_lst = this.receipt_ln_lst;
                for(var i = 0;i<ln_lst.length;i++){
                    result += (ln_lst[i].get_otd_price(this.tax_rate) * ln_lst[i].qty);
                }
                return result;                
            }
        }

        Receipt.build = function(data){
            var receipt_ln_lst = data.receipt_ln_lst.map(Receipt_ln.build);
            var tender_ln_lst = data.tender_ln_lst.map(Tender_ln.build);
            return new Receipt(
                 data.id//id
                ,new Date(data.date)
                ,str_2_float(data.tax_rate)
                ,tender_ln_lst
                ,receipt_ln_lst
                ,null//doc_id
            );
        }        
        return Receipt;
    }]);

    mod.factory('receipt_app/model/Receipt_ln',
    [
         'sp_app/model/Store_product'
        ,'sale_app/model/Non_inventory'
        ,'receipt_app/model/Mix_match_deal_info_stamp'
        ,'receipt_app/model/Store_product_stamp'
    ,function(
         Store_product
        ,Non_inventory
        ,Mix_match_deal_info_stamp
        ,Store_product_stamp
    ){
        function Receipt_ln(
             id
            ,qty
            ,discount
            ,override_price
            ,store_product_stamp
            ,mm_deal_info_stamp
            ,non_inventory
            ,date
        ){
            this.id = id;
            this.qty = qty;
            this.discount = discount;
            this.override_price = override_price;
            this.store_product_stamp = store_product_stamp;
            this.mm_deal_info_stamp = mm_deal_info_stamp;
            this.non_inventory = non_inventory;
            this.date = date;
        }

        Receipt_ln.prototype = {
             constructor:Receipt_ln
            /*
                get_name
                is_non_inventory
                get_preset_price
                get_override_price
                get_genesis_price
                get_mm_deal_info
                get_discount
                get_buydown
                get_saving
                get_advertise_price                
                get_crv                
                _get_b4_tax_price
                get_buydown_tax
                get_product_tax
                get_otd_price
                get_line_total            
            */
            ,get_name:function(){
                if(this.is_non_inventory()) { return this.non_inventory.name; }
                else                        { return this.store_product_stamp.name }
            }
            ,is_non_inventory:function(){ return this.store_product_stamp === null; }
            ,get_preset_price:function(){
                if(this.is_non_inventory())     { return this.non_inventory.price; }
                else                            { return this.store_product_stamp.price; }
            }
            ,get_override_price:function(){ return this.override_price; }
            ,get_genesis_price : function(){
                if(this.override_price !== null)    { return this.override_price; }
                else                                { return this.get_preset_price(); }
            }            
            ,get_mm_deal_info:function(){ return this.mm_deal_info_stamp; }
            ,get_discount:function(){ return this.discount; }
            ,get_buydown: function(){ 
                if(this.is_non_inventory()) { return 0.0; }
                else                        { return this.store_product_stamp.buydown; }
            }
            ,get_saving: function () {
                var result = 0.0;
                result += this.get_discount();
                result += this.get_buydown();
                if(this.get_mm_deal_info() !== null) { result += this.get_mm_deal_info().get_unit_discount(); }
                return result;
            }            
            ,get_advertise_price: function () { return this.get_genesis_price() - this.get_saving(); }
            ,get_crv: function(){
                if(this.is_non_inventory())     { return 0.0; }
                else                            { return this.store_product_stamp.crv; }
            }   
            ,_get_b4_tax_price: function(){
                return this.get_advertise_price() + this.get_crv();
            }            
            ,get_buydown_tax: function(tax_rate){
                if(
                       this.is_non_inventory()
                    || this.store_product_stamp.is_taxable === false 
                ){ return 0; }
                return this.get_buydown() * tax_rate/100.0
            }
            ,get_product_tax: function(tax_rate){
                if(this.is_non_inventory() || this.store_product_stamp.is_taxable == false){ return 0; }
                return this._get_b4_tax_price()*tax_rate/100.0;
            }   
            ,get_otd_price: function(tax_rate){
                return this._get_b4_tax_price() + this.get_product_tax(tax_rate) + this.get_buydown_tax(tax_rate);
            }        
            ,get_line_total: function(tax_rate){
                var result =  this.get_otd_price(tax_rate) * this.qty;
                return result;
            }                            
        }

        Receipt_ln.build = function(data){
            var non_inventory = null;
            if( data.non_inventory_name !== null && data.non_inventory_price !== null ){
                non_inventory = new Non_inventory(
                     data.non_inventory_name
                    ,str_2_float(data.non_inventory_price)
                );
            }

            var store_product_stamp = null;
            if(data.sp_stamp_name !== null ){
                store_product_stamp = new Store_product_stamp(
                     null//sp_id
                    ,null//doc_id
                    ,null//offline_create_sku
                    ,data.sp_stamp_name
                    ,str_2_float(data.sp_stamp_price)
                    ,str_2_float(data.sp_stamp_value_customer_price)
                    ,str_2_float(data.sp_stamp_crv)
                    ,data.sp_stamp_is_taxable
                    ,data.sp_stamp_is_sale_report
                    ,data.sp_stamp_p_type
                    ,data.sp_stamp_p_tag 
                    ,str_2_float(data.sp_stamp_cost)
                    ,data.sp_stamp_vendor
                    ,str_2_float(data.sp_stamp_buydown)
                );
            }   

            var mm_deal_info_stamp = null;
            if(data.mm_deal_name !== null ){
                mm_deal_info_stamp = new Mix_match_deal_info_stamp(
                     data.mm_deal_name
                    ,str_2_float(data.mm_deal_discount)
                );
            }            

            return new Receipt_ln(
                 data.id
                ,str_2_float(data.qty)
                ,str_2_float(data.discount)
                ,data.override_price === null ? null : str_2_float(data.override_price)
                ,store_product_stamp
                ,mm_deal_info_stamp
                ,non_inventory
                ,new Date(data.date)
            );
        }
        return Receipt_ln;
    }])

    mod.factory('receipt_app/model/Tender_ln',['payment_type_app/model/Payment_type',function(Payment_type){
        function Tender_ln(
            id,
            pt,
            amount,
            name
        ){
            this.id = id;
            this.pt = pt;
            this.amount = amount;
            this.name = name;
        }
        Tender_ln.build = function(data){
            var pt = null;
            if(data.payment_type !== null){ pt = Payment_type.build(data.payment_type) }
            return new Tender_ln(
                 data.id
                ,pt
                ,str_2_float(data.amount)
                ,data.name
            );
        }
        return Tender_ln;
    }]);

    mod.factory('receipt_app/model/Mix_match_deal_info_stamp',[function(){
        function Mix_match_deal_info_stamp(
             name
            ,unit_discount
        ){
            this.name = name;
            this.unit_discount = unit_discount;
        }
        Mix_match_deal_info_stamp.prototype = {
             constructor : Mix_match_deal_info_stamp
            ,get_name:function(){ return this.name; }
            ,get_unit_discount : function(){ return this.unit_discount; }
        }
        return Mix_match_deal_info_stamp;
    }]);

    mod.factory('receipt_app/model/Store_product_stamp',[function(){
        function Store_product_stamp(
             sp_id
            ,doc_id
            ,offline_create_sku
            ,name
            ,price
            ,value_customer_price
            ,crv
            ,is_taxable
            ,is_sale_report
            ,p_type
            ,p_tag
            ,cost
            ,vendor
            ,buydown
        ){
            this.sp_id = sp_id;
            this.doc_id = doc_id;
            this.offline_create_sku = offline_create_sku;
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
        }
        return Store_product_stamp;
    }]);
})
