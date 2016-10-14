var base_path = './../../';
var lib = require(base_path + 'lib');

var _3_option_dlg = function () {

    //self
    this.self = element(by.id('service/ui/_3_option/dialog'));
    
    this._1_btn = element(by.id('service/ui/_3_option/_1_btn'));
    this._2_btn = element(by.id('service/ui/_3_option/_2_btn'));
    this._3_btn = element(by.id('service/ui/_3_option/_3_btn'));
}

module.exports = new _3_option_dlg();
