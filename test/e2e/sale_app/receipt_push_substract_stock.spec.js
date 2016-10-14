var base_path = './../';
var lib = require(base_path + 'lib');

describe('receipt push', function() {
    var Sale_page = require(base_path + 'page/sale/Sale_page');
    var Sp_page = require(base_path + 'page/sp/Sp_page');
    var Tender_dlg = require(base_path + 'page/sale/Tender_dlg');
    var Alert_dlg = require(base_path + 'page/ui/Alert_dlg');

    beforeEach(function(){
        lib.auth.login('1','1');
        lib.setup.init_data();
        lib.auth.logout();
    })
    
    it('can subtract cur_stock',function(){
        lib.auth.login('1','1');

        var product_name_1 = 'a';var sku_1 = '111';var price_1 = 1;
        lib.api.insert_new(sku_1,product_name_1,price_1);
        var product_name_2 = 'aa';var sku_2 = '222';var price_2 = 2;
        lib.api.insert_new(sku_2,product_name_2,price_2);

        Sale_page.visit();
        Sale_page.scan(sku_1);
        Sale_page.scan('2 ' + sku_2);
        Sale_page.tender()
        Tender_dlg.ok()
        Sale_page.menu_action_sync();
        Alert_dlg.ok();

        //------------
        //verify stock
        //------------
        Sp_page.visit();
        Sp_page.name_search('a');
        expect(Sp_page.lst.count()).toEqual(2);
        expect(Sp_page.get_col(0,'stock')).toEqual('-1')
        expect(Sp_page.get_col(1,'stock')).toEqual('-2')
    });
});