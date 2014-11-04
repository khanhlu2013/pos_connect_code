var base_path = './../';
var lib = require(base_path + 'lib');

describe('sale page', function() {
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
    
    it('can can display tender, and change amount',function(){
        lib.auth.login('1','1');

        //setup override price item
        var product_name_1 = 'product name 1';
        var sku_1 = '111';var price_1 = 1;
        lib.api.insert_new(sku_1,product_name_1,price_1);

        //test sale finalizer and receipt report data
        Sale_page.visit();

        //setup and override price item
        expect(Sale_page.change_btn.isDisplayed()).toEqual(false);
        Sale_page.scan(sku_1);
        Sale_page.tender();
        Tender_dlg.cash_txt.sendKeys('10');
        Tender_dlg.ok();
        expect(Sale_page.change_btn.getText()).toEqual('change: ' + lib.currency(9))

        //change button disapear
        Sale_page.scan(sku_1);
        lib.wait_for_block_ui();
        expect(Sale_page.change_btn.isDisplayed()).toEqual(false);

        //clean up
        Sale_page.void();
    });
});