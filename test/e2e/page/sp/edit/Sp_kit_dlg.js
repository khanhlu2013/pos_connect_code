var base_path = './../../../';
var lib = require(base_path +'lib');

var Sp_kit_dlg = function () {
    //btn
    this.ok_btn = element(by.id('sp_app/service/edit/kit/ok_btn'));
    this.cancel_btn = element(by.id('sp_app/service/edit/kit/cancel_btn'));
    this.add_btn = element(by.id('sp_app/service/edit/kit/add_btn'));

    //table
    this.lst = element.all(by.repeater('assoc in sp.breakdown_assoc_lst'));

    //function btn
    this.add = function(){ lib.click(this.add_btn); }
    this.ok = function(){ lib.click(this.ok_btn); }
    this.cancel = function(){ lib.click(this.cancel_btn); }

    //function index
    this.get_index = function(col_name){
        if(col_name === 'kit'){ return 0; }
        else if(col_name === 'qty'){ return 1; }
        else if(col_name === 'edit'){ return 2; }
        else if(col_name === 'remove'){ return 3; }
    }

    //function table
    this.click_col = function(index,col_name){
        var col_index = this.get_index(col_name);
        lib.click(this.lst.get(index).all(by.tagName('td')).get(col_index));
    }
}

module.exports = new Sp_kit_dlg();