var lib = require('./../lib');

describe('receipt_app/sale_able_info_dlg', function() {
    var baseUrl = 'http://127.0.0.1:8000/';
    var ptor = protractor.getInstance();
    var enter_key = protractor.Key.ENTER;

    //service/ui/prompt
    var prompt_txt = element(by.id('service/ui/prompt/prompt_txt'));
    var prompt_ok_btn = element(by.id('service/ui/prompt/ok_btn'));

    //menu
    var sp_page_report_menu = element(by.id('sp_app/menu/report'));
    var sp_page_receipt_menu = element(by.id('sp_app/menu/report/receipt'));
    var sale_page_report_menu = element(by.id('sale_app/menu/report'));
    var sale_page_receipt_menu = element(by.id('sale_app/menu/report/receipt'));

    //receipt report_page
    var offline_receipt_lst = element.all(by.repeater('receipt in offline_receipt_lst | orderBy : \'-date\''));
    var cur_receipt_ln_lst = element.all(by.repeater('receipt_ln in cur_receipt.receipt_ln_lst | orderBy : \'date\''));
    var report_exit_btn = element(by.id('receipt_app/service/report/exit_btn'))

    //displaying scan info dlg
    var info_dlg = element(by.id('sale_app/service/sale_able_info_dlg'));
    var info_dlg_override_price_btn = element(by.id('sale_app/service/sale_able_info_dlg/override_price_btn'));
    var info_dlg_remove_override_price_btn = element(by.id('sale_app/service/sale_able_info_dlg/remove_override_price_btn'));
    var info_dlg_preset_price = element(by.id('sale_app/service/sale_able_info_dlg/preset_price'));
    var info_dlg_override_price = element(by.id('sale_app/service/sale_able_info_dlg/override_price'));
    var info_dlg_mm_deal_name = element(by.id('sale_app/service/sale_able_info_dlg/mm_deal_name'));
    var info_dlg_mm_deal_unit_discount = element(by.id('sale_app/service/sale_able_info_dlg/mm_deal_unit_discount'));
    var info_dlg_buydown = element(by.id('sale_app/service/sale_able_info_dlg/buydown'));
    var info_dlg_advertise_price = element(by.id('sale_app/service/sale_able_info_dlg/advertise_price'));
    var info_dlg_crv = element(by.id('sale_app/service/sale_able_info_dlg/crv'));
    var info_dlg_buydown_tax = element(by.id('sale_app/service/sale_able_info_dlg/buydown_tax'));
    var info_dlg_tax = element(by.id('sale_app/service/sale_able_info_dlg/tax'));
    var info_dlg_otd_price = element(by.id('sale_app/service/sale_able_info_dlg/otd_price'));
    var info_dlg_ok_btn = element(by.id('sale_app/service/sale_able_info_dlg/ok_btn'));
    var info_dlg_cancel_btn = element(by.id('sale_app/service/sale_able_info_dlg/cancel_btn'));

    //sale page
    var void_btn = element(by.id('sale_app/main_page/void_btn'));
    var tender_btn = element(by.id('sale_app/main_page/tender_btn'));
    var non_inv_btn = element(by.id('sale_app/main_page/non_inventory_btn'));
    var ds_lst = element.all(by.repeater('ds in ds_lst'))

    //tender_ui
    var cash_txt = element(by.id('sale_app/service/tender_ui/pt_txt/null'));
    var tender_ok_btn = element(by.id('sale_app/service/tender_ui/ok_btn'));

    beforeEach(function(){
        lib.auth.login(baseUrl,'1','1');
        browser.get(baseUrl); 
        lib.setup.init_data();
        lib.auth.logout();
    })

    afterEach(function(){
        lib.auth.logout();
    })

    it('can display sale_able_info_dlg',function(){
        lib.auth.login(baseUrl,'1','1');
        browser.get(baseUrl); 

        //deal_crv_buydown_buydonwtax <-> 0_0_0_0
        var product_name_1 = 'product name 1';
        var sku_1 = '111';var price_1 = 1;
        lib.api.insert_new(sku_1,product_name_1,price_1);

        //deal_crv_buydown_buydonwtax <-> 1_0_0_0
        var product_name_2 = 'product name 2';
        var sku_2 = '222';var price_2 = 2;var qty_2 = 3;
        var _3_deal_name = "3 items deal";var _3_deal_price = 4; var _3_deal_is_include = false; _3_deal_qty = 3;
        lib.api.insert_new(sku_2,product_name_2,price_2)
        .then(function(sp){
            lib.api.insert_mm(_3_deal_name,_3_deal_price,_3_deal_is_include,_3_deal_qty,[sp]);
        })

        //deal_crv_buydown_buydonwtax <-> 0_1_0_0
        var product_name_3 = 'product name 3';
        var sku_3 = '333';var price_3 = 3; var crv_3 = 0.1;
        lib.api.insert_new(sku_3,product_name_3,price_3,null/*val_cus_price*/,crv_3,false/*is_taxable*/,false/*is_sale_report*/,null/*p_type*/,null/*p_tag*/,null/*cost*/,null/*vendor*/,null/*buydown*/);

        //deal_crv_buydown_buydonwtax <-> 0_0_1_1
        var product_name_4 = 'product name 4';
        var sku_4 = '444';var price_4 = 4;var buydown_4 = 0.5;
        lib.api.insert_new(sku_4,product_name_4,price_4,null/*val_cus_price*/,null/*crv*/,true/*is_taxable*/,false/*is_sale_report*/,null/*p_type*/,null/*p_tag*/,null/*cost*/,null/*vendor*/,buydown_4);

        //create a sale
        lib.sale_page.load_this_page(); 
        //deal_crv_buydown_buydonwtax <-> 0_0_0_0
        lib.sale_page.scan(sku_1);
        //deal_crv_buydown_buydonwtax <-> 1_0_0_0
        lib.sale_page.scan(_3_deal_qty + ' ' + sku_2);
        //deal_crv_buydown_buydonwtax <-> 0_1_0_0
        lib.sale_page.scan(sku_3);
        //deal_crv_buydown_buydonwtax <-> 0_0_1_1
        lib.sale_page.scan(sku_4);
        tender_btn.click();
        cash_txt.sendKeys('100');
        tender_ok_btn.click();

        //test report
        sale_page_report_menu.click();
        sale_page_receipt_menu.click();
        expect(offline_receipt_lst.count()).toEqual(1);
        offline_receipt_lst.get(0).all(by.css('.btn')).get(0).click();
        expect(cur_receipt_ln_lst.count()).toEqual(4);

        //test sale_able_info_dlg
        var price_index = lib.menu_report_receipt_page.get_receipt_ln_index('price');


        //deal_crv_buydown_buydonwtax <-> 0_0_0_0
        cur_receipt_ln_lst.get(0).all(by.tagName('td')).get(price_index).click();
        expect(info_dlg_override_price_btn.isDisplayed()).toBe(false);
        expect(info_dlg_remove_override_price_btn.isDisplayed()).toBe(false);
        expect(info_dlg_preset_price.getText()).toEqual('$1.00');
        expect(info_dlg_override_price.getText()).toEqual('None');
        expect(info_dlg_mm_deal_name.isDisplayed()).toBeFalsy();
        expect(info_dlg_mm_deal_unit_discount.isDisplayed()).toBeFalsy();
        expect(info_dlg_buydown.isDisplayed()).toBeFalsy();
        expect(info_dlg_advertise_price.getText()).toEqual('$1.00');
        expect(info_dlg_crv.getText()).toEqual('');
        expect(info_dlg_buydown_tax.isDisplayed()).toBeFalsy();
        expect(info_dlg_tax.getText()).toEqual('');
        expect(info_dlg_otd_price.getText()).toEqual('$1.00');
        info_dlg_cancel_btn.click();

        //deal_crv_buydown_buydonwtax <-> 1_0_0_0
        cur_receipt_ln_lst.get(1).all(by.tagName('td')).get(price_index).click();
        expect(info_dlg_override_price_btn.isDisplayed()).toBe(false);
        expect(info_dlg_remove_override_price_btn.isDisplayed()).toBe(false);
        expect(info_dlg_preset_price.getText()).toEqual('$2.00');
        expect(info_dlg_override_price.getText()).toEqual('None');
        expect(info_dlg_mm_deal_name.getText()).toEqual(_3_deal_name + ' (discount):');
        expect(info_dlg_mm_deal_unit_discount.getText()).toEqual('$0.67');
        expect(info_dlg_buydown.isDisplayed()).toBeFalsy();
        expect(info_dlg_advertise_price.getText()).toEqual('$1.33');
        expect(info_dlg_crv.getText()).toEqual('');
        expect(info_dlg_buydown_tax.isDisplayed()).toBeFalsy();
        expect(info_dlg_tax.getText()).toEqual('');
        expect(info_dlg_otd_price.getText()).toEqual('$1.33');
        info_dlg_cancel_btn.click();

        //deal_crv_buydown_buydonwtax <-> 0_1_0_0
        cur_receipt_ln_lst.get(2).all(by.tagName('td')).get(price_index).click();
        expect(info_dlg_override_price_btn.isDisplayed()).toBe(false);
        expect(info_dlg_remove_override_price_btn.isDisplayed()).toBe(false);
        expect(info_dlg_preset_price.getText()).toEqual('$3.00');
        expect(info_dlg_override_price.getText()).toEqual('None');
        expect(info_dlg_mm_deal_name.isDisplayed()).toBeFalsy();
        expect(info_dlg_mm_deal_unit_discount.isDisplayed()).toBeFalsy();
        expect(info_dlg_buydown.isDisplayed()).toBeFalsy();
        expect(info_dlg_advertise_price.getText()).toEqual('$3.00');
        expect(info_dlg_crv.getText()).toEqual('$0.10');
        expect(info_dlg_buydown_tax.isDisplayed()).toBeFalsy();
        expect(info_dlg_tax.getText()).toEqual('');
        expect(info_dlg_otd_price.getText()).toEqual('$3.10');
        info_dlg_cancel_btn.click();

        //deal_crv_buydown_buydonwtax <-> 0_0_1_1
        cur_receipt_ln_lst.get(3).all(by.tagName('td')).get(price_index).click();
        expect(info_dlg_override_price_btn.isDisplayed()).toBe(false);
        expect(info_dlg_remove_override_price_btn.isDisplayed()).toBe(false);
        expect(info_dlg_preset_price.getText()).toEqual('$4.00');
        expect(info_dlg_override_price.getText()).toEqual('None');
        expect(info_dlg_mm_deal_name.isDisplayed()).toBeFalsy();
        expect(info_dlg_mm_deal_unit_discount.isDisplayed()).toBeFalsy();
        expect(info_dlg_buydown.getText()).toEqual('$0.50');
        expect(info_dlg_advertise_price.getText()).toEqual('$3.50');
        expect(info_dlg_crv.getText()).toEqual('');
        expect(info_dlg_buydown_tax.getText()).toEqual('$0.04');
        expect(info_dlg_tax.getText()).toEqual('$0.31');
        expect(info_dlg_otd_price.getText()).toEqual('$3.85');
        info_dlg_cancel_btn.click();

        report_exit_btn.click();
    },60000)
});