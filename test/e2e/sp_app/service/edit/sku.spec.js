var base_path = './../../../';
var lib = require(base_path + 'lib');


describe('sp page', function() {
    var Sp_page = require(base_path + 'page/sp/Sp_page.js');
    var Sp_info_dlg = require(base_path + 'page/sp/Sp_info_dlg.js');
    var Sp_sku_dlg = require(base_path + 'page/sp/edit/Sp_sku_dlg.js');
    var Ui_prompt_dlg = require(base_path + 'page/ui/Prompt_dlg.js');
    var Ui_confirm_dlg = require(base_path + 'page/ui/Confirm_dlg.js');

    beforeEach(function(){
        lib.auth.login('1','1');
        lib.setup.init_data();
        lib.auth.logout();
    })

    it('can add sku to sp',function(){
        //fixture
        var old_sku = '111';
        var new_sku = '222';
        lib.auth.login('1','1');
        lib.api.insert_new(old_sku,'xxx'/*name*/);

        Sp_page.sku_search(old_sku);
        expect(Sp_page.lst.count()).toEqual(1);  
        Sp_page.click_col(0,'info');
        
        //open edit sku dialog
        Sp_info_dlg.switch_tab('sku');
        Sp_info_dlg.edit();
        expect(Sp_sku_dlg.lst.count()).toEqual(1);

        //add new sku
        Sp_sku_dlg.add();
        Ui_prompt_dlg.set_prompt(new_sku);
        Ui_prompt_dlg.ok();lib.wait_for_block_ui();

        //verify new added sku
        expect(Sp_sku_dlg.lst.count()).toEqual(2);
        expect(Sp_sku_dlg.get_col(0,'sku')).toEqual(old_sku);
        expect(Sp_sku_dlg.get_col(1,'sku')).toEqual(new_sku);

        //clean up
        Sp_sku_dlg.exit();
        Sp_info_dlg.exit();
        lib.auth.logout();
    })

    
    it('can add old sku, aka this sku is already assoc with this product through another store but not yet assoc by this store',function(){
        lib.auth.login('2','2');
        var sku_1 = '111';
        var sku_2 = '222';
        var product_id = null;
        lib.api.insert_new(sku_1,'xxx'/*product name*/).then(function(data){product_id = data.product_id});
        browser.wait(function(){ return product_id != null; }).then(function(){ lib.api.add_sku(product_id,sku_2); });
        lib.auth.logout();

        lib.auth.login('1','1');
        browser.wait(function(){ return product_id != null; }).then(function(){ lib.api.insert_old(product_id,sku_1,'xxx'/*name*/); });

        //search for product
        Sp_page.sku_search(sku_1);
        expect(Sp_page.lst.count()).toEqual(1);
        Sp_page.click_col(0,'info');
        
        //navigate to edit sku
        Sp_info_dlg.switch_tab('sku');
        Sp_info_dlg.edit();
        Sp_sku_dlg.add();
        //verify sku is not yet added
        expect(Sp_sku_dlg.lst.count()).toEqual(1);
        //add new sku
        Ui_prompt_dlg.set_prompt(sku_2);
        Ui_prompt_dlg.ok();lib.wait_for_block_ui();

        //verify sku is added
        expect(Sp_sku_dlg.lst.count()).toEqual(2);
        Sp_sku_dlg.exit();
        Sp_info_dlg.exit();

        lib.auth.logout();
    })


    it('can add remove sku subscription and leave other store subscription un-touch',function(){
        lib.auth.login('2','2');
        var sku_1 = '111';
        var sku_2 = '222';
        var product_id = null;
        lib.api.insert_new(sku_1,'xxx'/*product name*/).then(function(data){product_id = data.product_id});
        browser.wait(function(){ return product_id != null; }).then(function(){lib.api.add_sku(product_id,sku_2);})
        lib.auth.logout();

        lib.auth.login('1','1');
        browser.wait(function(){return product_id != null; }).then(function(){
            lib.api.insert_old(product_id,sku_1,'xxx'/*name*/); 
            lib.api.add_sku(product_id,sku_2);
        })

        //search for product
        Sp_page.sku_search(sku_1);
        expect(Sp_page.lst.count()).toEqual(1);
        Sp_page.click_col(0,'info');

        //navigate to edit sku
        Sp_info_dlg.switch_tab('sku');
        Sp_info_dlg.edit();
        expect(Sp_sku_dlg.lst.count()).toEqual(2);

        //remove sku
        Sp_sku_dlg.click_col(0,'remove');
        Ui_confirm_dlg.ok();

        //verify sku is removed
        expect(Sp_sku_dlg.lst.count()).toEqual(1);
        Sp_sku_dlg.exit();
        Sp_info_dlg.exit();

        //verify other store subscription stay the same
        lib.auth.logout();
        lib.auth.login('2','2');
        Sp_page.sku_search(sku_1);
        Sp_page.click_col(0,'info');
        Sp_info_dlg.switch_tab('sku');
        Sp_info_dlg.edit();
        expect(Sp_sku_dlg.lst.count()).toEqual(2);

        Sp_sku_dlg.exit();
        Sp_info_dlg.exit();

        lib.auth.logout();
    })    
});