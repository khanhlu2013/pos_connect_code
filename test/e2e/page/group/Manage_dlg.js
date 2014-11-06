var base_path = './../../';
var lib = require(base_path + 'lib');

var Manage_dlg = function () {

    //btn
    this.exit_btn = element(by.id('group_app/service/manage/exit_btn'));
    this.add_btn = element(by.id('group_app/service/manage/add_btn'));

    //table
    this.lst = element.all(by.repeater('group in group_lst'));

    //function btn
    this.exit = function(){ lib.click(this.exit_btn);}
    this.add = function(){ lib.click(this.add_btn);}

    //function table
    this.get_index = function(col_name){
        if(col_name ==='group'){ return 0; }
        else if(col_name ==='execute'){ return 1; }
        else if(col_name ==='remove'){ return 2; }
        else if(col_name ==='edit'){ return 3; }
    }
    this.click_col = function(index,col_name){
        var col_index = this.get_index(col_name);
        lib.click(this.lst.get(index).all(by.tagName('td')).get(col_index));            
    }
}

module.exports = new Manage_dlg();





