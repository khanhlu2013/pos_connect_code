var base_path = './../../';
var lib = require(base_path + 'lib');

var Alert_dlg = function () {

    this.self = element(by.id('service/ui/alert/dialog'));

    //btn
    this.ok_btn = element(by.id('service/ui/alert/ok_btn'));

    //function btn
    this.ok = function(){ lib.click(this.ok_btn); }
}

module.exports = new Alert_dlg();