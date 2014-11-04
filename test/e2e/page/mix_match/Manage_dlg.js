var base_path = './../../';
var lib = require(base_path + 'lib');

var Manage_dlg = function () {
    //btn
    this.add_btn = element(by.id('mix_match_app/service/manage/add_btn'));
    this.exit_btn = element(by.id('mix_match_app/service/manage/exit_btn'));

    //table
    this.lst = element.all(by.repeater('mm in mm_lst | orderBy:\'name\''));

    //function btn
    this.add = function(){ lib.click(this.add_btn); }
    this.exit = function(){ lib.click(this.exit_btn); }

    //function table
    this.get_index = function(col_name){
        if(col_name === 'name'){ return 0; }
        else if(col_name === 'qty'){ return 1; }
        else if(col_name === 'price'){ return 2; }
        else if(col_name === 'is_include_crv_tax'){ return 3; }
        else if(col_name === 'is_disable'){ return 4; }
        else if(col_name === 'remove'){ return 5; }
        else if(col_name === 'edit'){ return 6; }
    }
    this.click_col = function(index,col_name){
        var col_index = this.get_index(col_name);
        lib.click(this.lst.get(index).all(by.tagName('td')).get(col_index))
    }
}

module.exports = new Manage_dlg();


