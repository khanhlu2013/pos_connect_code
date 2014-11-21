var base_path = './../../../'
var lib = require(base_path + 'lib');


describe('no sku network suggestion -> ajax', function() {
    var Sp_page = require(base_path + 'page/sp/Sp_page.js');
    var Select_sp_dlg = require(base_path + 'page/sp/suggest/Select_sp_dlg.js');
    var Sp_prompt_dlg = require(base_path + 'page/sp/Sp_prompt_dlg.js');
    var Confirm_dlg = require(base_path + 'page/ui/Confirm_dlg.js');
    var Select_product_dlg = require(base_path + 'page/sp/suggest/Select_product_dlg.js');
    var Select_product_confirm_dlg = require(base_path + 'page/sp/suggest/Select_product_confirm_dlg.js');
        
    beforeEach(function(){
        lib.auth.login('1','1');
        lib.setup.init_data();
        lib.auth.logout();
    })

    it('can add sku',function(){
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

        //--------------------------
        //verify that we can add sku
        //--------------------------        
        lib.auth.login('1','1');
        Sp_page.sku_search(new_sku);
        expect(Select_sp_dlg.self.isPresent()).toEqual(true);
        Select_sp_dlg.click_col(0,'add');
        Confirm_dlg.ok();
        Sp_page.sku_search(new_sku);
        expect(Sp_page.lst.count()).toEqual(1);
        expect(Sp_page.get_col(0,'name')).toEqual(product_name);
        expect(Sp_page.get_col(0,'price')).toEqual('$2.00');
    });

    it('can add new product',function(){
        lib.auth.login('1','1');
        var sku = '111';
        var product_name = 'product name';
        var price = '2';

        Sp_page.sku_search(sku);
        Sp_prompt_dlg.set_name(product_name);
        Sp_prompt_dlg.set_price(price);
        Sp_prompt_dlg.ok();

        expect(Sp_page.lst.count()).toEqual(1);
        expect(Sp_page.get_col(0,'name')).toEqual(product_name);
        expect(Sp_page.get_col(0,'price')).toEqual('$2.00');        
    });  

    it('can add old product',function(){
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
        Sp_page.sku_search('111');
        expect(Select_product_dlg.lst.count()).toEqual(1);
        Select_product_dlg.click_col(0,'add');
        Select_product_confirm_dlg.ok();
        Sp_prompt_dlg.set_name(product_name);
        Sp_prompt_dlg.set_price(price);
        Sp_prompt_dlg.ok();

        expect(Sp_page.lst.count()).toEqual(1);
        expect(Sp_page.get_col(0,'name')).toEqual(product_name);
        expect(Sp_page.get_col(0,'price')).toEqual('$2.00');      
    });          
});