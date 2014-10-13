var base_path = './../../../';
var lib = require(base_path +'lib');

var Multiple_dlg = function () {
    //btn
    this.ok_btn = element(by.id('group_app/service/search_dlg/multiple/ok_btn'));
    this.cancel_btn = element(by.id('group_app/service/search_dlg/multiple/cancel_btn'));

    //table
    this.lst = element.all(by.repeater('group in group_lst | orderBy:\'name\' | filter:query'));

    //function btn
    this.ok = function(){ lib.click(this.ok_btn); }
    this.cancel = function(){ lib.click(this.cancel_btn); }

    //function index
    this.get_index = function(col_name){
        if(col_name === 'group')        { return 0; }
        else if(col_name === 'select')  { return 1; }
        else                            { return null; }
    }

    //function table
    this.click_col = function(index,col_name){
        var col_index = this.get_index(col_name);
        lib.click(this.lst.get(index).all(by.tagName('td')).get(col_index));
    }
}

module.exports = new Multiple_dlg();