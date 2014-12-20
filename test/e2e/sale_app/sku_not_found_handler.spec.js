var base_path = './../';
var lib = require(base_path + 'lib');

describe('sale page -> sku not found handler', function() {
    var Sale_page = require(base_path + 'page/sale/Sale_page');
    var Select_product_dlg = require(base_path + 'page/sp/suggest/Select_product_dlg.js');
    var Select_product_confirm_dlg = require(base_path + 'page/sp/suggest/Select_product_confirm_dlg.js');
    var _3_option_dlg = require(base_path + 'page/ui/_3_option_dlg.js');
    var Non_inventory_prompt_dlg = require(base_path + 'page/sp/Non_inventory_prompt_dlg.js');
    var Sp_prompt_dlg = require(base_path + 'page/sp/Sp_prompt_dlg.js'); 

    beforeEach(function(){
        lib.auth.login('1','1');
        lib.setup.init_data();
        lib.auth.logout();
    })
    
    it('can prompt you network suggestion or give you an option to sell as non inventory if there is no suggestion',function(){
        
        //--------------------------------------------
        //we add a product into the network with a sku
        //--------------------------------------------
        lib.auth.login('2','2');
        var sku = '111';var price = 3;
        lib.api.insert_new(sku,'Coke 12oz',price,null/*value_customer_price*/,null/*crv*/,false/*is_taxable*/,false/*is_sale_report*/,null/*p_type*/,null/*p_tag*/,null/*cost*/,null/*vendor*/,null/*buydown*/).then(
            function(product){
                pid = product.product_id;
            }
        )

        //------------------------------------------------------------------------------------------------------------------------------
        //when we scan that sku that exist in the network, but not in our store, selecting the suggestion will add and scan that product
        //------------------------------------------------------------------------------------------------------------------------------
        lib.auth.login('1','1');
        Sale_page.visit();
        Sale_page.scan(sku);
        Select_product_dlg.click_col(0,'add');
        Select_product_confirm_dlg.ok();
        Sp_prompt_dlg.set_name('Coke');
        Sp_prompt_dlg.set_price(price);
        Sp_prompt_dlg.ok();
        expect(Sale_page.lst.count()).toEqual(1);
        expect(Sale_page.tender_btn.getText()).toEqual(lib.currency(price));

        //------------------------------------------------------------------------------------------------------
        //when we scan a sku that is not exist in the network, we can have an option to sell to as non inventory
        //------------------------------------------------------------------------------------------------------
        var new_sku = '222';
        Sale_page.scan(new_sku);
        lib.click(_3_option_dlg._1_btn);
        Non_inventory_prompt_dlg.cancel();

        //------------------------------------------------------------------------------------------------------------------------------
        //when we scan a sku that is not exist in the network, we can have an option to create it which will auto scan it after creation
        //------------------------------------------------------------------------------------------------------------------------------  
        var new_sku = '222';var new_price = 4;
        Sale_page.scan(new_sku);
        lib.click(_3_option_dlg._2_btn);
        Sp_prompt_dlg.set_name('abc');
        Sp_prompt_dlg.set_price(new_price);
        Sp_prompt_dlg.ok();
        expect(Sale_page.lst.count()).toEqual(2);
        expect(Sale_page.tender_btn.getText()).toEqual(lib.currency(price + new_price));

        //clean up
        Sale_page.void();
    },60000);
});