var base_path = './../../../';
var lib = require(base_path + 'lib');


describe('Sp page', function() {
    var Sp_page = require(base_path + 'page/sp/Sp_page.js');
    var Sp_info_dlg = require(base_path + 'page/sp/Sp_info_dlg.js');
    var Sp_prompt_dlg = require(base_path + 'page/sp/Sp_prompt_dlg.js');

    beforeEach(function(){
        lib.auth.login('1','1');
        lib.setup.init_data();
        lib.auth.logout();
    })

    it('can crud sp.main_info',function(){
        //fixture
        var data = {
            name : 'new product name',
            price : 1.1,
            crv : 2.2,
            is_taxable : true,
            cost : 3.3,
            is_sale_report : true,
            p_type : 'my type',
            p_tag : 'my tag',
            vendor : 'my vendor',
            buydown : 4.4,
            value_customer_price : 5.5,
            sku : '111'
        }
        lib.auth.login('1','1');
        lib.api.insert_new(data.sku,'xxx'/*name*/);

        Sp_page.sku_search(data.sku);
        expect(Sp_page.lst.count()).toEqual(1);  
        Sp_page.click_col(0,'info');
        Sp_info_dlg.edit();

        //verify prompt ui
        expect(Sp_prompt_dlg.sku_txt.isDisplayed()).toBeFalsy();

        //verify suggestion
        expect(Sp_prompt_dlg.suggest.main.name_btn.isDisplayed()).toBeFalsy();
        expect(Sp_prompt_dlg.suggest.main.price_btn.isDisplayed()).toBeFalsy();
        expect(Sp_prompt_dlg.suggest.main.crv_btn.isDisplayed()).toBeFalsy();
        expect(Sp_prompt_dlg.suggest.main.cost_btn.isDisplayed()).toBeFalsy();
        expect(Sp_prompt_dlg.suggest.main.is_taxable_btn.isDisplayed()).toBeFalsy();


        //fillout & submit form
        Sp_prompt_dlg.set_name(data.name);
        Sp_prompt_dlg.set_price(data.price);
        Sp_prompt_dlg.set_crv(data.crv);
        Sp_prompt_dlg.set_is_taxable(data.is_taxable);
        Sp_prompt_dlg.set_cost(data.cost);
        Sp_prompt_dlg.set_is_sale_report(data.is_sale_report);
        Sp_prompt_dlg.set_p_type(data.p_type);
        Sp_prompt_dlg.set_p_tag(data.p_tag);
        Sp_prompt_dlg.set_vendor(data.vendor);
        Sp_prompt_dlg.set_buydown(data.buydown);
        Sp_prompt_dlg.set_value_customer_price(data.value_customer_price); 

        //verify new created product
        Sp_prompt_dlg.ok();
        Sp_info_dlg.exit();
        expect(Sp_page.lst.count()).toEqual(1);

        expect(Sp_page.get_col(0,'name')).toEqual(data.name);
        expect(Sp_page.get_col(0,'price')).toEqual(lib.currency(data.price));
        expect(Sp_page.get_col(0,'crv')).toEqual(lib.currency(data.crv));
        expect(Sp_page.get_col(0,'is_taxable')).toEqual(data.is_taxable);
        expect(Sp_page.get_col(0,'cost')).toEqual(lib.currency(data.cost));
        expect(Sp_page.get_col(0,'is_sale_report')).toEqual(data.is_sale_report);
        expect(Sp_page.get_col(0,'p_type')).toEqual(data.p_type);
        expect(Sp_page.get_col(0,'p_tag')).toEqual(data.p_tag);
        expect(Sp_page.get_col(0,'vendor')).toEqual(data.vendor);
        expect(Sp_page.get_col(0,'buydown')).toEqual(lib.currency(data.buydown));
        expect(Sp_page.get_col(0,'value_customer_price')).toEqual(lib.currency(data.value_customer_price));

        //clean up
        lib.auth.logout();
    })
});