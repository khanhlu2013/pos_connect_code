var base_path = './../../';
var lib = require(base_path + 'lib');

var Confirm_dlg = function () {

    //self
    this.self = element(by.id('service/ui/confirm/dialog'));
    
    //label
    this.message_lbl = element(by.id('service/ui/confirm/message_txt'));

    //btn
    this.ok_btn = element(by.id('service/ui/confirm/ok_btn')); 
    this.cancel_btn = element(by.id('service/ui/confirm/cancel_btn')); 

    //function button
    this.ok = function(){ lib.click(this.ok_btn); }
    this.cancel = function(){ lib.click(this.cancel_btn); }
}

module.exports = new Confirm_dlg();
