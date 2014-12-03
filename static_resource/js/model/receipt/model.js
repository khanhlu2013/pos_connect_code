define(
[
    'angular'
    //---
    ,'model/sp/model'
    ,'model/payment_type/model'
    ,'app/sale_app/model'
    ,'service/misc'
]
,function
(
    angular
)
{
    var mod = angular.module('receipt/model',
    [
         'sp/model'
        ,'payment_type/model'
        ,'sale_app/model'
        ,'service/misc'
    ]);

    function str_2_float(str){
        if(str == null){
            return 0.0;
        }else{
            return parseFloat(str);
        }
    }   

    //Receipt model
    mod.factory('receipt/model/Receipt',
    [
         'receipt/model/Tender_ln'
        ,'receipt/model/Receipt_ln'
    ,function(
         Tender_ln
        ,Receipt_ln
    ){
        function Receipt(
            id,
            date,
            tax_rate,
            tender_ln_lst,
            receipt_ln_lst,
            receipt_doc_id,
            receipt_doc_rev
        ){
            this.id = id;
            this.date = date;
            this.tax_rate = tax_rate;
            this.tender_ln_lst = tender_ln_lst;
            this.receipt_ln_lst = receipt_ln_lst;
            this.doc_id = receipt_doc_id;
            this.doc_rev = receipt_doc_rev;
        }

        Receipt.prototype = {
             constructor: Receipt
            ,is_reside_offline: function(){
                return this.id === null;
            }
            ,get_total_non_cash_payment_type: function(){
                var amount = 0.0;
                for(var i = 0;i<this.tender_ln_lst.length;i++){
                    if(this.tender_ln_lst[i].pt !== null){
                        amount += this.tender_ln_lst[i].amount;
                    }
                }
                return amount;
            }
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
                ,data._receipt_doc_id
                ,null//doc_rev
            );
        }        
        return Receipt;
    }]);

    mod.factory('receipt/model/Receipt_ln',
    [
         'sp/model/Store_product'
        ,'sp/model/Non_inventory'
        ,'receipt/model/Mix_match_deal_info_stamp'
        ,'receipt/model/Store_product_stamp'
        ,'service/misc'
    ,function(
         Store_product
        ,Non_inventory
        ,Mix_match_deal_info_stamp
        ,Store_product_stamp
        ,misc_service
    ){
        function Receipt_ln(
             id
            ,qty
            ,discount
            ,override_price
            ,store_product
            ,store_product_stamp
            ,mm_deal_info_stamp
            ,non_inventory
            ,date
        ){
            if(
                //we receipt is created from online data, store_product and store_product_stamp integrity is check here.
                id !== null
                &&
                (
                    (store_product === null && store_product_stamp !== null)
                    ||
                    (store_product !== null && store_product_stamp === null)
                )
            ){
                alert('Receipt_ln model constructor raise error: store product information is not consistance');
            }
            this.id = id;
            this.qty = qty;
            this.discount = discount;
            this.override_price = override_price;
            this.store_product = store_product
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
                if(this.is_non_inventory()){ 
                    return this.non_inventory.name; 
                }
                else{
                    return this.store_product_stamp.name;
                }
            }
            ,is_non_inventory:function(){ 
                return this.store_product_stamp === null; 
            }
            ,get_cost:function(){
                if(this.is_non_inventory()){
                    return this.non_inventory.cost;
                }else{
                    return this.store_product_stamp.cost; 
                }                
            }
            ,get_crv: function(){
                if(this.is_non_inventory()){
                    return this.non_inventory.crv; 
                }else{
                    return this.store_product_stamp.crv; 
                }
            }       
            ,get_is_taxable: function(){
                if(this.is_non_inventory()){
                    return this.non_inventory.is_taxable;
                }else{
                    return this.store_product_stamp.is_taxable;
                }
            }            
            ,get_preset_price:function(){
                if(this.is_non_inventory()){
                    return this.non_inventory.price; 
                }else{
                    return this.store_product_stamp.price; 
                }
            }
            ,get_override_price:function(){
                return this.override_price; 
            }
            ,get_genesis_price : function(){
                if(this.override_price !== null){
                    return this.override_price; 
                }else{
                    return this.get_preset_price(); 
                }
            }            
            ,get_mm_deal_info:function(){
                return this.mm_deal_info_stamp; 
            }
            ,get_discount:function(){
                return this.discount; 
            }
            ,get_buydown: function(){ 
                if(this.is_non_inventory()){
                    return 0.0; 
                }else{
                    return this.store_product_stamp.buydown; 
                }
            }
            ,get_saving: function () {
                var result = 0.0;
                result += this.get_discount();
                result += this.get_buydown();
                if(this.get_mm_deal_info() !== null){
                    result += this.get_mm_deal_info().get_unit_discount(); 
                }
                return result;
            }            
            ,get_advertise_price: function (){
                return this.get_genesis_price() - this.get_saving(); 
            }
            ,_get_b4_tax_price: function(){
                return this.get_advertise_price() + this.get_crv();
            }            
            ,get_buydown_tax: function(tax_rate){
                var result = 0.0;
                if(this.get_is_taxable()){
                    result = this.get_buydown()*tax_rate/100.0;
                }
                return misc_service.round_float_2_decimal(result);                
            }
            ,get_product_tax: function(tax_rate){
                var result = 0.0;
                if(this.get_is_taxable()){
                    result = this._get_b4_tax_price()*tax_rate/100.0;
                }
                return misc_service.round_float_2_decimal(result);
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
            if( data.non_inventory_name !== null){
                non_inventory = new Non_inventory(
                     data.non_inventory_name
                    ,str_2_float(data.non_inventory_price)
                    ,data.non_inventory_is_taxable
                    ,str_2_float(data.non_inventory_crv)
                    ,str_2_float(data.non_inventory_cost)                            
                );                  
            }
            //build store product
            var store_product = null;
            if(data.store_product!==null){
                store_product = Store_product.build(data.store_product);
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
                ,store_product
                ,store_product_stamp
                ,mm_deal_info_stamp
                ,non_inventory
                ,new Date(data.date)
            );
        }
        return Receipt_ln;
    }])

    mod.factory('receipt/model/Tender_ln',
    [
        'payment_type/model/Payment_type'
    ,function(
        Payment_type
    ){
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

    mod.factory('receipt/model/Mix_match_deal_info_stamp',[function(){
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

    mod.factory('receipt/model/Store_product_stamp',[function(){
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
