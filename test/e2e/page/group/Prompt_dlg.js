var base_path = './../../';
var lib = require(base_path + 'lib');

var Prompt_dlg = function () {

    //btn
    this.add_btn = element(by.id('group_app/service/prompt/add_btn'));
    this.ok_btn = element(by.id('group_app/service/prompt/ok_btn'));
    this.cancel_btn = element(by.id('group_app/service/prompt/cancel_btn'));

    //txt
    this.name_txt = element(by.id('group_app/service/prompt/name_txt'));

    //table
    this.lst = element.all(by.repeater('sp in group.sp_lst'));

    //function txt
    this.set_name = function(val){ this.name_txt.clear();this.name_txt.sendKeys(val); }
    this.get_name = function(){ return this.name_txt.getAttribute('value');}

    //function btn
    this.add = function(){ lib.click(this.add_btn); }
    this.ok = function(){ lib.click(this.ok_btn); }
    this.cancel = function(){ lib.click(this.cancel_btn); }
    
    //function table
    this.get_index = function(col_name){
        if(col_name ==='product'){ return 0; }
        else if(col_name ==='remove'){ return 1; }
        else { return null; }
    }
    this.click_col = function(index,col_name){
        var col_index = this.get_index(col_name);
        lib.click(this.lst.get(index).all(by.tagName('td')).get(col_index));
    }
}

module.exports = new Prompt_dlg();






