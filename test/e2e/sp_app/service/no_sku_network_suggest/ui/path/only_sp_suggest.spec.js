var base_path = './../../../../../'
var lib = require(base_path + 'lib');

describe('no_sku_network_suggest_path -> only sp suggest', function() {
    var Sp_page = require(base_path + 'page/sp/Sp_page.js');
    var Select_sp_dlg = require(base_path + 'page/sp/suggest/Select_sp_dlg.js');
    var Sp_prompt_dlg = require(base_path + 'page/sp/Sp_prompt_dlg.js');
    var Confirm_dlg = require(base_path + 'page/ui/Confirm_dlg.js');

    beforeEach(function(){
        lib.auth.login('1','1');
        lib.setup.init_data();
        lib.auth.logout();
    })

    it('can ONLY create new or select sp',function(){
        //------------------------------------------------------------
        //setup a product from store 1 and 2 then add a sku to store 2
        //------------------------------------------------------------
        lib.auth.login('1','1');
        var sku = '111';
        var product_name = 'product name';
        var price = '2';
        var sp = null
        lib.api.insert_new(sku,product_name,price).then(
            function(created_sp){
                sp = created_sp;
            }
        )

        lib.auth.login('2','2');
        var new_sku = '222';
        browser.wait(function(){
            return sp !== null;
        }).then(
            function(){
                lib.api.insert_old(sp.product_id,sku,product_name,price);
                lib.api.add_sku(sp.product_id,new_sku);
            }
        )

        //-------------------------------------
        //verify that we can not select product
        //-------------------------------------        
        lib.auth.login('1','1');
        Sp_page.sku_search(new_sku);
        expect(Select_sp_dlg.self.isPresent()).toEqual(true);
        expect(Select_sp_dlg.select_product_btn.isDisplayed()).toEqual(false);

        //-------------------------------------
        //verify that we can create new product
        //-------------------------------------   
        Select_sp_dlg.create_new_product();
        expect(Sp_prompt_dlg.self.isPresent()).toEqual(true);
        Sp_prompt_dlg.cancel();

        //--------------------------
        //verify that we can add sku
        //--------------------------           
        Sp_page.sku_search(new_sku);
        Select_sp_dlg.click_col(0,'add');
        expect(Confirm_dlg.message_lbl.getText()).toEqual('Confirm: adding ' + new_sku + ' sku to ' + product_name + ' ?');
    })
});