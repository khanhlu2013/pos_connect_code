var base_path = './../'
var lib = require(base_path + 'lib');

describe('Sale report', function() {
    var Sale_page = require(base_path + 'page/sale/Sale_page');
    var Tender_dlg = require(base_path + 'page/sale/Tender_dlg.js');
    var Report_dlg = require(base_path + 'page/report/Sale_report_dlg.js');

    beforeEach(function(){
        lib.auth.login('1','1');
        lib.setup.init_data();
        lib.auth.logout();
    })


    it('can pull report for date range',function(){
        //-----------------
        // insert a product
        //-----------------
        lib.auth.login('1','1');
        var sku = '111';var price = 1;
        lib.api.insert_new(sku,'product name',price);

        //-----------------
        // making 1 receipt
        //-----------------
        var _1_qty = 1; var _2_qty = 2; var _3_qty = 3;
        Sale_page.visit();

        Sale_page.scan(_1_qty + ' ' + sku);
        Sale_page.tender();
        Tender_dlg.ok();

        //-----------------------
        // test today sale report
        //-----------------------
        Sale_page.menu_report_sale();
        Report_dlg.refresh_today_report();
        expect(Report_dlg.type_tag_report_lst.count()).toEqual(2);
    })
});
