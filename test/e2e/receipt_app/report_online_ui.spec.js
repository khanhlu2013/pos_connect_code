var base_path = './../'
var lib = require(base_path + 'lib');

describe('receipt_app\'s Report dialog', function() {
    var Sale_page = require(base_path + 'page/sale/Sale_page');
    var Sale_able_info_dlg = require(base_path + 'page/sale/Sale_able_info_dlg.js');
    var Report_dlg = require(base_path + 'page/receipt/Report_dlg.js');
    var Tender_dlg = require(base_path + 'page/sale/Tender_dlg.js');
    var Sp_page = require(base_path + 'page/sp/Sp_page');
    var Pt_manage_dlg = require(base_path + 'page/payment_type/Manage_dlg.js');
    var Pt_prompt_dlg = require(base_path + 'page/payment_type/Prompt_dlg.js');
    var Non_inventory_prompt_dlg = require(base_path + 'page/sp/Non_inventory_prompt_dlg.js');

    beforeEach(function(){
        lib.auth.login('1','1');
        lib.setup.init_data();
        lib.auth.logout();
    })
    
    it('can work on sp page without pouchdb',function(){
        lib.auth.login('1','1');
        Sp_page.menu_report_receipt();
        expect(Report_dlg.online.receipt.lst.count()).toEqual(0);
        
        //clean up
        Report_dlg.exit();
        lib.auth.logout();
    });

    it('can display deal,crv,buydown,buydown_tax in sale_able_info_dlg for receipt_ln store_product and non_inventory',function(){
        lib.auth.login('1','1');

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
        Sale_page.visit();
        //deal_crv_buydown_buydonwtax <-> 0_0_0_0
        Sale_page.scan(sku_1);
        //deal_crv_buydown_buydonwtax <-> 1_0_0_0
        Sale_page.scan(_3_deal_qty + ' ' + sku_2);
        //deal_crv_buydown_buydonwtax <-> 0_1_0_0
        Sale_page.scan(sku_3);
        //deal_crv_buydown_buydonwtax <-> 0_0_1_1
        Sale_page.scan(sku_4);
        //non_inventory
        var ni_price=1.1;var ni_crv=2.2; var ni_is_taxable=true;
        Sale_page.non_inventory();
        Non_inventory_prompt_dlg.set_price(ni_price);
        Non_inventory_prompt_dlg.set_crv(ni_crv);
        Non_inventory_prompt_dlg.set_is_taxable(ni_is_taxable);
        Non_inventory_prompt_dlg.ok();   

        Sale_page.tender();
        Tender_dlg.cash_txt.sendKeys('100');
        Tender_dlg.ok();

        //test report
        Sale_page.menu_report_receipt();
        expect(Report_dlg.online.receipt.lst.count()).toEqual(1);
        Report_dlg.online.receipt.click_col(0,'info');
        expect(Report_dlg.online.receipt_ln.lst.count()).toEqual(5);

        //deal_crv_buydown_buydonwtax <-> 0_0_0_0
        Report_dlg.online.receipt_ln.click_col(0,'price');

        expect(Sale_able_info_dlg.override_price_btn.isDisplayed()).toBe(false);
        expect(Sale_able_info_dlg.remove_override_price_btn.isDisplayed()).toBe(false);
        expect(Sale_able_info_dlg.preset_price_lbl.getText()).toEqual('$1.00');
        expect(Sale_able_info_dlg.override_price_lbl.getText()).toEqual('None');
        expect(Sale_able_info_dlg.mm_deal_title_lbl.isDisplayed()).toBeFalsy();
        expect(Sale_able_info_dlg.mm_deal_lbl.isDisplayed()).toBeFalsy();
        expect(Sale_able_info_dlg.buydown_lbl.isDisplayed()).toBeFalsy();
        expect(Sale_able_info_dlg.advertise_price_lbl.getText()).toEqual('$1.00');
        expect(Sale_able_info_dlg.crv_lbl.getText()).toEqual('');
        expect(Sale_able_info_dlg.buydown_tax_lbl.isDisplayed()).toBeFalsy();
        expect(Sale_able_info_dlg.tax_lbl.getText()).toEqual('');
        expect(Sale_able_info_dlg.otd_price_lbl.getText()).toEqual('$1.00');
        Sale_able_info_dlg.cancel();

        //deal_crv_buydown_buydonwtax <-> 1_0_0_0
        Report_dlg.online.receipt_ln.click_col(1,'price');
        expect(Sale_able_info_dlg.override_price_btn.isDisplayed()).toBe(false);
        expect(Sale_able_info_dlg.remove_override_price_btn.isDisplayed()).toBe(false);
        expect(Sale_able_info_dlg.preset_price_lbl.getText()).toEqual('$2.00');
        expect(Sale_able_info_dlg.override_price_lbl.getText()).toEqual('None');
        expect(Sale_able_info_dlg.mm_deal_title_lbl.getText()).toEqual(_3_deal_name + ' (discount):');
        expect(Sale_able_info_dlg.mm_deal_lbl.getText()).toEqual('$0.67');
        expect(Sale_able_info_dlg.buydown_lbl.isDisplayed()).toBeFalsy();
        expect(Sale_able_info_dlg.advertise_price_lbl.getText()).toEqual('$1.33');
        expect(Sale_able_info_dlg.crv_lbl.getText()).toEqual('');
        expect(Sale_able_info_dlg.buydown_tax_lbl.isDisplayed()).toBeFalsy();
        expect(Sale_able_info_dlg.tax_lbl.getText()).toEqual('');
        expect(Sale_able_info_dlg.otd_price_lbl.getText()).toEqual('$1.33');
        Sale_able_info_dlg.cancel();

        //deal_crv_buydown_buydonwtax <-> 0_1_0_0
        Report_dlg.online.receipt_ln.click_col(2,'price');
        expect(Sale_able_info_dlg.override_price_btn.isDisplayed()).toBe(false);
        expect(Sale_able_info_dlg.remove_override_price_btn.isDisplayed()).toBe(false);
        expect(Sale_able_info_dlg.preset_price_lbl.getText()).toEqual('$3.00');
        expect(Sale_able_info_dlg.override_price_lbl.getText()).toEqual('None');
        expect(Sale_able_info_dlg.mm_deal_title_lbl.isDisplayed()).toBeFalsy();
        expect(Sale_able_info_dlg.mm_deal_lbl.isDisplayed()).toBeFalsy();
        expect(Sale_able_info_dlg.buydown_lbl.isDisplayed()).toBeFalsy();
        expect(Sale_able_info_dlg.advertise_price_lbl.getText()).toEqual('$3.00');
        expect(Sale_able_info_dlg.crv_lbl.getText()).toEqual('$0.10');
        expect(Sale_able_info_dlg.buydown_tax_lbl.isDisplayed()).toBeFalsy();
        expect(Sale_able_info_dlg.tax_lbl.getText()).toEqual('');
        expect(Sale_able_info_dlg.otd_price_lbl.getText()).toEqual('$3.10');
        Sale_able_info_dlg.cancel();

        //deal_crv_buydown_buydonwtax <-> 0_0_1_1
        Report_dlg.online.receipt_ln.click_col(3,'price');
        expect(Sale_able_info_dlg.override_price_btn.isDisplayed()).toBe(false);
        expect(Sale_able_info_dlg.remove_override_price_btn.isDisplayed()).toBe(false);
        expect(Sale_able_info_dlg.preset_price_lbl.getText()).toEqual('$4.00');
        expect(Sale_able_info_dlg.override_price_lbl.getText()).toEqual('None');
        expect(Sale_able_info_dlg.mm_deal_title_lbl.isDisplayed()).toBeFalsy();
        expect(Sale_able_info_dlg.mm_deal_lbl.isDisplayed()).toBeFalsy();
        expect(Sale_able_info_dlg.buydown_lbl.getText()).toEqual('$0.50');
        expect(Sale_able_info_dlg.advertise_price_lbl.getText()).toEqual('$3.50');
        expect(Sale_able_info_dlg.crv_lbl.getText()).toEqual('');
        expect(Sale_able_info_dlg.buydown_tax_lbl.getText()).toEqual('$0.04');
        expect(Sale_able_info_dlg.tax_lbl.getText()).toEqual('$0.31');
        expect(Sale_able_info_dlg.otd_price_lbl.getText()).toEqual('$3.85');
        Sale_able_info_dlg.cancel();

        //non invenotry
        Report_dlg.online.receipt_ln.click_col(4,'price');
        expect(Sale_able_info_dlg.override_price_btn.isDisplayed()).toBe(false);
        expect(Sale_able_info_dlg.remove_override_price_btn.isDisplayed()).toBe(false);
        expect(Sale_able_info_dlg.preset_price_lbl.getText()).toEqual(lib.currency(ni_price));
        expect(Sale_able_info_dlg.override_price_lbl.getText()).toEqual('None');
        expect(Sale_able_info_dlg.mm_deal_title_lbl.isDisplayed()).toBeFalsy();
        expect(Sale_able_info_dlg.mm_deal_lbl.isDisplayed()).toBeFalsy();
        expect(Sale_able_info_dlg.buydown_lbl.isDisplayed()).toBeFalsy();
        expect(Sale_able_info_dlg.advertise_price_lbl.getText()).toEqual(lib.currency(ni_price));
        expect(Sale_able_info_dlg.crv_lbl.getText()).toEqual(lib.currency(ni_crv));
        expect(Sale_able_info_dlg.buydown_tax_lbl.isDisplayed()).toBeFalsy();
        expect(Sale_able_info_dlg.tax_lbl.getText()).toEqual('$0.29');
        expect(Sale_able_info_dlg.otd_price_lbl.getText()).toEqual('$3.59');
        Sale_able_info_dlg.cancel();

        //clean up
        Report_dlg.exit();
        lib.auth.logout();
    },60000)

    it('can display receipt summary: different pt, different receipt_ln containing deal,crv,buydown',function(){
        lib.auth.login('1','1');

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
        Sale_page.visit();

        //crv-saving | 0-0 
        Sale_page.scan(sku_1);
        Sale_page.tender();
        Tender_dlg.cash_txt.sendKeys('100');
        Tender_dlg.ok();

        //crv-saving | 1-0
        Sale_page.scan(sku_3);
        Sale_page.tender();
        Tender_dlg.cash_txt.sendKeys('100');
        Tender_dlg.ok();

        //crv-saving | 0-1
        Sale_page.scan(qty_2 + ' ' + sku_2);
        Sale_page.tender();
        Tender_dlg.cash_txt.sendKeys('100');
        Tender_dlg.ok();

        //crv-saving | 1-1
        Sale_page.scan(qty_2 + ' ' + sku_2);
        Sale_page.scan(sku_3);        
        Sale_page.tender();
        Tender_dlg.cash_txt.sendKeys('100');
        Tender_dlg.ok();

        //buydown tax | 0
        Sale_page.scan(sku_1);
        Sale_page.tender();
        Tender_dlg.cash_txt.sendKeys('100');
        Tender_dlg.ok();

        //buydown tax | 1
        Sale_page.scan(sku_4);
        Sale_page.tender();
        Tender_dlg.cash_txt.sendKeys('100');
        Tender_dlg.ok();

        //payment type
        var cash_amount = 100;
        var pt_0_amount = 20;
        var pt_1_amount = 30;

        Sale_page.scan(sku_1);
        Sale_page.tender();
        browser.wait(function(){ return pt_lst_from_server !== null;/* when it is true, quit waiting */}).then(
            function(){
                Tender_dlg.cash_txt.sendKeys(cash_amount);
                Tender_dlg.set_pt(pt_lst_from_server[0].id,pt_0_amount);
                Tender_dlg.set_pt(pt_lst_from_server[1].id,pt_1_amount);
                Tender_dlg.ok();
            }
        )        
        //check receipt report
        Sale_page.menu_report_receipt();
        expect(Report_dlg.online.receipt.lst.count()).toEqual(7);

        //verify payment type
        Report_dlg.online.receipt.click_col(0,'info');
        browser.wait(function(){
            return pt_lst_from_server !== null;//when it is true, quit waiting
        }).then(
            function(){
                expect(Report_dlg.online.receipt.summary.get_tender_lbl(null)).toEqual(lib.currency(cash_amount));
                expect(Report_dlg.online.receipt.summary.get_tender_lbl(pt_lst_from_server[0].id)).toEqual(lib.currency(pt_0_amount));
                expect(Report_dlg.online.receipt.summary.get_tender_lbl(pt_lst_from_server[1].id)).toEqual(lib.currency(pt_1_amount));

                expect(Report_dlg.online.receipt.summary.get_tender_title_lbl(null)).toEqual('cash:');
                expect(Report_dlg.online.receipt.summary.get_tender_title_lbl(pt_lst_from_server[0].id)).toEqual(credit_card_pt + ':');
                expect(Report_dlg.online.receipt.summary.get_tender_title_lbl(pt_lst_from_server[1].id)).toEqual(check_pt + ':');
            }
        )    

        //buydown tax | 1
        Report_dlg.online.receipt.click_col(1,'info');
        expect(Report_dlg.online.receipt.summary.buydown_tax_lbl.getText()).toEqual('$0.04');

        //buydown tax | 0
        Report_dlg.online.receipt.click_col(2,'info');  
        expect(Report_dlg.online.receipt.summary.buydown_tax_lbl.isDisplayed()).toBeFalsy();

        //crv-saving | 1-1
        Report_dlg.online.receipt.click_col(3,'info');
        expect(Report_dlg.online.receipt.summary.crv_lbl.getText()).toEqual('$0.10');
        expect(Report_dlg.online.receipt.summary.saving_lbl.getText()).toEqual('($2.01)');
                        
        //crv-saving | 0-1
        Report_dlg.online.receipt.click_col(4,'info');
        expect(Report_dlg.online.receipt.summary.crv_lbl.isDisplayed()).toBeFalsy();
        expect(Report_dlg.online.receipt.summary.saving_lbl.getText()).toEqual('($2.01)');

        //crv-saving | 1-0
        Report_dlg.online.receipt.click_col(5,'info'); 
        expect(Report_dlg.online.receipt.summary.crv_lbl.getText()).toEqual('$0.10');
        expect(Report_dlg.online.receipt.summary.saving_lbl.isDisplayed()).toBeFalsy();

        //crv-saving | 0-0
        Report_dlg.online.receipt.click_col(6,'info'); 
        expect(Report_dlg.online.receipt.summary.subtotal_derivation_lbl.isDisplayed()).toBeFalsy();

        //clean up
        Report_dlg.exit();
        lib.auth.logout();
    },60000)


    it('has summary section that reflect live payment type name',function(){
        lib.auth.login('1','1');

        //setup blank product (no crv, no deal)
        var product_name_1 = 'product name 1';
        var sku_1 = '111';var price_1 = 1;
        lib.api.insert_new(sku_1,product_name_1,price_1);

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
        Sale_page.visit();

        //payment type
        var cash_amount = 100;
        var pt_0_amount = 20;
        var pt_1_amount = 30;

        Sale_page.scan(sku_1);
        Sale_page.tender();
        browser.wait(function(){ return pt_lst_from_server !== null;/* when it is true, quit waiting */}).then(
            function(){
                Tender_dlg.cash_txt.sendKeys(cash_amount);
                Tender_dlg.set_pt(pt_lst_from_server[0].id,pt_0_amount);
                Tender_dlg.set_pt(pt_lst_from_server[1].id,pt_1_amount);
                Tender_dlg.ok();
            }
        )        
        //check receipt report
        Sale_page.menu_report_receipt();
        expect(Report_dlg.online.receipt.lst.count()).toEqual(1);

        //verify payment type
        Report_dlg.online.receipt.click_col(0,'info');
        browser.sleep(3000);
        browser.wait(function(){
            return pt_lst_from_server !== null;//when it is true, quit waiting
        }).then(
            function(){
                expect(Report_dlg.online.receipt.summary.get_tender_lbl(null)).toEqual(lib.currency(cash_amount));
                expect(Report_dlg.online.receipt.summary.get_tender_lbl(pt_lst_from_server[0].id)).toEqual(lib.currency(pt_0_amount));
                expect(Report_dlg.online.receipt.summary.get_tender_lbl(pt_lst_from_server[1].id)).toEqual(lib.currency(pt_1_amount));

                expect(Report_dlg.online.receipt.summary.get_tender_title_lbl(null)).toEqual('cash:');
                expect(Report_dlg.online.receipt.summary.get_tender_title_lbl(pt_lst_from_server[0].id)).toEqual(credit_card_pt + ':');
                expect(Report_dlg.online.receipt.summary.get_tender_title_lbl(pt_lst_from_server[1].id)).toEqual(check_pt + ':');
            }
        )    

        //change payment type name 
        Report_dlg.exit();
        Sale_page.menu_setting_payment_type();
        var new_check_pt = 'check_';
        Pt_manage_dlg.click_col(0,'edit');
        Pt_prompt_dlg.set_name(new_check_pt);
        Pt_prompt_dlg.ok();
        Pt_manage_dlg.exit();

        //verify new pt
        Sale_page.menu_report_receipt();
        Report_dlg.online.receipt.click_col(0,'info');
        browser.wait(function(){
            return pt_lst_from_server !== null;//when it is true, quit waiting
        }).then(
            function(){
                expect(Report_dlg.online.receipt.summary.get_tender_lbl(null)).toEqual(lib.currency(cash_amount));
                expect(Report_dlg.online.receipt.summary.get_tender_lbl(pt_lst_from_server[0].id)).toEqual(lib.currency(pt_0_amount));
                expect(Report_dlg.online.receipt.summary.get_tender_lbl(pt_lst_from_server[1].id)).toEqual(lib.currency(pt_1_amount));

                expect(Report_dlg.online.receipt.summary.get_tender_title_lbl(null)).toEqual('cash:');
                expect(Report_dlg.online.receipt.summary.get_tender_title_lbl(pt_lst_from_server[0].id)).toEqual(credit_card_pt + ':');
                expect(Report_dlg.online.receipt.summary.get_tender_title_lbl(pt_lst_from_server[1].id)).toEqual(new_check_pt + ':');
            }
        ) 

        //clean up
        Report_dlg.exit();
        lib.auth.logout();
    },60000)
});
