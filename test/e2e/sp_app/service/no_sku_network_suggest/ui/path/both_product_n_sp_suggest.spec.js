var base_path = './../../../../../'
var lib = require(base_path + 'lib');

describe('no_sku_network_suggest_path -> both product and sp suggest', function() {
    var Sp_page = require(base_path + 'page/sp/Sp_page.js');
    var Select_sp_dlg = require(base_path + 'page/sp/suggest/Select_sp_dlg.js');
    var Select_product_dlg = require(base_path + 'page/sp/suggest/Select_product_dlg.js');
    var Sp_prompt_dlg = require(base_path + 'page/sp/Sp_prompt_dlg.js');
    var Confirm_dlg = require(base_path + 'page/ui/Confirm_dlg.js');

    beforeEach(function(){
        lib.auth.login('1','1');
        lib.setup.init_data();
        lib.auth.logout();
    })

    it('can go to p from sp and go to sp from p',function(){
        //-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
        //setup a product from store 1 and 2 then add a new_sku to store 2. we also create another product new_sku at store 3. Now, fom store 1, when scan new_sku, we can add sku from store 2 or add product from store 3
        //-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
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

        lib.auth.login('3','3');
        var another_product_name = 'another product name';
        var another_price = '2.5';
        var sp = null
        lib.api.insert_new(new_sku,another_product_name,another_price);

        //------------------------------------------------------------------------------------
        //verify that select sp take to add sku take priority and we can go to p from here(sp)
        //------------------------------------------------------------------------------------        
        lib.auth.login('1','1');
        Sp_page.sku_search(new_sku);
        expect(Select_sp_dlg.lst.count()).toEqual(1);
        expect(Select_sp_dlg.select_product_btn.isDisplayed()).toEqual(true);
        Select_sp_dlg.select_product();
        expect(Select_product_dlg.lst.count()).toEqual(1);

        //----------------------------------------------
        //verify that we can go back to select sp from p
        //----------------------------------------------   
        Select_product_dlg.select_sp();
        expect(Select_sp_dlg.lst.count()).toEqual(1*2);//*2 because there are 2 interface in the background.
    })
});