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
    this.change_btn = element(by.id('sale_app/main_page/change_btn'));
    this.void_btn = element(by.id('sale_app/main_page/void_btn'));
    this.non_inventory_btn = element(by.id('sale_app/main_page/non_inventory_btn'));

    //table
    this.lst = element.all(by.repeater('ds in ds_lst'));

    //function menu
    this.menu_report_receipt = function(){
        lib.click(this.menu_report);
        lib.click(element(by.id('sale_app/menu/report/receipt')));
        lib.wait_for_block_ui();//when receipt dialog open it automatically get offline receipt to push and auto download 15 latest receipts. lets wait for it before we do anything else
    }
    this.menu_setting_payment_type = function(){lib.click(this.menu_setting);lib.click(element(by.id('sale_app/menu/setting/payment_type')));}
    this.menu_setting_shortcut = function(){lib.click(this.menu_setting);lib.click(element(by.id('sale_app/menu/setting/shortcut')));}
    this.menu_action_hold = function(){lib.click(this.menu_action);lib.click(element(by.id('sale_app/menu/action/hold')));}
    this.menu_action_get_hold = function(){lib.click(this.menu_action);lib.click(element(by.id('sale_app/menu/action/get_hold')));}
    this.menu_setting_mix_match = function(){ lib.click(this.menu_setting); lib.click(element(by.id('sale_app/menu/setting/mix_match'))); }

    //function btn
    this.void = function(){ lib.click(this.void_btn) }
    this.tender = function(){ lib.click(this.tender_btn); }
    this.non_inventory = function(){ lib.click(this.non_inventory_btn); }

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
    this.click_col = function(index,col_name){
        var col = this.get_col_index(col_name);
        lib.click(this.lst.get(index).all(by.tagName('td')).get(col)); 
    }
    this.get_col = function(index,col_name){
        var col = this.get_col_index(col_name); 
        return this.lst.get(index).all(by.tagName('td')).get(col).getText(); 
    }
    this.get_col_html = function(index,col_name){
        var col = this.get_col_index(col_name); 
        return this.lst.get(index).all(by.tagName('td')).get(col).getWebElement().getInnerHtml();      
    }

    //function shortcut
    var COL = 3
    var ROW = 5
    var PARENT_LEFT = 0;
    var PARENT_RIGHT = 4;
    this.shortcut_lst = element.all(by.repeater("row_usage in row_lst"));
    
    //function shortcut parent
    this._get_parent_td = function(position){
        var row_coordinate = position;
        var col_coordinate = PARENT_LEFT;
        if(position > ROW -1){
            row_coordinate = position - ROW;
            col_coordinate = PARENT_RIGHT;
        }        
        return this.shortcut_lst.get(row_coordinate).all(by.tagName('td')).get(col_coordinate);
    }
    this.get_parent_text = function(position){
        return this._get_parent_td(position).getText();
    }
    this.click_parent = function(position){
        lib.click(this._get_parent_td(position));
    }

    //function shortcut child
    this._get_child_td = function(position){
        var row_coordinate = Math.floor(position/COL);
        var col_coordinate = (position % COL) + 1;  
        return this.shortcut_lst.get(row_coordinate).all(by.tagName('td')).get(col_coordinate);
    }
    this.click_child = function(position){
        lib.click(this._get_child_td(position));
    }
    this.get_child_text = function(position){
        return this._get_child_td(position).getText();
    }    

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
