var lib = require('./../../../lib');

var Multiple_dlg = function () {

    //txt
    this.search_txt = element(by.id('sp_app/service/search_dlg/multiple/search_txt'));

    //table
    this.lst = element.all(by.repeater('sp_multiple in sp_lst'));

    //btn
    this.ok_btn = element(by.id('sp_app/service/search_dlg/multiple/ok_btn'));

    //function btn
    this.ok = function(){ lib.click(this.ok_btn); }

    //function txt
    this.search = function(str){
        this.search_txt.clear();
        this.search_txt.sendKeys(str,protractor.Key.ENTER);
    }

    //function table
    this.get_index = function(col_name){
        if(col_name === 'name'){ return 0;}
        else if(col_name === 'price'){ return 1;}
        else if(col_name === 'select'){ return 2;}
        else { return null; }
    }
    this.click_col = function(index,col_name){
        var col_index = this.get_index(col_name);
        lib.click(this.lst.get(index).all(by.tagName('td')).get(col_index));
    }
}

module.exports = new Multiple_dlg();


