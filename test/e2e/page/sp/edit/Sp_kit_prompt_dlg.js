var base_path = './../../../';
var lib = require(base_path + 'lib');

var Sp_kit_dlg = function () {

    //txt
    this.qty_txt = element(by.id('sp_app/service/edit/kit/prompt/qty_txt')); 

    //btn
    this.prompt_sp_btn = element(by.id('sp_app/service/edit/kit/prompt/sp_btn'));
    this.ok_btn = element(by.id('sp_app/service/edit/kit/prompt/ok_btn'));
    this.cancel_btn = element(by.id('sp_app/service/edit/kit/prompt/cancel_btn'));

    //txt function
    this.set_qty = function(qty){ this.qty_txt.clear(); this.qty_txt.sendKeys(qty);}

    //btn function
    this.ok = function(){ lib.click(this.ok_btn); }
    this.cancel = function(){ lib.click(this.cancel_btn); }
    this.prompt_sp = function(){ lib.click(this.prompt_sp_btn); }
}

module.exports = new Sp_kit_dlg();