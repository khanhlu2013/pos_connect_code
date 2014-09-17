var lib = require('./../lib');

describe('sale_app/sale_finalizer__n__receipt_offline_report', function() {
    var baseUrl = 'http://127.0.0.1:8000/';
    var ptor = protractor.getInstance();
    var enter_key = protractor.Key.ENTER;

    //service/ui/prompt
    var prompt_txt = element(by.id('service/ui/prompt/prompt_txt'));
    var prompt_ok_btn = element(by.id('service/ui/prompt/ok_btn'));

    //pt_manage_dlg
    var pt_manage_lst = element.all(by.repeater("pt_manage in pt_lst | orderBy:\'sort\'"));
    var pt_manage_exit_btn = element(by.id('payment_type_app/service/manage/exit_btn'));

    //pt_prompt_dlg
    var pt_prompt_name_txt = element(by.id('payment_type_app/service/prompt/name_txt'));
    var pt_prompt_sort_txt = element(by.id('payment_type_app/service/prompt/sort_txt'));
    var pt_prompt_active_check = element(by.id('payment_type_app/service/prompt/active_check'))
    var pt_prompt_ok_btn = element(by.id('payment_type_app/service/prompt/ok_btn'));
    var pt_prompt_cancel_btn = element(by.id('payment_type_app/service/prompt/cancel_btn'));

    //menu
    var sp_page_report_menu = element(by.id('sp_app/menu/report'));
    var sp_page_receipt_menu = element(by.id('sp_app/menu/report/receipt'));
    var sale_page_report_menu = element(by.id('sale_app/menu/report'));
    var sale_page_receipt_menu = element(by.id('sale_app/menu/report/receipt'));
    var sale_page_setting_menu = element(by.id('sale_app/menu/setting'));
    var sale_page_pt_menu = element(by.id('sale_app/menu/setting/payment_type'));

    //receipt report_page
    var offline_receipt_lst = element.all(by.repeater('receipt in offline_receipt_lst | orderBy : \'-date\''));
    var cur_receipt_ln_lst = element.all(by.repeater('receipt_ln in cur_receipt.receipt_ln_lst | orderBy : \'date\''));
    var report_exit_btn = element(by.id('receipt_app/service/report/exit_btn'))

    //displaying scan info dlg
    var info_dlg_override_price_btn = element(by.id('sale_app/service/sale_able_info_dlg/override_price_btn'));
    var info_dlg_ok_btn = element(by.id('sale_app/service/sale_able_info_dlg/ok_btn'));

    //sale page
    var void_btn = element(by.id('sale_app/main_page/void_btn'));
    var tender_btn = element(by.id('sale_app/main_page/tender_btn'));
    var non_inv_btn = element(by.id('sale_app/main_page/non_inventory_btn'));
    var ds_lst = element.all(by.repeater('ds in ds_lst'))
    var name_index = 1;
    var price_index = 2;

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

    it('can retrive data offline',function(){
        /*
            we will test that receipt report can work without pouchdb
            and sale finalizer and receipt_report store and retrieve correct data
                .override_price
                .mm-deal
                .non-inventory
        */
        lib.auth.login(baseUrl,'1','1');
        browser.get(baseUrl); 

        //setup and override price item
        var product_name_1 = 'product name 1';
        var sku_1 = '111';var price_1 = 1;var override_price_1 = 0.5;
        lib.api.insert_new(sku_1,product_name_1,price_1);

        //setup mm_deal item
        var product_name_2 = 'product name 2';
        var sku_2 = '222';var price_2 = 2;var qty_2 = 9;
        var _5_deal_name = "5 items deal";var _5_deal_price = 5; var _5_deal_is_include = false; _5_deal_qty = 5;
        var _3_deal_name = "3 items deal";var _3_deal_price = 4; var _3_deal_is_include = false; _3_deal_qty = 3;

        //setup pt list
        var credit_card_pt = 'credit card';
        var check_pt = 'check';
        var pt_lst_from_server = null;
        lib.api_pt.insert_lst([credit_card_pt,check_pt])
        .then(
             function(pt_lst){ pt_lst_from_server = pt_lst; expect(pt_lst_from_server.length).toEqual(2);} 
            ,function(reason){ expect(true).toEqual(false); }
        );

        lib.api.insert_new(sku_2,product_name_2,price_2)
        .then(function(sp){
            lib.api.insert_mm(_5_deal_name,_5_deal_price,_5_deal_is_include,_5_deal_qty,[sp]);
            lib.api.insert_mm(_3_deal_name,_3_deal_price,_3_deal_is_include,_3_deal_qty,[sp]);
        })

        //verify receipt report can work without pouch
        sp_page_report_menu.click();
        sp_page_receipt_menu.click();
        expect(offline_receipt_lst.count()).toEqual(0);
        report_exit_btn.click();

        //test sale finalizer and receipt report data
        lib.sale_page.load_this_page(); 

        //setup and override price item
        lib.sale_page.scan(sku_1);
        ds_lst.get(0).all(by.tagName('td')).get(lib.sale_page.get_index('price')).click();
        info_dlg_override_price_btn.click();
        prompt_txt.sendKeys(override_price_1);
        prompt_ok_btn.click();
        info_dlg_ok_btn.click();
        ptor.sleep(200);//wait for pouch to re-calculate ds_lst     

        //setup mm_deal item
        lib.sale_page.scan(qty_2 + ' ' + sku_2);

        //setup non_inventory
        non_inv_btn.click();
        prompt_txt.sendKeys('1.23');
        prompt_ok_btn.click();      
        
        //finalize sale
        expect(ds_lst.count()).toEqual(5);  
        expect(tender_btn.getText()).toEqual('$12.73');
        tender_btn.click();

        ptor.wait(function(){
            return pt_lst_from_server !== null;//when it is true, quit waiting
        }).then(
            function(){
                cash_txt.sendKeys('10');
                element(by.id('sale_app/service/tender_ui/pt_txt/' + pt_lst_from_server[0].id)).sendKeys('20');
                element(by.id('sale_app/service/tender_ui/pt_txt/' + pt_lst_from_server[1].id)).sendKeys('30');
                tender_ok_btn.click();
                ptor.sleep(200);//wait for pouch to saved receipt                
            }
        )        

        //check receipt report
        sale_page_report_menu.click();
        sale_page_receipt_menu.click();  
        // ptor.sleep(200);//wait for pouch to get receipt
        expect(offline_receipt_lst.count()).toEqual(1);
        expect(offline_receipt_lst.get(0).all(by.tagName('td')).get(lib.menu_report_receipt_page.get_receipt_index('total')).getText()).toEqual('$12.73');
        offline_receipt_lst.get(0).all(by.css('.btn')).get(0).click();
        expect(cur_receipt_ln_lst.count()).toEqual(5);

        //verify receipt ln
        expect(cur_receipt_ln_lst.get(0).all(by.tagName('td')).get(lib.menu_report_receipt_page.get_receipt_ln_index('qty')).getText()).toEqual('1');
        expect(cur_receipt_ln_lst.get(0).all(by.tagName('td')).get(lib.menu_report_receipt_page.get_receipt_ln_index('product')).getText()).toEqual(product_name_1);
        expect(cur_receipt_ln_lst.get(0).all(by.tagName('td')).get(lib.menu_report_receipt_page.get_receipt_ln_index('price')).getText()).toEqual('$0.50');

        expect(cur_receipt_ln_lst.get(1).all(by.tagName('td')).get(lib.menu_report_receipt_page.get_receipt_ln_index('qty')).getText()).toEqual('5');
        expect(cur_receipt_ln_lst.get(1).all(by.tagName('td')).get(lib.menu_report_receipt_page.get_receipt_ln_index('product')).getText()).toEqual(product_name_2);
        expect(cur_receipt_ln_lst.get(1).all(by.tagName('td')).get(lib.menu_report_receipt_page.get_receipt_ln_index('price')).getText()).toEqual('$1.00');

        expect(cur_receipt_ln_lst.get(2).all(by.tagName('td')).get(lib.menu_report_receipt_page.get_receipt_ln_index('qty')).getText()).toEqual('3');
        expect(cur_receipt_ln_lst.get(2).all(by.tagName('td')).get(lib.menu_report_receipt_page.get_receipt_ln_index('product')).getText()).toEqual(product_name_2);
        expect(cur_receipt_ln_lst.get(2).all(by.tagName('td')).get(lib.menu_report_receipt_page.get_receipt_ln_index('price')).getText()).toEqual('$1.33');        

        expect(cur_receipt_ln_lst.get(3).all(by.tagName('td')).get(lib.menu_report_receipt_page.get_receipt_ln_index('qty')).getText()).toEqual('1');
        expect(cur_receipt_ln_lst.get(3).all(by.tagName('td')).get(lib.menu_report_receipt_page.get_receipt_ln_index('product')).getText()).toEqual(product_name_2);
        expect(cur_receipt_ln_lst.get(3).all(by.tagName('td')).get(lib.menu_report_receipt_page.get_receipt_ln_index('price')).getText()).toEqual('$2.00'); 

        expect(cur_receipt_ln_lst.get(4).all(by.tagName('td')).get(lib.menu_report_receipt_page.get_receipt_ln_index('qty')).getText()).toEqual('1');
        expect(cur_receipt_ln_lst.get(4).all(by.tagName('td')).get(lib.menu_report_receipt_page.get_receipt_ln_index('product')).getText()).toEqual('non_inventory');
        expect(cur_receipt_ln_lst.get(4).all(by.tagName('td')).get(lib.menu_report_receipt_page.get_receipt_ln_index('price')).getText()).toEqual('$1.23'); 

        report_exit_btn.click();
    });


    it('can display receipt summary',function(){
        /*
            we will test that receipt report can work without pouchdb
            and sale finalizer and receipt_report store and retrieve correct data
                .override_price
                .mm-deal
                .non-inventory
        */
        lib.auth.login(baseUrl,'1','1');
        browser.get(baseUrl); 

        //setup blank product (no crv, no deal)
        var product_name_1 = 'product name 1';
        var sku_1 = '111';var price_1 = 1;
        lib.api.insert_new(sku_1,product_name_1,price_1);

        //setup mm_deal item
        var product_name_2 = 'product name 2';
        var sku_2 = '222';var price_2 = 2;var qty_2 = 3;
        var _3_deal_name = "3 items deal";var _3_deal_price = 4; var _3_deal_is_include = false; _3_deal_qty = 3;
        lib.api.insert_new(sku_2,product_name_2,price_2)
        .then(function(sp){
            lib.api.insert_mm(_3_deal_name,_3_deal_price,_3_deal_is_include,_3_deal_qty,[sp]);
        })

        //setup crv product
        var product_name_3 = 'product name 3';
        var sku_3 = '333';var price_3 = 3; var crv_3 = 0.1;
        lib.api.insert_new(sku_3,product_name_3,price_3,null/*val_cus_price*/,crv_3,false/*is_taxable*/,false/*is_sale_report*/,null/*p_type*/,null/*p_tag*/,null/*cost*/,null/*vendor*/,null/*buydown*/);

        //setup buydown product
        var product_name_4 = 'product name 4';
        var sku_4 = '444';var price_4 = 4;var buydown_4 = 0.5;
        lib.api.insert_new(sku_4,product_name_4,price_4,null/*val_cus_price*/,null/*crv*/,true/*is_taxable*/,false/*is_sale_report*/,null/*p_type*/,null/*p_tag*/,null/*cost*/,null/*vendor*/,buydown_4);

        //setup pt list
        var credit_card_pt = 'credit card';
        var check_pt = 'check';
        var pt_lst_from_server = null;
        lib.api_pt.insert_lst([credit_card_pt,check_pt])
        .then(
             function(pt_lst){ pt_lst_from_server = pt_lst; expect(pt_lst_from_server.length).toEqual(2);} 
            ,function(reason){ expect(true).toEqual(false); }
        );

        //test sale finalizer and receipt report data
        lib.sale_page.load_this_page(); 

        //crv-saving | 0-0 
        lib.sale_page.scan(sku_1);
        tender_btn.click();
        cash_txt.sendKeys('100');
        tender_ok_btn.click();

        //crv-saving | 1-0
        lib.sale_page.scan(sku_3);
        tender_btn.click();
        cash_txt.sendKeys('100');
        tender_ok_btn.click();

        //crv-saving | 0-1
        lib.sale_page.scan(qty_2 + ' ' + sku_2);
        tender_btn.click();
        cash_txt.sendKeys('100');
        tender_ok_btn.click();

        //crv-saving | 1-1
        lib.sale_page.scan(qty_2 + ' ' + sku_2);
        lib.sale_page.scan(sku_3);        
        tender_btn.click();
        cash_txt.sendKeys('100');
        tender_ok_btn.click();

        //buydown tax | 0
        lib.sale_page.scan(sku_1);
        tender_btn.click();
        cash_txt.sendKeys('100');
        tender_ok_btn.click();

        //buydown tax | 1
        lib.sale_page.scan(sku_4);
        tender_btn.click();
        cash_txt.sendKeys('100');
        tender_ok_btn.click();

        //payment type
        lib.sale_page.scan(sku_1);
        tender_btn.click();
        ptor.wait(function(){
            return pt_lst_from_server !== null;//when it is true, quit waiting
        }).then(
            function(){
                cash_txt.sendKeys('10');
                element(by.id('sale_app/service/tender_ui/pt_txt/' + pt_lst_from_server[0].id)).sendKeys('20');
                element(by.id('sale_app/service/tender_ui/pt_txt/' + pt_lst_from_server[1].id)).sendKeys('30');
                tender_ok_btn.click();
                ptor.sleep(200);//wait for pouch to saved receipt                
            }
        )        
        //check receipt report
        sale_page_report_menu.click();
        sale_page_receipt_menu.click();  
        expect(offline_receipt_lst.count()).toEqual(7);

        //payment type
        offline_receipt_lst.get(0).all(by.css('.btn')).get(0).click();
        ptor.wait(function(){
            return pt_lst_from_server !== null;//when it is true, quit waiting
        }).then(
            function(){
                expect(element(by.id('receipt_app/service/report/receipt_summary/tender_txt/null')).getText()).toEqual('($10.00)');        
                expect(element(by.id('receipt_app/service/report/receipt_summary/tender_txt/' + pt_lst_from_server[0].id)).getText()).toEqual('($20.00)');        
                expect(element(by.id('receipt_app/service/report/receipt_summary/tender_txt/' + pt_lst_from_server[1].id)).getText()).toEqual('($30.00)');       

                expect(element(by.id('receipt_app/service/report/receipt_summary/tender_lbl/null')).getText()).toEqual('cash:');        
                expect(element(by.id('receipt_app/service/report/receipt_summary/tender_lbl/' + pt_lst_from_server[0].id)).getText()).toEqual(credit_card_pt + ':');        
                expect(element(by.id('receipt_app/service/report/receipt_summary/tender_lbl/' + pt_lst_from_server[1].id)).getText()).toEqual(check_pt + ':');                
            }
        )          
        //change payment type name 
        report_exit_btn.click();
        sale_page_setting_menu.click();
        sale_page_pt_menu.click();
        var new_check_pt = 'check_';
        pt_manage_lst.get(0).all(by.css('.btn')).get(0).click();
        pt_prompt_name_txt.clear();
        pt_prompt_name_txt.sendKeys(new_check_pt);
        pt_prompt_ok_btn.click();
        pt_manage_exit_btn.click();

        //verify new pt
        sale_page_report_menu.click();
        sale_page_receipt_menu.click();         
        offline_receipt_lst.get(0).all(by.css('.btn')).get(0).click();
        ptor.wait(function(){
            return pt_lst_from_server !== null;//when it is true, quit waiting
        }).then(
            function(){
                expect(element(by.id('receipt_app/service/report/receipt_summary/tender_txt/null')).getText()).toEqual('($10.00)');        
                expect(element(by.id('receipt_app/service/report/receipt_summary/tender_txt/' + pt_lst_from_server[0].id)).getText()).toEqual('($20.00)');        
                expect(element(by.id('receipt_app/service/report/receipt_summary/tender_txt/' + pt_lst_from_server[1].id)).getText()).toEqual('($30.00)');       

                expect(element(by.id('receipt_app/service/report/receipt_summary/tender_lbl/null')).getText()).toEqual('cash:');        
                expect(element(by.id('receipt_app/service/report/receipt_summary/tender_lbl/' + pt_lst_from_server[0].id)).getText()).toEqual(credit_card_pt + ':');        
                expect(element(by.id('receipt_app/service/report/receipt_summary/tender_lbl/' + pt_lst_from_server[1].id)).getText()).toEqual(new_check_pt + ':');                
            }
        )  

        //buydown tax | 1
        offline_receipt_lst.get(1).all(by.css('.btn')).get(0).click();
        expect(element(by.id('receipt_app/service/report/receipt_summary/buydown_tax')).getText()).toEqual('$0.04');

        //buydown tax | 0
        offline_receipt_lst.get(2).all(by.css('.btn')).get(0).click();        
        expect(element(by.id('receipt_app/service/report/receipt_summary/buydown_tax')).isDisplayed()).toBeFalsy();

        //crv-saving | 1-1
        offline_receipt_lst.get(3).all(by.css('.btn')).get(0).click();  
        expect(element(by.id('receipt_app/service/report/receipt_summary/crv')).getText()).toEqual('$0.10');
        expect(element(by.id('receipt_app/service/report/receipt_summary/saving')).getText()).toEqual('($2.00)');
                        
        //crv-saving | 0-1
        offline_receipt_lst.get(4).all(by.css('.btn')).get(0).click();  
        expect(element(by.id('receipt_app/service/report/receipt_summary/crv')).isDisplayed()).toBeFalsy();
        expect(element(by.id('receipt_app/service/report/receipt_summary/saving')).getText()).toEqual('($2.00)');

        //crv-saving | 1-0
        offline_receipt_lst.get(5).all(by.css('.btn')).get(0).click();  
        expect(element(by.id('receipt_app/service/report/receipt_summary/crv')).getText()).toEqual('$0.10');
        expect(element(by.id('receipt_app/service/report/receipt_summary/saving')).isDisplayed()).toBeFalsy();

        //crv-saving | 0-0
        offline_receipt_lst.get(6).all(by.css('.btn')).get(0).click();  
        expect(element(by.id('receipt_app/service/report/receipt_summary/subtotal_derivation')).isDisplayed()).toBeFalsy();

        //clean up
        report_exit_btn.click();
    },60000)
});