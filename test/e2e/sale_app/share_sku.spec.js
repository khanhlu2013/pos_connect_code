var base_path = './../';
var lib = require(base_path + 'lib');

describe('sale page scan', function() {
    var Sale_page = require(base_path + 'page/sale/Sale_page');
    var Tender_dlg = require(base_path + 'page/sale/Tender_dlg');
    var Select_sp_dlg = require(base_path + 'page/sp/Select_sp_dlg');

    beforeEach(function(){
        lib.auth.login('1','1');
        lib.setup.init_data();
        lib.auth.logout();
    })
    
    it('can handle share sku product',function(){

        //-----------------------------------
        // fixture: insert 2 sp with same sku
        //-----------------------------------
        lib.auth.login('1','1');
        var sku = '111';
        var product_name_1 = 'a';var price_1 = 1;
        lib.api.insert_new(sku,product_name_1,price_1);
        var product_name_2 = 'aa';var price_2 = 2;
        lib.api.insert_new(sku,product_name_2,price_2);

        //-----------------------------------------------
        // verify select sp is popup and we can select sp
        //-----------------------------------------------
        Sale_page.visit();
        Sale_page.scan(sku);
        expect(Select_sp_dlg.lst.count()).toEqual(2);
        Select_sp_dlg.click_col(0,'select');
        expect(Sale_page.tender_btn.getText()).toEqual(lib.currency(price_1));

        //---------
        // clean up
        //---------
        Sale_page.void();
    });
});