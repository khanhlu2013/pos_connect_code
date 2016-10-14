var base_path = './../';
var lib = require(base_path + 'lib');

describe('sale page -> scan a product -> info ->duplicate', function() {
    var Sale_page = require(base_path + 'page/sale/Sale_page');
    var Sp_info_dlg = require(base_path + 'page/sp/Sp_info_dlg');
    var Sp_prompt_dlg = require(base_path + 'page/sp/Sp_prompt_dlg.js'); 

    beforeEach(function(){
        lib.auth.login('1','1');
        lib.setup.init_data();
        lib.auth.logout();
    })
    
    it('can create new product base on this product and auto sync and scan them',function(){
        
        //--------------------------------------------
        //add a product into current store and sell it
        //--------------------------------------------
        lib.auth.login('1','1');
        var sku = '111';var price = 3;
        lib.api.insert_new(sku,'Coke 12oz',price,null/*value_customer_price*/,null/*crv*/,false/*is_taxable*/,false/*is_sale_report*/,null/*p_type*/,null/*p_tag*/,null/*cost*/,null/*vendor*/,null/*buydown*/);
        Sale_page.visit();
        Sale_page.scan(sku);

        //----------------------
        //duplicate this product
        //----------------------
        var duplicate_product_name = 'xx'
        Sale_page.click_col('0','name');
        Sp_info_dlg.duplicate();
        Sp_prompt_dlg.set_name(duplicate_product_name);
        Sp_prompt_dlg.set_sku('a_dummy_sku');
        Sp_prompt_dlg.ok();
        expect(Sale_page.get_col(1,'name')).toEqual(duplicate_product_name);

        //clean up
        Sale_page.void();
    },30000);
});