var base_path = './../../'
var lib = require(base_path + 'lib');

var Non_inventory_prompt_dlg = function () {

    this.self = element(by.id('sp_app/service/non_inventory_prompt/self'));

    //text box
    this.name_txt = element(by.id('sp_app/service/non_inventory_prompt/name_txt'));
    this.price_txt = element(by.id('sp_app/service/non_inventory_prompt/price_txt'));
    this.crv_txt = element(by.id('sp_app/service/non_inventory_prompt/crv_txt'));
    this.cost_txt = element(by.id('sp_app/service/non_inventory_prompt/cost_txt'));

    //check box
    this.is_taxable_check = element(by.id('sp_app/service/non_inventory_prompt/is_taxable_check'));

    //btn
    this.ok_btn = element(by.id('sp_app/service/non_inventory_prompt/ok_btn'));
    this.cancel_btn = element(by.id('sp_app/service/non_inventory_prompt/cancel_btn'));

    //fill function
    this.set_name = function(name){ this.name_txt.clear(); this.name_txt.sendKeys(name); }
    this.set_price = function(price){ this.price_txt.clear(); this.price_txt.sendKeys(price); }
    this.set_crv = function(crv){ this.crv_txt.clear(); this.crv_txt.sendKeys(crv); }
    this.set_cost = function(cost){ this.cost_txt.clear(); this.cost_txt.sendKeys(cost); }
    this.set_is_taxable = function(is_taxable){
        var is_taxable_check = this.is_taxable_check;
        is_taxable_check.isSelected().then( function(val){ if(is_taxable !== val){ lib.click(is_taxable_check); } } );
    }    

    //get function
    this.get_name = function(){ return this.name_txt.getAttribute('value'); }
    this.get_price = function(){ return this.price_txt.getAttribute('value'); }
    this.get_crv = function(){ return this.crv_txt.getAttribute('value'); }
    this.get_cost = function(){ return this.cost_txt.getAttribute('value'); }
    this.get_is_taxable = function(){ return this.is_taxable_check.isSelected().then(function(str){return JSON.parse(str);}); }

    //button function
    this.ok = function(){ lib.click(this.ok_btn); }
    this.cancel = function(){ lib.click(this.cancel_btn); }
}

module.exports = new Non_inventory_prompt_dlg();
