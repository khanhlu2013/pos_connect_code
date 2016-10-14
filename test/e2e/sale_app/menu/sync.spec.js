var base_path = './../../';
var lib = require(base_path + 'lib');

describe('sale page -> menu -> sync', function() {

    var Payment_type_manage_dlg = require(base_path + 'page/payment_type/Manage_dlg.js');
    var Sale_page = require(base_path + 'page/sale/Sale_page.js');
    var Alert_dlg = require(base_path + 'page/ui/Alert_dlg.js');
    var Tender_dlg = require(base_path + 'page/sale/Tender_dlg.js')

    beforeEach(function(){
        lib.auth.login('1','1');
        lib.setup.init_data();
        lib.auth.logout();
    })

    it('can display the number of receipt synced',function(){
        lib.auth.login('1','1');
        var sku = 111;var name = 'product 1';var price = 1;
        lib.api.insert_new(sku,name,price);     
        Sale_page.visit();

        //verify there is no pt beside the default cash
        Sale_page.scan(sku);lib.wait_for_block_ui();
        Sale_page.tender();
        Tender_dlg.ok();

        Sale_page.menu_action_sync();
        lib.wait_for_block_ui();
        expect(Alert_dlg.message_lbl.getText()).toEqual('receipt: 1, update product:0, total product:2');
    },60000/*60 second timeout*/)

    it('can update global setting',function(){
        lib.auth.login('1','1');
        Sale_page.visit();
        var payment_type = 'credit card'
        var inserted = false;
        lib.api_pt.insert_lst([payment_type,]).then(
            function(){
                inserted = true;
            }
        )

        browser.wait(function(){
            return inserted;
        }).then(
            function(){
                Sale_page.menu_action_sync();
                Alert_dlg.ok();
                Sale_page.menu_setting_payment_type();
                expect(Payment_type_manage_dlg.lst.count()).toEqual(1);
            }
        )
        

    },60000/*60 second timeout*/)    
});