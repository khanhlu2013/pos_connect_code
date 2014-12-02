var base_path = './../../../';
var lib = require(base_path +'lib');

var Select_product_confirm_dlg = function () {

    this.self = element(by.id('sp_app/service/suggest/select_product_confirm_dlg'));

    //btn
    this.ok_btn = element(by.id('sp_app/service/suggest/select_product_confirm_dlg/ok_btn'));

    //btn function
    this.ok = function(){
        lib.click(this.ok_btn);
    }
}

module.exports = new Select_product_confirm_dlg();