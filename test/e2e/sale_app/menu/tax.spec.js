var base_path = './../../';
var lib = require(base_path + 'lib');

describe('sale app menu -> setting -> tax', function() {
    var Sale_page = require(base_path + 'page/sale/Sale_page');
    var Report_dlg = require(base_path + 'page/report/Receipt_report_dlg.js');
    var Tender_dlg = require(base_path + 'page/sale/Tender_dlg.js');
    var Pt_manage_dlg = require(base_path + 'page/payment_type/Manage_dlg.js');
    var Pt_prompt_dlg = require(base_path + 'page/payment_type/Prompt_dlg.js');
    var Alert_dlg = require(base_path + 'page/ui/Alert_dlg.js');
    var Prompt_dlg = require(base_path + 'page/ui/Prompt_dlg.js');

    beforeEach(function(){
        lib.auth.login('1','1');
        lib.setup.init_data();
        lib.auth.logout();
    })

    it('can change cur ds total due',function(){
        lib.auth.login('1','1');

        //setup product
        var product_name = 'product name 1';
        var sku = '111';var price = 1;
        lib.api.insert_new(sku,product_name,price,null/*value customer price*/,null/*crv*/,true/*is_taxable*/);

        //initial scan
        Sale_page.visit();
        Sale_page.scan(sku);
        expect(Sale_page.tender_btn.getText()).toEqual('$1.09');

        //---------------
        //CHANGE TAX RATE
        //---------------
        var new_tax_rate = 20;
        Sale_page.menu_setting_tax();
        Prompt_dlg.set_prompt(20);
        Prompt_dlg.ok();

        expect(Sale_page.tender_btn.getText()).toEqual('$1.20');
        Sale_page.void();
    })
});
