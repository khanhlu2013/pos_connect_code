var base_path = './../'
var lib = require(base_path + 'lib');

describe('receipt_app\'s Report dialog', function() {
    var Sale_page = require(base_path + 'page/sale/Sale_page');
    var Report_dlg = require(base_path + 'page/receipt/Report_dlg.js');
    var Tender_dlg = require(base_path + 'page/sale/Tender_dlg.js');
    var Sp_page = require(base_path + 'page/sp/Sp_page');
    var Alert_page = require(base_path + 'page/ui/Alert_dlg.js');

    beforeEach(function(){
        lib.auth.login('1','1');
        lib.setup.init_data();
        lib.auth.logout();
    })
    
    it('display offline receipt when internet is disconnected',function(){
        lib.auth.login('1','1');

        //deal_crv_buydown_buydonwtax <-> 0_0_0_0
        var product_name_1 = 'product name 1';
        var sku_1 = '111';var price_1 = 1;
        lib.api.insert_new(sku_1,product_name_1,price_1);

        Sale_page.visit(true);
        Sale_page.scan(sku_1);
        lib.wait_for_block_ui();
        Sale_page.tender();
        Tender_dlg.cash_txt.sendKeys('100');
        Tender_dlg.ok();

        //test report
        Sale_page.menu_report_receipt();
        lib.wait_for_block_ui();
        expect(Alert_page.message_lbl.getText()).toEqual('internet is disconnected. you can only access to offline receipt');
        Alert_page.ok();
        expect(Report_dlg.online.receipt.lst.count()).toEqual(1);
        expect(Report_dlg.control_panel.isPresent()).toBeFalsy();
        
        //clean up
        Report_dlg.exit();
        lib.auth.logout();
    },60000)
});
