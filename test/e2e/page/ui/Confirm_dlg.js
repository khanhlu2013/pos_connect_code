var Confirm_dlg = function () {

    //self
    this.self = element(by.id('service/ui/confirm/dialog'));
    
    //label
    this.message_lbl = element(by.id('service/ui/confirm/message_txt'));

    //btn
    this.ok_btn = element(by.id('service/ui/confirm/ok_btn')); 
    this.cancel_btn = element(by.id('service/ui/confirm/cancel_btn')); 

    //function button
    this.ok = function(is_wait_for_block_ui){ this.ok_btn.click(); }
    this.cancel = function(is_wait_for_block_ui){ this.cancel_btn.click(); }
}

module.exports = new Confirm_dlg();
