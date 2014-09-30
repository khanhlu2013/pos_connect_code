var base_path = './../'
var lib = require(base_path + 'lib');

describe('sale page', function() {

    var Ui_confirm_dlg = require(base_path + 'page/ui/Confirm_dlg');
    var Sp_prompt_dlg = require(base_path + 'page/sp/Sp_prompt_dlg.js');
    var Sale_page = require(base_path + 'page/sale/Sale_page.js');

    beforeEach(function(){
        lib.auth.login('1','1');
        lib.setup.init_data();
        lib.auth.logout();
    })

    it('can create and edit offline product',function(){
        lib.auth.login('1','1');
        Sale_page.visit(true/*is_offline*/);
        
        //scan
        var sku = '123';
        Sale_page.scan(sku);

        //confirm offline message
        expect(Ui_confirm_dlg.self.isPresent()).toBeTruthy();   
        Ui_confirm_dlg.ok();

        //fill out form
        var name = 'offline product';
        var price = 5.43;
        var crv = 0.12;
        var is_taxable = false;
        var cost = 4.31;
        var is_sale_report = true;
        var p_type = 'type';
        var p_tag = 'tag';
        var vendor = 'vendor';
        var buydown = 1.23;
        var value_customer_price = 4.11;

        Sp_prompt_dlg.set_name(name);
        Sp_prompt_dlg.set_price(price);
        Sp_prompt_dlg.set_crv(crv);
        Sp_prompt_dlg.set_is_taxable(is_taxable);
        Sp_prompt_dlg.set_cost(cost);
        Sp_prompt_dlg.set_is_sale_report(is_sale_report);
        Sp_prompt_dlg.set_p_type(p_type);
        Sp_prompt_dlg.set_p_tag(p_tag);
        Sp_prompt_dlg.set_vendor(vendor);
        Sp_prompt_dlg.set_buydown(buydown);
        Sp_prompt_dlg.set_value_customer_price(value_customer_price);
        expect(Sp_prompt_dlg.get_sku()).toEqual(sku);
        Sp_prompt_dlg.ok();
        // browser.sleep(2000);
        
        expect(Sale_page.lst.count()).toEqual(1);
        expect(Sale_page.tender_btn.getText()).toEqual('$4.32');

        //attemp to edit this product offline
        Sale_page.click_col(0,'name');

        //verify edit prefill
        expect(Sp_prompt_dlg.get_name()).toEqual(name);
        expect(Sp_prompt_dlg.get_price()).toEqual(price.toString());
        expect(Sp_prompt_dlg.get_crv()).toEqual(crv.toString());
        expect(Sp_prompt_dlg.get_is_taxable()).toEqual(is_taxable);
        expect(Sp_prompt_dlg.get_cost()).toEqual(cost.toString());
        expect(Sp_prompt_dlg.get_is_sale_report()).toEqual(is_sale_report);
        expect(Sp_prompt_dlg.get_p_type()).toEqual(p_type);
        expect(Sp_prompt_dlg.get_p_tag()).toEqual(p_tag);
        expect(Sp_prompt_dlg.get_vendor()).toEqual(vendor.toString());
        expect(Sp_prompt_dlg.get_buydown()).toEqual(buydown.toString());
        expect(Sp_prompt_dlg.get_value_customer_price()).toEqual(value_customer_price.toString());

        //edit data
        name = 'offline product_';
        price = 7.42;
        crv = 1.31;
        is_taxable = true;
        cost = 4.21;
        is_sale_report = false;
        p_type = 'type_';
        p_tag = 'tag_';
        vendor = 'vendor_';
        buydown = 0.21;
        value_customer_price = 4.13;

        Sp_prompt_dlg.set_name(name);
        Sp_prompt_dlg.set_price(price);
        Sp_prompt_dlg.set_crv(crv);
        Sp_prompt_dlg.set_is_taxable(is_taxable);
        Sp_prompt_dlg.set_cost(cost);
        Sp_prompt_dlg.set_is_sale_report(is_sale_report);
        Sp_prompt_dlg.set_p_type(p_type);
        Sp_prompt_dlg.set_p_tag(p_tag);
        Sp_prompt_dlg.set_vendor(vendor);
        Sp_prompt_dlg.set_buydown(buydown);
        Sp_prompt_dlg.set_value_customer_price(value_customer_price);
        Sp_prompt_dlg.ok();
        // browser.sleep(2000);

        expect(Sale_page.lst.count()).toEqual(1);
        expect(Sale_page.tender_btn.getText()).toEqual('$9.28');      

        //come back to verify edit is success
        Sale_page.click_col(0,'name');  
        
        expect(Sp_prompt_dlg.get_name()).toEqual(name);
        expect(Sp_prompt_dlg.get_price()).toEqual(price.toString());
        expect(Sp_prompt_dlg.get_crv()).toEqual(crv.toString());
        expect(Sp_prompt_dlg.get_is_taxable()).toEqual(is_taxable);
        expect(Sp_prompt_dlg.get_cost()).toEqual(cost.toString());
        expect(Sp_prompt_dlg.get_is_sale_report()).toEqual(is_sale_report);
        expect(Sp_prompt_dlg.get_p_type()).toEqual(p_type);
        expect(Sp_prompt_dlg.get_p_tag()).toEqual(p_tag);
        expect(Sp_prompt_dlg.get_vendor()).toEqual(vendor.toString());
        expect(Sp_prompt_dlg.get_buydown()).toEqual(buydown.toString());
        expect(Sp_prompt_dlg.get_value_customer_price()).toEqual(value_customer_price.toString());
        Sp_prompt_dlg.cancel();

        //clean up
        Sale_page.void();
        lib.auth.logout();
    },60000);
});