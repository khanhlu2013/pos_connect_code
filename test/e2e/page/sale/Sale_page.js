var base_path = './../../';
var lib = require(base_path + 'lib');

var Sale_page = function () {

    //menu
    this.menu_report = element(by.id('sale_app/menu/report'));
    this.menu_setting = element(by.id('sale_app/menu/setting'));
    this.menu_action = element(by.id('sale_app/menu/action'));

    //txt
    this.scan_txt = element(by.id('sale_app/main_page/scan_txt'));

    //btn
    this.tender_btn = element(by.id('sale_app/main_page/tender_btn'));
    this.void_btn = element(by.id('sale_app/main_page/void_btn'));
    this.non_inventory_btn = element(by.id('sale_app/main_page/non_inventory_btn'));

    //table
    this.lst = element.all(by.repeater('ds in ds_lst'));
    this.shortcut_lst = element.all(by.repeater("row_usage in row_lst"));

    //function menu
    this.menu_report_receipt = function(){this.menu_report.click();element(by.id('sale_app/menu/report/receipt')).click();}
    this.menu_setting_payment_type = function(){this.menu_setting.click();element(by.id('sale_app/menu/setting/payment_type')).click();}
    this.menu_setting_shortcut = function(){ this.menu_setting.click(); element(by.id('sale_app/menu/setting/shortcut')).click();}
    this.menu_action_hold = function(){ this.menu_action.click(); element(by.id('sale_app/menu/action/hold')).click();}
    this.menu_action_get_hold = function(){ this.menu_action.click(); element(by.id('sale_app/menu/action/get_hold')).click();}


    //function btn
    this.void = function(){ this.void_btn.click() }
    this.tender = function(){ lib.click(this.tender_btn); }
    this.non_inventory = function(){ this.non_inventory_btn.click(); }

    //function txt
    this.scan = function(str){ this.scan_txt.clear(); this.scan_txt.sendKeys(str,protractor.Key.ENTER); }

    //function table
    this.get_col_index = function(col_name){
        if(col_name === 'qty')          { return 0; }
        else if(col_name === 'name')    { return 1; }
        else if(col_name === 'price')   { return 2; }
        else if(col_name === 'delete')  { return 3; }
        else                            { return null; }
    }
    this.click_col = function(index,col_name){ var col = this.get_col_index(col_name); lib.click(this.lst.get(index).all(by.tagName('td')).get(col)); }
    this.get_col = function(index,col_name){ var col = this.get_col_index(col_name); return this.lst.get(index).all(by.tagName('td')).get(col).getText(); }
    
    //function misc
    this.visit = function(is_offline){
        var posUrl
        if(is_offline=== true)  {posUrl = 'http://127.0.0.1:8000/sale/index_offline_angular';}
        else                    {posUrl = 'http://127.0.0.1:8000/sale/index_angular';}
        browser.get(posUrl);
        browser.wait(function(){ return element(by.css('.block-ui-overlay')).isDisplayed().then(function(val){ return !val; })});                    
    }
}

module.exports = new Sale_page();
