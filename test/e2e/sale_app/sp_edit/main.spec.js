var base_path = './../../'
var lib = require(base_path + 'lib');

describe('sale page \'s scan table ', function() {
    var Sp_prompt_dlg = require(base_path + 'page/sp/Sp_prompt_dlg.js');
    var Sp_info_dlg = require(base_path + 'page/sp/Sp_info_dlg.js');
    var Sale_page = require(base_path + 'page/sale/Sale_page.js');

    beforeEach(function(){
        lib.auth.login('1','1');
        lib.setup.init_data();
        lib.auth.logout();
    })

    it('can edit product main info',function(){
        lib.auth.login('1','1');

        //create product 1
        var sku_1 = '111';var name_1 = 'product name 1';
        lib.api.insert_new(sku_1,name_1);

        //create product 2
        var sku_2 = '222';var product_name_2 = 'product name 2';
        lib.api.insert_new(sku_2,product_name_2);

        Sale_page.visit();             
        Sale_page.scan(sku_1);lib.wait_for_block_ui();

        //edit sp 1
        Sale_page.click_col(0,'name');
        Sp_info_dlg.edit();

        //edit data        
        var _name_1 = 'product name 1 _';
        var _price_1 = 1.1;
        var _val_cus_price_1 = 0.9;
        var _crv_1 = 0.5;
        var _is_taxable_1 = false;
        var _is_sale_report_1 = true;
        var _p_type_1 = 'p type _';
        var _p_tag_1 = 'p tag _';
        var _cost_1 = 0.3;
        var _vendor_1 = 'vendor _';
        var _buydown_1 = 0.2;

        //fill out edit data
        Sp_prompt_dlg.set_name(_name_1);
        Sp_prompt_dlg.set_price(_price_1);
        Sp_prompt_dlg.set_crv(_crv_1);
        Sp_prompt_dlg.set_is_taxable(_is_taxable_1);
        Sp_prompt_dlg.set_cost(_cost_1);
        Sp_prompt_dlg.set_is_sale_report(_is_sale_report_1);
        Sp_prompt_dlg.set_p_type(_p_type_1);
        Sp_prompt_dlg.set_p_tag(_p_tag_1);
        Sp_prompt_dlg.set_vendor(_vendor_1);
        Sp_prompt_dlg.set_buydown(_buydown_1);
        Sp_prompt_dlg.set_value_customer_price(_val_cus_price_1);

        //saved edit data
        Sp_prompt_dlg.ok();
        Sp_info_dlg.exit();

        //verify edit sp on sale page
        Sale_page.click_col(0,'name');
        Sp_info_dlg.edit();
        expect(Sp_prompt_dlg.get_name()).toEqual(_name_1);
        expect(Sp_prompt_dlg.get_price()).toEqual(_price_1.toString());
        expect(Sp_prompt_dlg.get_crv()).toEqual(_crv_1.toString());
        expect(Sp_prompt_dlg.get_is_taxable()).toEqual(_is_taxable_1);
        expect(Sp_prompt_dlg.get_cost()).toEqual(_cost_1.toString());
        expect(Sp_prompt_dlg.get_is_sale_report()).toEqual(_is_sale_report_1);
        expect(Sp_prompt_dlg.get_p_type()).toEqual(_p_type_1);
        expect(Sp_prompt_dlg.get_p_tag()).toEqual(_p_tag_1);
        expect(Sp_prompt_dlg.get_vendor()).toEqual(_vendor_1);
        expect(Sp_prompt_dlg.get_buydown()).toEqual(_buydown_1.toString());
        expect(Sp_prompt_dlg.get_value_customer_price()).toEqual(_val_cus_price_1.toString());

        //clean up
        Sp_prompt_dlg.cancel();
        Sp_info_dlg.exit();        
        Sale_page.void();   
        lib.auth.logout();
    })
});