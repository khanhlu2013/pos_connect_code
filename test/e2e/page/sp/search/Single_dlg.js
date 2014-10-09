var lib = require('./../../../lib');

var Single_dlg = function () {
    //txt
    this.search_txt = element(by.id('sp_ll_app/service/search/name_sku_online_dlg/single/search_txt'));

    //table
    this.lst = element.all(by.repeater('search_sp_single in sp_lst'));

    //function txt
    this.search = function(search_str){ this.search_txt.clear(); this.search_txt.sendKeys(search_str,protractor.Key.ENTER); }

    //function index
    this.get_index = function(col_name){
        if(col_name === 'name'){ return 0; }
        else if(col_name === 'price') { return 1; }
        else if(col_name === 'select') { return 2; }
    }

    //function table
    this.click_col = function(index,col_name){
        var col_index = this.get_index(col_name);
        lib.click(this.lst.get(index).all(by.tagName('td')).get(col_index));
    }
}

module.exports = new Single_dlg();