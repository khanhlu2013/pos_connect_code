var base_path = './../../';
var lib = require(base_path + 'lib');

var Manage_dlg = function () {

    //btn
    this.exit_btn = element(by.id('payment_type_app/service/manage/exit_btn'));
    this.add_btn = element(by.id('payment_type_app/service/manage/create_btn'));

    //table
    this.lst = element.all(by.repeater('pt_manage in pt_lst | orderBy:\'sort\''));

    //function table
    this.get_index = function(col_name){
        if(col_name === 'payment_type'){ return 0;}
        else if(col_name === 'sort'){ return 1; }
        else if(col_name === 'active'){ return 2; }
        else if(col_name === 'edit'){ return 3; }
    }
    this.click_col = function(index,col_name){
        var col_index = this.get_index(col_name);
        lib.click(this.lst.get(index).all(by.tagName('td')).get(col_index));
    }

    //function btn
    this.exit = function(){ lib.click(this.exit_btn); }
    this.add = function(){ lib.click(this.add_btn); }
}

module.exports = new Manage_dlg();
