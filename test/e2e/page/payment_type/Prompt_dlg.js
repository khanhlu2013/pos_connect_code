var base_path = './../../';
var lib = require(base_path + 'lib');

var Prompt_dlg = function () {
    //txt
    this.name_txt = element(by.id('payment_type_app/service/prompt/name_txt'));
    this.sort_txt = element(by.id('payment_type_app/service/prompt/sort_txt'));

    //btn 
    this.ok_btn = element(by.id('payment_type_app/service/prompt/ok_btn'));
    this.cancel_btn = element(by.id('payment_type_app/service/prompt/cancel_btn'));

    //check
    this.is_active_check = element(by.id('payment_type_app/service/prompt/active_check'));

    //function txt
    this.set_name = function(name){ this.name_txt.clear(); this.name_txt.sendKeys(name); }
    this.set_sort = function(sort){ this.sort_txt.clear(); this.sort_txt.sendKeys(sort); }
    this.get_name = function(){ return this.name_txt.getAttribute('value');}
    this.get_sort = function(){ return this.sort_txt.getAttribute('value');}

    //function check
    this.set_is_active = function(is_active){
        var is_active_check = this.is_active_check;
        is_active_check.isSelected().then( function(val){ if(is_active !== val){ is_active_check.click(); } } );        
    }
    this.get_is_active = function(){ return this.is_active_check.isSelected(); }

    //function btn
    this.ok = function(){this.ok_btn.click();}
    this.cancel = function(){this.cancel_btn.click();}
}

module.exports = new Prompt_dlg();