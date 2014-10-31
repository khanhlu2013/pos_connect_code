var base_path = './../';
var lib = require(base_path + 'lib');

describe('sale_app', function() {
    var Ui_prompt_dlg = require(base_path + 'page/ui/Prompt_dlg.js');
    var Sale_page = require(base_path + 'page/sale/Sale_page')
    var Receipt_dlg = require(base_path + 'page/receipt/Report_dlg');
    var Sale_able_info_dlg = require(base_path + 'page/sale/Sale_able_info_dlg');
    var Tender_dlg = require(base_path + 'page/sale/Tender_dlg');

    beforeEach(function(){
        lib.auth.login('1','1');
        lib.setup.init_data();
        lib.auth.logout();
    })
    
    it('can record receipt data offline: different payment type, and different kind of receipt_ln such as override_price item, deal item, non_inventory item',function(){
        lib.auth.login('1','1');

        //setup override price item
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

        //test sale finalizer and receipt report data
        Sale_page.visit();

        //setup and override price item
        Sale_page.scan(sku_1);
        Sale_page.click_col(0,'price');
        Sale_able_info_dlg.override_price();
        Ui_prompt_dlg.set_prompt(override_price_1);
        Ui_prompt_dlg.ok();
        Sale_able_info_dlg.ok();

        //setup mm_deal item
        Sale_page.scan(qty_2 + ' ' + sku_2)
        
        //setup non_inventory
        Sale_page.non_inventory();
        Ui_prompt_dlg.set_prompt('1.23');
        Ui_prompt_dlg.ok(); 
        
        //finalize sale
        expect(Sale_page.lst.count()).toEqual(5);  
        expect(Sale_page.tender_btn.getText()).toEqual('$12.72');
        Sale_page.tender();

        browser.wait(function(){
            return pt_lst_from_server !== null;//when it is true, quit waiting
        }).then(
            function(){
                Tender_dlg.cash_txt.sendKeys('10');
                element(by.id('sale_app/service/tender_ui/pt_txt/' + pt_lst_from_server[0].id)).sendKeys('20');
                element(by.id('sale_app/service/tender_ui/pt_txt/' + pt_lst_from_server[1].id)).sendKeys('30');
                Tender_dlg.ok();
            }
        )        

        //check receipt report
        Sale_page.menu_report_receipt();
        expect(Receipt_dlg.offline.receipt.lst.count()).toEqual(1);
        expect(Receipt_dlg.offline.receipt.get_col(0,'total')).toEqual('$12.72');
        Receipt_dlg.offline.receipt.click_col(0,'info');
        expect(Receipt_dlg.offline.receipt_ln.lst.count()).toEqual(5);

        //verify receipt ln
        expect(Receipt_dlg.offline.receipt_ln.get_col(0,'qty')).toEqual('1');
        expect(Receipt_dlg.offline.receipt_ln.get_col(0,'product')).toEqual(product_name_1);
        expect(Receipt_dlg.offline.receipt_ln.get_col(0,'price')).toEqual('$0.50');

        expect(Receipt_dlg.offline.receipt_ln.get_col(1,'qty')).toEqual('5');
        expect(Receipt_dlg.offline.receipt_ln.get_col(1,'product')).toEqual(product_name_2);
        expect(Receipt_dlg.offline.receipt_ln.get_col(1,'price')).toEqual('$1.00');

        expect(Receipt_dlg.offline.receipt_ln.get_col(2,'qty')).toEqual('3');
        expect(Receipt_dlg.offline.receipt_ln.get_col(2,'product')).toEqual(product_name_2);
        expect(Receipt_dlg.offline.receipt_ln.get_col(2,'price')).toEqual('$1.33');

        expect(Receipt_dlg.offline.receipt_ln.get_col(3,'qty')).toEqual('1');
        expect(Receipt_dlg.offline.receipt_ln.get_col(3,'product')).toEqual(product_name_2);
        expect(Receipt_dlg.offline.receipt_ln.get_col(3,'price')).toEqual('$2.00');

        expect(Receipt_dlg.offline.receipt_ln.get_col(4,'qty')).toEqual('1');
        expect(Receipt_dlg.offline.receipt_ln.get_col(4,'product')).toEqual('non_inventory');
        expect(Receipt_dlg.offline.receipt_ln.get_col(4,'price')).toEqual('$1.23');

        Receipt_dlg.exit();
        lib.auth.logout();
    });
});