var base_path = './../../'
var lib = require(base_path + 'lib');


describe('sp prompt dialog', function() {
    var Sp_page = require(base_path + 'page/sp/Sp_page.js');
    var Sp_prompt_dlg = require(base_path + 'page/sp/Sp_prompt_dlg.js');
    var Sp_search_single_dlg = require(base_path + 'page/sp/search/Single_dlg.js');

    beforeEach(function(){
        lib.auth.login('1','1');
        lib.setup.init_data();
        lib.auth.logout();
    })

    it('can pull suggest info from a product when creating new sp',function(){
        lib.auth.login('1','1');

        //insert sp
        var sku_1 = '111';
        var name_1 = 'product 1';
        var price_1 = 1.1;
        var crv_1 = 2.2;
        var is_taxable_1 = true;
        var cost_1 = 3.3;
        var is_sale_report_1 = false;
        var p_type_1 = 'type';
        var p_tag_1 = 'tag';
        var vendor_1 = 'vendor';
        var buydown_1 = '0.01';    
        var value_customer_price_1 = 0.5;
        lib.api.insert_new(sku_1,name_1,price_1,value_customer_price_1,crv_1,is_taxable_1,is_sale_report_1,p_type_1,p_type_1,cost_1,vendor_1,buydown_1);

        //create product 2
        var sku_2 = '222'
        Sp_page.sku_search(sku_2);
        Sp_prompt_dlg.duplicate_from();
        Sp_search_single_dlg.search(name_1);
        Sp_search_single_dlg.click_col(0,'select')

        //verify suggestion
        expect(Sp_prompt_dlg.get_name()).toEqual(name_1);

    })
});