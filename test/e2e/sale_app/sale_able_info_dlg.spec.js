var base_path = './../';
var lib = require(base_path + 'lib');

describe('sale page\'s Sale_able_info_dlg', function() {
    
    var Sale_able_info_dlg = require(base_path + 'page/sale/Sale_able_info_dlg.js');
    var Sale_page = require(base_path + 'page/sale/Sale_page.js');
    var Non_inventory_prompt_dlg = require(base_path + 'page/sp/Non_inventory_prompt_dlg.js');

    beforeEach(function(){
        lib.auth.login('1','1');
        lib.setup.init_data();
        lib.auth.logout();
    })

    it('can display info',function(){
        lib.auth.login('1','1');

        //deal_crv_buydown_buydonwtax <-> 0_0_0_0
        var product_name_1 = 'product name 1';
        var sku_1 = '111';var price_1 = 1;
        lib.api.insert_new(sku_1,product_name_1,price_1);

        //deal_crv_buydown_buydonwtax <-> 1_0_0_0
        var product_name_2 = 'product name 2';
        var sku_2 = '222';var price_2 = 2;var qty_2 = 3;
        var _3_deal_name = "3 items deal";var _3_deal_price = 4; var _3_deal_is_include = false; _3_deal_qty = 3;
        lib.api.insert_new(sku_2,product_name_2,price_2)
        .then(function(sp){
            lib.api.insert_mm(_3_deal_name,_3_deal_price,_3_deal_is_include,_3_deal_qty,[sp],false);
        })

        //deal_crv_buydown_buydonwtax <-> 0_1_0_0
        var product_name_3 = 'product name 3';
        var sku_3 = '333';var price_3 = 3; var crv_3 = 0.1;
        lib.api.insert_new(sku_3,product_name_3,price_3,null/*val_cus_price*/,crv_3,false/*is_taxable*/,false/*is_sale_report*/,null/*p_type*/,null/*p_tag*/,null/*cost*/,null/*vendor*/,null/*buydown*/);

        //deal_crv_buydown_buydonwtax <-> 0_0_1_1
        var product_name_4 = 'product name 4';
        var sku_4 = '444';var price_4 = 4;var buydown_4 = 0.5;
        lib.api.insert_new(sku_4,product_name_4,price_4,null/*val_cus_price*/,null/*crv*/,true/*is_taxable*/,false/*is_sale_report*/,null/*p_type*/,null/*p_tag*/,null/*cost*/,null/*vendor*/,buydown_4);

        //test sale finalizer and receipt report data
        Sale_page.visit();

        //deal_crv_buydown_buydonwtax <-> 0_0_0_0
        Sale_page.scan(sku_1);
        Sale_page.click_col(0,'price');
        expect(Sale_able_info_dlg.preset_price_lbl.getText()).toEqual('$1.00');
        expect(Sale_able_info_dlg.override_price_lbl.getText()).toEqual('None');
        expect(Sale_able_info_dlg.mm_deal_title_lbl.isDisplayed()).toBeFalsy();
        expect(Sale_able_info_dlg.mm_deal_lbl.isDisplayed()).toBeFalsy();
        expect(Sale_able_info_dlg.buydown_lbl.isDisplayed()).toBeFalsy();
        expect(Sale_able_info_dlg.advertise_price_lbl.getText()).toEqual('$1.00');
        expect(Sale_able_info_dlg.crv_lbl.getText()).toEqual('');
        expect(Sale_able_info_dlg.buydown_tax_lbl.isDisplayed()).toBeFalsy();
        expect(Sale_able_info_dlg.tax_lbl.getText()).toEqual('');
        expect(Sale_able_info_dlg.otd_price_lbl.getText()).toEqual('$1.00');
        Sale_able_info_dlg.cancel();
        
        //deal_crv_buydown_buydonwtax <-> 1_0_0_0
        Sale_page.scan(_3_deal_qty + ' ' + sku_2);
        Sale_page.click_col(1,'price');
        expect(Sale_able_info_dlg.preset_price_lbl.getText()).toEqual('$2.00');
        expect(Sale_able_info_dlg.override_price_lbl.getText()).toEqual('None');
        expect(Sale_able_info_dlg.mm_deal_title_lbl.getText()).toEqual(_3_deal_name + ' (discount):');
        expect(Sale_able_info_dlg.mm_deal_lbl.getText()).toEqual('$0.67');
        expect(Sale_able_info_dlg.buydown_lbl.isDisplayed()).toBeFalsy();
        expect(Sale_able_info_dlg.advertise_price_lbl.getText()).toEqual('$1.33');
        expect(Sale_able_info_dlg.crv_lbl.getText()).toEqual('');
        expect(Sale_able_info_dlg.buydown_tax_lbl.isDisplayed()).toBeFalsy();
        expect(Sale_able_info_dlg.tax_lbl.getText()).toEqual('');
        expect(Sale_able_info_dlg.otd_price_lbl.getText()).toEqual('$1.33');
        Sale_able_info_dlg.cancel();

        //deal_crv_buydown_buydonwtax <-> 0_1_0_0
        Sale_page.scan(sku_3);
        Sale_page.click_col(2,'price');
        expect(Sale_able_info_dlg.preset_price_lbl.getText()).toEqual('$3.00');
        expect(Sale_able_info_dlg.override_price_lbl.getText()).toEqual('None');
        expect(Sale_able_info_dlg.mm_deal_title_lbl.isDisplayed()).toBeFalsy();
        expect(Sale_able_info_dlg.mm_deal_lbl.isDisplayed()).toBeFalsy();
        expect(Sale_able_info_dlg.buydown_lbl.isDisplayed()).toBeFalsy();
        expect(Sale_able_info_dlg.advertise_price_lbl.getText()).toEqual('$3.00');
        expect(Sale_able_info_dlg.crv_lbl.getText()).toEqual('$0.10');
        expect(Sale_able_info_dlg.buydown_tax_lbl.isDisplayed()).toBeFalsy();
        expect(Sale_able_info_dlg.tax_lbl.getText()).toEqual('');
        expect(Sale_able_info_dlg.otd_price_lbl.getText()).toEqual('$3.10');
        Sale_able_info_dlg.cancel();

        //deal_crv_buydown_buydonwtax <-> 0_0_1_1
        Sale_page.scan(sku_4);
        Sale_page.click_col(3,'price');
        expect(Sale_able_info_dlg.preset_price_lbl.getText()).toEqual('$4.00');
        expect(Sale_able_info_dlg.override_price_lbl.getText()).toEqual('None');
        expect(Sale_able_info_dlg.mm_deal_title_lbl.isDisplayed()).toBeFalsy();
        expect(Sale_able_info_dlg.mm_deal_lbl.isDisplayed()).toBeFalsy();
        expect(Sale_able_info_dlg.buydown_lbl.getText()).toEqual('$0.50');
        expect(Sale_able_info_dlg.advertise_price_lbl.getText()).toEqual('$3.50');
        expect(Sale_able_info_dlg.crv_lbl.getText()).toEqual('');
        expect(Sale_able_info_dlg.buydown_tax_lbl.getText()).toEqual('$0.04');
        expect(Sale_able_info_dlg.tax_lbl.getText()).toEqual('$0.31');
        expect(Sale_able_info_dlg.otd_price_lbl.getText()).toEqual('$3.85');
        Sale_able_info_dlg.cancel();

        //non inventory
        var ni_price=1.1;var ni_crv=2.2; var ni_is_taxable=true;
        Sale_page.non_inventory();
        Non_inventory_prompt_dlg.set_price(ni_price);
        Non_inventory_prompt_dlg.set_crv(ni_crv);
        Non_inventory_prompt_dlg.set_is_taxable(ni_is_taxable);
        Non_inventory_prompt_dlg.ok();   
        Sale_page.click_col(4,'price');
        expect(Sale_able_info_dlg.preset_price_lbl.getText()).toEqual(lib.currency(ni_price));
        expect(Sale_able_info_dlg.override_price_lbl.getText()).toEqual('None');
        expect(Sale_able_info_dlg.mm_deal_title_lbl.isDisplayed()).toBeFalsy();
        expect(Sale_able_info_dlg.mm_deal_lbl.isDisplayed()).toBeFalsy();
        expect(Sale_able_info_dlg.buydown_lbl.isDisplayed()).toBeFalsy();
        expect(Sale_able_info_dlg.advertise_price_lbl.getText()).toEqual(lib.currency(ni_price));
        expect(Sale_able_info_dlg.crv_lbl.getText()).toEqual(lib.currency(ni_crv));
        expect(Sale_able_info_dlg.buydown_tax_lbl.isDisplayed()).toBeFalsy();
        expect(Sale_able_info_dlg.tax_lbl.getText()).toEqual('$0.29');
        expect(Sale_able_info_dlg.otd_price_lbl.getText()).toEqual('$3.59');
        Sale_able_info_dlg.cancel();

        //clean up
        Sale_page.void();
        lib.auth.logout();
    },60000)
});