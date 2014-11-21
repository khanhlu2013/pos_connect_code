var lib = require('./../../../lib');

var Select_sp_dlg = function () {

    this.self = element(by.id('sp_app/service/suggest/select_sp_dlg'));

    //table
    this.lst = element.all(by.repeater("sp in my_sp_lst"));

    //btn
    this.create_new_product_btn = element(by.id('sp_app/service/suggest/select_sp_dlg/create_new_product_btn'));
    this.select_product_btn = element(by.id('sp_app/service/suggest/select_sp_dlg/select_product_btn'));

    //function table
    this.get_index = function(col_name){
        if(col_name === 'name'){ return 0;}
        else if(col_name === 'price'){ return 1;}
        else if(col_name === 'tax'){ return 2;}
        else if(col_name === 'crv'){ return 3;}
        else if(col_name === 'cost'){ return 4;}
        else if(col_name === 'buydown'){ return 5;}
        else if(col_name === 'add'){ return 6;}        
        else { return null; }
    }
    this.click_col = function(index,col_name){
        var col_index = this.get_index(col_name);
        lib.click(this.lst.get(index).all(by.tagName('td')).get(col_index));
    }

    //function btn
    this.create_new_product = function(){
        lib.click(this.create_new_product_btn);
    }
    this.select_product = function(){
        lib.click(this.select_product_btn);
    }
}

module.exports = new Select_sp_dlg();
