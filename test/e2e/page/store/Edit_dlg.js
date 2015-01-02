var base_path = './../../'
var lib = require(base_path + 'lib');

var Store_edit_dlg = function () {

    this.is_profit_information_exchange_check = element(by.id('store/edit/is_profit_information_exchange_check'));
    this.ok_btn = element(by.id('store/edit/ok_btn'));
    this.cancel_btn = element(by.id('store/edit/cancel_btn'));

    //btn function
    this.ok = function(){ lib.click(this.ok_btn); }
    this.cancel = function(){ lib.click(this.cancel_btn); }
}

module.exports = new Store_edit_dlg();



