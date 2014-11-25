var base_path = './../../';
var lib = require(base_path + 'lib');

var Sale_page = function () {

    //menu
    this.menu_report = element(by.id('sp_app/menu/report'));
    this.menu_setting = element(by.id('sp_app/menu/setting'));
    this.menu_action = element(by.id('sp_app/menu/action'));

    //txt
    this.sku_txt = element(by.model('sku_search_str'));
    this.name_txt = element(by.model('name_search_str'));

    //table
    this.lst = element.all(by.repeater('sp in sp_lst|orderBy:cur_sort_column:cur_sort_desc|filter:local_filter'))

    //menu function
    this.menu_action_sync = function(){ lib.click(this.menu_action); lib.click(element(by.id('sp_app/menu/action/sync'))); }
    this.menu_report_receipt = function(){ lib.click(this.menu_report); lib.click(element(by.id('sp_app/menu/report/receipt'))); }
    this.menu_setting_group = function(){ lib.click(this.menu_setting); lib.click(element(by.id('sp_app/menu/setting/group'))); }
    this.menu_setting_payment_type = function(){ lib.click(this.menu_setting); lib.click(element(by.id('sp_app/menu/setting/payment_type'))); }
    this.menu_setting_mix_match = function(){ lib.click(this.menu_setting); lib.click(element(by.id('sp_app/menu/setting/mix_match'))); }
    this.menu_setting_shortcut = function(){ lib.click(this.menu_setting); lib.click(element(by.id('sp_app/menu/setting/shortcut'))); }
    this.menu_setting_tax = function(){ lib.click(this.menu_setting); lib.click(element(by.id('sp_app/menu/setting/tax'))); }

    //txt function
    this.sku_search = function(sku_search_str){ 
        this.sku_txt.clear();
        this.sku_txt.sendKeys(sku_search_str,protractor.Key.ENTER); 
        lib.wait_for_block_ui();
    }
    this.name_search = function(name_search_str){ this.name_txt.clear();this.name_txt.sendKeys(name_search_str,protractor.Key.ENTER); }

    //index function
    this.get_index = function(col_name){
        if(col_name === 'product')                      { return 0; }
        else if(col_name === 'price')                   { return 1; }
        else if(col_name === 'crv')                     { return 2; }
        else if(col_name === 'is_taxable')              { return 3; }
        else if(col_name === 'is_sale_report')          { return 4; }
        else if(col_name === 'p_type')                  { return 5; }
        else if(col_name === 'p_tag')                   { return 6; }
        else if(col_name === 'vendor')                  { return 7; }
        else if(col_name === 'cost')                    { return 8; }
        else if(col_name === 'buydown')                 { return 9; }
        else if(col_name === 'value_customer_price')    { return 10; }
        else if(col_name === 'markup')                  { return 11; }        
        else if(col_name === 'info')                    { return 12; }
        else                                            { return null; }
    }

    //table function
    this.click_col = function(index,col_name){
        var col_index = this.get_index(col_name);
        lib.click(this.lst.get(index).all(by.tagName('td')).get(col_index));
    }
    this.get_col = function(index,col_name){
        var col_index = this.get_index(col_name);

        if(col_name === 'is_taxable' || col_name === 'is_sale_report'){
            var defer = protractor.promise.defer();
            this.lst.get(index).all(by.tagName('td')).get(col_index).all(by.tagName('span')).get(0).getAttribute('class').then(
                function(cls){
                    var ret_val; 
                    if(cls.indexOf('glyphicon-check') !== -1){
                        ret_val = true; 
                    }else{
                        ret_val = false; 
                    }
                    defer.fulfill(ret_val);
                }
            )
            return defer.promise;
        }else{
            return this.lst.get(index).all(by.tagName('td')).get(col_index).getText(); 
        }
    }
}

module.exports = new Sale_page();