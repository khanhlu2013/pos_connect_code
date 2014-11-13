var base_path = './../../';
var lib = require(base_path + 'lib');

var Prompt_dlg = function () {

    //txt
    this.name_txt = element(by.id('mix_match_app/service/prompt/name_txt'));
    this.qty_txt = element(by.id('mix_match_app/service/prompt/qty_txt'));
    this.price_txt = element(by.id('mix_match_app/service/prompt/price_txt'));
    this.is_include_crv_tax_check = element(by.id('mix_match_app/service/prompt/is_include_crv_tax_check'));
    this.is_disable_check = element(by.id('mix_match_app/service/prompt/is_disable_check'));

    //btn 
    this.ok_btn = element(by.id('mix_match_app/service/prompt/ok_btn'));
    this.cancel_btn = element(by.id('mix_match_app/service/prompt/cancel_btn'));
    this.add_btn = element(by.id('mix_match_app/service/prompt/add_sp_btn'));

    //table
    this.lst = element.all(by.repeater('sp in mm.sp_lst'));

    //function btn
    this.add = function(){ lib.click(this.add_btn); }
    this.ok = function(){ 
        lib.click(this.ok_btn); 
    }
    this.cancel = function(){ lib.click(this.cancel_btn); }

    //function txt
    this.set_name = function(val){ this.name_txt.clear(); this.name_txt.sendKeys(val); }
    this.set_qty = function(val){ this.qty_txt.clear(); this.qty_txt.sendKeys(val); }
    this.set_price = function(val){ this.price_txt.clear(); this.price_txt.sendKeys(val); }
    this.set_is_include_crv_tax = function(set_val){
        var is_include_crv_tax_check = this.is_include_crv_tax_check;
        is_include_crv_tax_check.isSelected().then( function(val){ if(set_val !== val){ lib.click(is_include_crv_tax_check); } } );
    }
    this.set_is_disable = function(set_val){
        var is_disable_check = this.is_disable_check;
        is_disable_check.isSelected().then( function(val){ if(set_val !== val){ lib.click(is_disable_check); } } );
    }    
    this.get_name = function(){ return this.name_txt.getAttribute('value'); }
    this.get_qty = function(){ return this.qty_txt.getAttribute('value'); }
    this.get_price = function(){ return this.price_txt.getAttribute('value'); }
    this.get_is_include_crv_tax = function(){ return this.is_include_crv_tax_check.isSelected(); }

    //function table
    this.get_index = function(col_name){
        if(col_name === 'product'){ return 0; }
        else if(col_name ==='price'){ return 1; }
        else if(col_name === 'remove'){ return 2; }
    }
    this.get_col = function(index,col_name){
        var col_index = this.get_index(col_name);
        return this.lst.get(index).all(by.tagName('td')).get(col_index).getText();
    }
    this.click_col = function(index,col_name){
        var col_index = this.get_index(col_name);
        lib.click(this.lst.get(index).all(by.tagName('td')).get(col_index));
    }
}

module.exports = new Prompt_dlg();