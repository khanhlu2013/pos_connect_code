var base_path = './../../../';
var lib = require(base_path + 'lib');

var Sp_sku_dlg = function () {

    //btn
    this.add_btn = element(by.id('sp_app/service/edit/sku/add_btn'));
    this.exit_btn = element(by.id('sp_app/service/edit/sku/exit_btn'));

    //table
    this.lst = element.all(by.repeater('sku_assoc in sp.get_my_sku_assoc_lst() | orderBy:\'sku\''))

    this.get_col_index = function(col_name){
        if(col_name === 'sku')          { return 0; }
        else if(col_name === 'remove')  { return 1; }
        else                            { return null; }        
    }

    //function
    this.exit = function(){ lib.click(this.exit_btn); }
    this.add = function(){ this.add_btn.click(); }

    this.click_col = function(index,col_name){
        var col_index = this.get_col_index(col_name);
        this.lst.get(index).all(by.tagName('td')).get(col_index).click();
    }
    this.get_col = function(index,col_name){
        var col_index = this.get_col_index(col_name);
        return this.lst.get(index).all(by.tagName('td')).get(col_index).getText();
    }
}

module.exports = new Sp_sku_dlg();