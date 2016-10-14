var base_path = './../../../../../'
var lib = require(base_path + 'lib');

describe('no_sku_network_suggest_path -> only product suggest', function() {
    var Sp_page = require(base_path + 'page/sp/Sp_page.js');
    var Select_product_dlg = require(base_path + 'page/sp/suggest/Select_product_dlg.js');
    var Select_product_confirm_dlg = require(base_path + 'page/sp/suggest/Select_product_confirm_dlg.js');
    var Sp_prompt_dlg = require(base_path + 'page/sp/Sp_prompt_dlg.js');

    beforeEach(function(){
        lib.auth.login('1','1');
        lib.setup.init_data();
        lib.auth.logout();
    })

    it('can ONLY create new or select product',function(){
        //------------------------------------------------------------------
        //setup a product from store 2 - we will see this suggest in store 1
        //------------------------------------------------------------------
        lib.auth.login('2','2');
        var sku = '111';
        var product_name = 'product name';
        var price = '2';
        lib.api.insert_new(sku,product_name,price)

        //-------------------------------
        //verify we can select suggestion
        //-------------------------------
        lib.auth.login('1','1');
        Sp_page.sku_search(sku);
        expect(Select_product_dlg.lst.count()).toEqual(1);
        Select_product_dlg.click_col(0,'add');
        Select_product_confirm_dlg.ok();
        expect(Sp_prompt_dlg.self.isPresent()).toEqual(true);
        Sp_prompt_dlg.cancel();

        //--------------------------------------
        //verify there is no option to select sp 
        //--------------------------------------
        Sp_page.sku_search(sku);        
        expect(Select_product_dlg.select_sp_btn.isDisplayed()).toEqual(false);

        //--------------------------------
        //verify we can create new product
        //--------------------------------
        Select_product_dlg.create_new_product();     
        expect(Sp_prompt_dlg.self.isPresent()).toEqual(true);   
    })
});