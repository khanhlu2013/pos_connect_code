var base_path = './../'
var lib = require(base_path + 'lib');

describe('Receipt pusher', function() {
    var Sale_page = require(base_path + 'page/sale/Sale_page');
    var Ui_confirm_dlg = require(base_path + 'page/ui/Confirm_dlg.js');
    var Sp_prompt_dlg = require(base_path + 'page/sp/Sp_prompt_dlg.js');
    var Report_dlg = require(base_path + 'page/receipt/Report_dlg.js');
    
    var Sale_able_info_dlg = require(base_path + 'page/sale/Sale_able_info_dlg.js');
    var Tender_dlg = require(base_path + 'page/sale/Tender_dlg.js');
    var Sp_page = require(base_path + 'page/sp/Sp_page');
    var Pt_manage_dlg = require(base_path + 'page/payment_type/Manage_dlg.js');
    var Pt_prompt_dlg = require(base_path + 'page/payment_type/Prompt_dlg.js');

    beforeEach(function(){
        lib.auth.login('1','1');
        lib.setup.init_data();
        lib.auth.logout();
    })
    
    it('can push receipt with differnt pt,offline_create_product,deal product',function(){
        lib.auth.login('1','1');

        //setup pt list
        var cash_amount = 100;
        var pt_0_amount = 20;
        var pt_1_amount = 30;        
        var credit_card_pt = 'credit card';
        var check_pt = 'check';
        var pt_lst_from_server = null;
        lib.api_pt.insert_lst([credit_card_pt,check_pt])
        .then(
             function(pt_lst){ pt_lst_from_server = pt_lst; expect(pt_lst_from_server.length).toEqual(2);} 
            ,function(reason){ expect(true).toEqual(false); }
        );

        //create mm deal product
        var deal_product = 'deal product';
        var deal_sku = '333';var deal_price = 2;var deal_qty = 9;
        var _5_deal_name = "5 items deal";var _5_deal_price = 5; var _5_deal_is_include = false; _5_deal_qty = 5;
        var _3_deal_name = "3 items deal";var _3_deal_price = 4; var _3_deal_is_include = false; _3_deal_qty = 3;
        lib.api.insert_new(deal_sku,deal_product,deal_price)
        .then(function(sp){
            lib.api.insert_mm(_5_deal_name,_5_deal_price,_5_deal_is_include,_5_deal_qty,[sp],false);
            lib.api.insert_mm(_3_deal_name,_3_deal_price,_3_deal_is_include,_3_deal_qty,[sp],false);
        });

        Sale_page.visit(true/*is_offline*/);
        //create offline product
        var offline_name = 'offline product'
        var offline_sku = '222';
        var offline_price = 12.34;
        var offline_value_customer_price = 11.23;
        var offline_crv = 1.2;
        var offline_is_taxable = true;
        var offline_is_sale_report = false;
        var offline_p_type = 'p type';
        var offline_p_tag = 'p tag';
        var offline_cost = 7.21;
        var offline_vendor = 'vendor';
        var offline_buydown = 0.45;
        Sale_page.scan(offline_sku);
        Ui_confirm_dlg.ok();//confirm that product will be create offline
        browser.sleep(3000);
        Sp_prompt_dlg.set_name(offline_name);
        Sp_prompt_dlg.set_price(offline_price);
        Sp_prompt_dlg.set_value_customer_price(offline_value_customer_price);
        Sp_prompt_dlg.set_crv(offline_crv);
        Sp_prompt_dlg.set_is_taxable(offline_is_taxable);
        Sp_prompt_dlg.set_is_sale_report(offline_is_sale_report);
        Sp_prompt_dlg.set_p_type(offline_p_type);
        Sp_prompt_dlg.set_p_tag(offline_p_tag);
        Sp_prompt_dlg.set_cost(offline_cost);
        Sp_prompt_dlg.set_vendor(offline_vendor);
        Sp_prompt_dlg.set_buydown(offline_buydown);
        Sp_prompt_dlg.ok();

        //deal product
        Sale_page.scan(deal_qty + ' ' + deal_sku);

        //rescan offline product again
        Sale_page.scan(offline_sku);

        //finalize sale
        Sale_page.visit(false);        
        Sale_page.tender();
        browser.wait(function(){
            return pt_lst_from_server !== null;//when it is true, quit waiting
        }).then(
            function(){
                Tender_dlg.cash_txt.sendKeys(cash_amount);
                element(by.id('sale_app/service/tender_ui/pt_txt/' + pt_lst_from_server[0].id)).sendKeys(pt_0_amount);
                element(by.id('sale_app/service/tender_ui/pt_txt/' + pt_lst_from_server[1].id)).sendKeys(pt_1_amount);
                Tender_dlg.ok();
            }
        );

        //push receipt
        Sale_page.menu_report_receipt();
        expect(Report_dlg.online.receipt.lst.count()).toEqual(1);
        
        expect(Report_dlg.online.receipt.get_col(0,'total')).toEqual('$39.53');
        Report_dlg.online.receipt.click_col(0,'info');
        expect(Report_dlg.online.receipt_ln.lst.count()).toEqual(5);

        expect(Report_dlg.online.receipt_ln.get_col(0,'qty')).toEqual('1');
        expect(Report_dlg.online.receipt_ln.get_col(0,'product')).toEqual(offline_name);
        expect(Report_dlg.online.receipt_ln.get_col(0,'price')).toEqual('$11.89');

        // expect(Report_dlg.online.receipt_ln.get_col(1,'qty')).toEqual('1');
        // expect(Report_dlg.online.receipt_ln.get_col(1,'product')).toEqual(deal_product);
        // expect(Report_dlg.online.receipt_ln.get_col(1,'price')).toEqual('$2.00');

        // expect(Report_dlg.online.receipt_ln.get_col(2,'qty')).toEqual('3');
        // expect(Report_dlg.online.receipt_ln.get_col(2,'product')).toEqual(deal_product);
        // expect(Report_dlg.online.receipt_ln.get_col(2,'price')).toEqual('$1.33');

        // expect(Report_dlg.online.receipt_ln.get_col(3,'qty')).toEqual('5');
        // expect(Report_dlg.online.receipt_ln.get_col(3,'product')).toEqual(deal_product);
        // expect(Report_dlg.online.receipt_ln.get_col(3,'price')).toEqual('$1.00');

        expect(Report_dlg.online.receipt_ln.get_col(4,'qty')).toEqual('1');
        expect(Report_dlg.online.receipt_ln.get_col(4,'product')).toEqual(offline_name);
        expect(Report_dlg.online.receipt_ln.get_col(4,'price')).toEqual('$11.89');

        //verify summary
        expect(Report_dlg.online.receipt.summary.saving_lbl.getText()).toEqual('($7.91)');
        expect(Report_dlg.online.receipt.summary.crv_lbl.getText()).toEqual('$2.40');
        expect(Report_dlg.online.receipt.summary.buydown_tax_lbl.getText()).toEqual('$0.08');        
        expect(Report_dlg.online.receipt.summary.change_lbl.getText()).toEqual('$110.47');

        //verify pt
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

        //clean up
        Report_dlg.exit();
        lib.auth.logout();
    },60000)

});
