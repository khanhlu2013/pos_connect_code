var base_path = './../'
var lib = require(base_path + 'lib');

describe('sale page init db on load', function() {
    var Sale_page = require(base_path + 'page/sale/Sale_page');
    var Report_dlg = require(base_path + 'page/receipt/Report_dlg.js');
    var Tender_dlg = require(base_path + 'page/sale/Tender_dlg.js');

    beforeEach(function(){
        lib.auth.login('1','1');
        lib.setup.init_data();
        lib.auth.logout();
    })
    
    it('can push receipt',function(){
        lib.auth.login('1','1');

        var product_name = 'product name 1';
        var sku = '111';var price = 1;
        lib.api.insert_new(sku,product_name,price);        

        Sale_page.visit();
        Sale_page.scan(sku);
        Sale_page.tender();
        Tender_dlg.ok();

        Sale_page.visit();//this visit will push receipt up

        Sale_page.visit(true);//this visit we will go to receipt to view offline receipt and expect to see none since it is already push up
        Sale_page.menu_report_receipt();
        expect(Report_dlg.online.receipt.lst.count()).toEqual(0);
    })

});
