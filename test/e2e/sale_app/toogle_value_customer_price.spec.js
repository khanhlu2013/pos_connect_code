var base_path = './../';
var lib = require(base_path + 'lib');

describe('sale_app', function() {
    var ptor = protractor.getInstance();

    //service/ui/prompt
    var Non_inventory_prompt_dlg = require(base_path + 'page/sp/Non_inventory_prompt_dlg.js');
    var Sale_page = require(base_path + 'page/sale/Sale_page');

    beforeEach(function(){
        lib.auth.login('1','1');
        lib.setup.init_data();
        lib.auth.logout();
    })

    afterEach(function(){
        lib.auth.logout();
    })

    it('can toogle value customer price',function(){
        lib.auth.login('1','1');

        //create 3 sp
        var sku_1 = '111';var price_1 = 9;var value_price_1 = 8;
        var sku_2 = '222';var price_2 = 10;var value_price_2 = 7;
        var product_name_1 = 'product name 1';
        var product_name_2 = 'product name 2';
        lib.api.insert_new(sku_1,product_name_1,price_1,value_price_1);
        lib.api.insert_new(sku_2,product_name_2,price_2,value_price_2);  

        Sale_page.visit();                  
        Sale_page.scan(sku_1);
        Sale_page.scan(sku_2);
        Sale_page.menu_action_non_inventory();
        Non_inventory_prompt_dlg.set_price(3);
        Non_inventory_prompt_dlg.ok();
        
        expect(Sale_page.tender_btn.getText()).toEqual('$22.00');
        Sale_page.menu_action_toogle_value_customer_price();
        expect(Sale_page.tender_btn.getText()).toEqual('$18.00');
        Sale_page.menu_action_toogle_value_customer_price();
        expect(Sale_page.tender_btn.getText()).toEqual('$22.00');
        Sale_page.menu_action_toogle_value_customer_price();
        expect(Sale_page.tender_btn.getText()).toEqual('$18.00');   

        //clean up
        Sale_page.void();     
    })
});