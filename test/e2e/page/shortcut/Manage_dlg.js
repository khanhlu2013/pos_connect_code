var base_path = './../../';
var lib = require(base_path + 'lib');

var Setup_dlg = function () {
    //btn
    this.exit_btn = element(by.id('shortcut_app/service/manage/exit_btn'));

    //table
    this.lst = element.all(by.repeater('row_setup in row_lst'));

    //function btn
    this.exit = function(){lib.click(this.exit_btn);}
}   

module.exports = new Setup_dlg();
