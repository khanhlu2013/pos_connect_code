var base_path = './../../'
var lib = require(base_path + 'lib');

var Sp_prompt_dlg = function () {

    //text box
    this.name_txt = element(by.id('sp_app/service/prompt/name_txt'));
    this.price_txt = element(by.id('sp_app/service/prompt/price_txt'));
    this.crv_txt = element(by.id('sp_app/service/prompt/crv_txt'));
    this.cost_txt = element(by.id('sp_app/service/prompt/cost_txt'));
    this.p_type_txt = element(by.id('sp_app/service/prompt/p_type_txt'));
    this.p_tag_txt = element(by.id('sp_app/service/prompt/p_tag_txt'));
    this.vendor_txt = element(by.id('sp_app/service/prompt/vendor_txt'));
    this.buydown_txt = element(by.id('sp_app/service/prompt/buydown_txt'));
    this.value_customer_price_txt = element(by.id('sp_app/service/prompt/value_customer_price_txt'));
    this.sku_txt = element(by.id('sp_app/service/prompt/sku_txt'));

    //suggest div
    this.suggest_name = element(by.id('sp_app/service/prompt/suggest_name'));
    this.suggest_price = element(by.id('sp_app/service/prompt/suggest_price'));
    this.suggest_crv = element(by.id('sp_app/service/prompt/suggest_crv'));
    this.suggest_cost = element(by.id('sp_app/service/prompt/suggest_cost'));
    this.suggest_is_taxable = element(by.id('sp_app/service/prompt/suggest_taxable'));

    //check box
    this.is_taxable_check = element(by.id('sp_app/service/prompt/is_taxable_check'));
    this.is_sale_report_check = element(by.id('sp_app/service/prompt/is_sale_report_check'));

    //btn
    this.ok_btn = element(by.id('sp_app/service/prompt/ok_btn'));
    this.cancel_btn = element(by.id('sp_app/service/prompt/cancel_btn'));

    //fill function
    this.set_name = function(name){ this.name_txt.clear(); this.name_txt.sendKeys(name); }
    this.set_price = function(price){ this.price_txt.clear(); this.price_txt.sendKeys(price); }
    this.set_crv = function(crv){ this.crv_txt.clear(); this.crv_txt.sendKeys(crv); }
    this.set_cost = function(cost){ this.cost_txt.clear(); this.cost_txt.sendKeys(cost); }
    this.set_p_type = function(p_type){ this.p_type_txt.clear(); this.p_type_txt.sendKeys(p_type); }
    this.set_p_tag = function(p_tag){ this.p_tag_txt.clear(); this.p_tag_txt.sendKeys(p_tag); }
    this.set_vendor = function(vendor){ this.vendor_txt.clear(); this.vendor_txt.sendKeys(vendor); }
    this.set_buydown = function(buydown){ this.buydown_txt.clear(); this.buydown_txt.sendKeys(buydown); }
    this.set_value_customer_price = function(val_cus_price){ this.value_customer_price_txt.clear(); this.value_customer_price_txt.sendKeys(val_cus_price); }
    this.set_is_taxable = function(is_taxable){
        var is_taxable_check = this.is_taxable_check;
        is_taxable_check.isSelected().then( function(val){ if(is_taxable !== val){ is_taxable_check.click(); } } );
    }    
    this.set_is_sale_report = function(is_sale_report){
        var is_sale_report_check = this.is_sale_report_check;
        is_sale_report_check.isSelected().then( function(val){ if(is_sale_report !== val){ is_sale_report_check.click(); } } );
    }    

    //get function
    this.get_name = function(){ return this.name_txt.getAttribute('value'); }
    this.get_price = function(){ return this.price_txt.getAttribute('value'); }
    this.get_crv = function(){ return this.crv_txt.getAttribute('value'); }
    this.get_cost = function(){ return this.cost_txt.getAttribute('value'); }
    this.get_p_type = function(){ return this.p_type_txt.getAttribute('value'); }
    this.get_p_tag = function(){ return this.p_tag_txt.getAttribute('value'); }
    this.get_vendor = function(){ return this.vendor_txt.getAttribute('value'); }
    this.get_buydown = function(){ return this.buydown_txt.getAttribute('value'); }
    this.get_value_customer_price = function(){ return this.value_customer_price_txt.getAttribute('value'); }
    this.get_sku = function(){ return this.sku_txt.getAttribute('value'); }
    this.get_is_taxable = function(){ return this.is_taxable_check.isSelected().then(function(str){return JSON.parse(str);}); }
    this.get_is_sale_report = function(){ return this.is_sale_report_check.isSelected().then(function(str){return JSON.parse(str);}); }

    //button function
    this.ok = function(){ lib.click(this.ok_btn); }
    this.cancel = function(){ lib.click(this.cancel_btn); }
}

module.exports = new Sp_prompt_dlg();
