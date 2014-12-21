var base_path = './../../'
var lib = require(base_path + 'lib');

var Select_sp_dlg = function () {

    this.self = element(by.id('sp_app/service/non_inventory_prompt/self'));
    
    //table
    this.lst = element.all(by.repeater('sp_to_select in sp_lst|orderBy:\'name\''));

    //btn
    this.exit_btn = element(by.id('sp/service/select/exit_btn'));
        
    //index function
    this.get_index = function(col_name){
        if(col_name === 'product')                      { return 0; }
        else if(col_name === 'price')                   { return 1; }
        else if(col_name === 'crv')                     { return 2; }
        else if(col_name === 'is_taxable')              { return 3; }
        else if(col_name === 'buydown')                 { return 4; }
        else if(col_name === 'select')                  { return 5; }
        else                                            { return -1; }
    }

    //table function
    this.click_col = function(index,col_name){
        var col_index = this.get_index(col_name);
        lib.click(this.lst.get(index).all(by.tagName('td')).get(col_index));
    }

    //btn function
    this.exit = function(){ lib.click(this.exit_btn); }
}

module.exports = new Select_sp_dlg();
