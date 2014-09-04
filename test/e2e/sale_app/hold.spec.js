var lib = require('./../lib');

describe('sale_app/hold', function() {
    var baseUrl = 'http://127.0.0.1:8000/';
    var ptor = protractor.getInstance();
    var enter_key = protractor.Key.ENTER;

    //service/ui/confirm
    var confirm_ui_message = element(by.id('service/ui/confirm/message_txt'));
    var confirm_ui_ok_btn = element(by.id('service/ui/confirm/ok_btn'));

    //menu
    var action_menu = element(by.id('sale_app/menu/action'));
    var hold_menu = element(by.id('sale_app/menu/action/hold'));
    var get_hold_menu = element(by.id('sale_app/menu/action/get_hold'))

    //get hold ui
    var hold_ui_hold_lst = element.all(by.repeater('hold in hold_lst | orderBy : \'-hold.timestamp\''));
    var hold_ui_cur_hold_ds_lst = element.all(by.repeater('ds in cur_hold.ds_lst'));
    var hold_ui_ok_btn = element(by.id('sale_app/service/hold/get_hold_ui/ok_btn'));
    var hold_ui_cancel_btn = element(by.id('sale_app/service/hold/get_hold_ui/cancel_btn'));

    //sale page
    var tender_btn = element(by.id('sale_app/main_page/tender_btn'));
    var ds_lst = element.all(by.repeater('ds in ds_lst'))
    var name_index = 1;
    var price_index = 2;
    var void_btn = element(by.id('sale_app/main_page/void_btn'));

    beforeEach(function(){
        lib.auth.login(baseUrl,'1','1');
        browser.get(baseUrl); 
        lib.setup.init_data();
        lib.auth.logout();
    })

    afterEach(function(){
        lib.auth.logout();
    })

    function hold_cur_ps(){
        action_menu.click();
        hold_menu.click();
        confirm_ui_ok_btn.click();
    }

    function get_hold_ui(){
        action_menu.click();
        get_hold_menu.click();
    }

    it('can create,edit,remove shortcut',function(){
        lib.auth.login(baseUrl,'1','1');
        browser.get(baseUrl); 

        //create 3 sp
        var sku_1 = '111';
        var sku_2 = '222';
        var sku_3 = '333';
        var product_name_1 = 'product name 1';
        var product_name_2 = 'product name 2';
        var product_name_3 = 'proudct name 3';
        lib.api.insert_new(sku_1,product_name_1);
        lib.api.insert_new(sku_2,product_name_2);  
        lib.api.insert_new(sku_3,product_name_3); 
        lib.sale_page.load_this_page();                  

        //when there is nothing on hold, ok button will be disable
        get_hold_ui();
        expect(hold_ui_ok_btn.getAttribute('disabled')).toBeTruthy();
        hold_ui_cancel_btn.click();

        //scan 3 item, the first 2 put on hold
        lib.sale_page.scan(sku_1);
        hold_cur_ps();
        lib.sale_page.scan(sku_2);
        hold_cur_ps();
        lib.sale_page.scan(sku_3);

        //call get hold ui and expect we have 2 current hold 
        get_hold_ui();
        expect(hold_ui_hold_lst.count()).toEqual(2);
        expect(hold_ui_cur_hold_ds_lst.count()).toEqual(0);
        hold_ui_hold_lst.get(0).all(by.css('.btn')).get(0).click();
        expect(hold_ui_cur_hold_ds_lst.get(0).all(by.tagName('td')).get(1).getText()).toEqual(product_name_1);
        hold_ui_hold_lst.get(1).all(by.css('.btn')).get(0).click();
        expect(hold_ui_cur_hold_ds_lst.get(0).all(by.tagName('td')).get(1).getText()).toEqual(product_name_2);
        
        //when getting a hold(the hold at second position), if there is current pending scan, it will prompt us to confirm holding current pending scan before proceed
        hold_ui_ok_btn.click();
        expect(confirm_ui_message.getText()).toEqual('we need to hold current scan. continue?');
        confirm_ui_ok_btn.click();

        //expect hold at position 2 is loaded correctly in ds lst
        expect(ds_lst.count()).toEqual(1);
        expect(ds_lst.get(0).all(by.tagName('td')).get(name_index).getText()).toEqual(product_name_2);

        //expect product 1 and 3 is currenty on hold
        get_hold_ui();
        expect(hold_ui_hold_lst.count()).toEqual(2);
        expect(hold_ui_cur_hold_ds_lst.count()).toEqual(0);
        hold_ui_hold_lst.get(0).all(by.css('.btn')).get(0).click();
        expect(hold_ui_cur_hold_ds_lst.get(0).all(by.tagName('td')).get(1).getText()).toEqual(product_name_1);
        hold_ui_hold_lst.get(1).all(by.css('.btn')).get(0).click();
        expect(hold_ui_cur_hold_ds_lst.get(0).all(by.tagName('td')).get(1).getText()).toEqual(product_name_3);        
        hold_ui_cancel_btn.click();

        //clean up
        void_btn.click();
    })
});