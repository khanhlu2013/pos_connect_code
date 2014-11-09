var base_path = './../../'
var lib = require(base_path + 'lib');

describe('sale page \'s scan table ', function() {
    var Sp_prompt_dlg = require(base_path + 'page/sp/Sp_prompt_dlg.js');
    var Ui_confirm_dlg = require(base_path + 'page/ui/Confirm_dlg.js');
    var Ui_prompt_dlg = require(base_path + 'page/ui/Prompt_dlg.js');
    var Sp_info_dlg = require(base_path + 'page/sp/Sp_info_dlg.js');
    var Sale_page = require(base_path + 'page/sale/Sale_page.js');
    var Sp_sku_dlg = require(base_path + 'page/sp/edit/Sp_sku_dlg.js');

    beforeEach(function(){
        lib.auth.login('1','1');
        lib.setup.init_data();
        lib.auth.logout();
    })

    it('can edit product sku info',function(){
        lib.auth.login('1','1');

        //create product 1
        var sku_1 = '111';var name_1 = 'product name 1';
        lib.api.insert_new(sku_1,name_1);

        Sale_page.visit();             
        Sale_page.scan(sku_1);lib.wait_for_block_ui();

        //edit sp 1
        Sale_page.click_col(0,'name');
        lib.click(Sp_info_dlg.sku_tab);
        Sp_info_dlg.edit();

        //add sku
        var new_sku = '222';
        Sp_sku_dlg.add();
        Ui_prompt_dlg.set_prompt(new_sku);
        Ui_prompt_dlg.ok();lib.wait_for_block_ui();
        Sp_sku_dlg.exit();
        Sp_info_dlg.exit();

        //verify the new sku can be scaned
        Sale_page.scan(new_sku);lib.wait_for_block_ui();
        expect(Sale_page.get_col(0,'qty')).toEqual('2');

        //edit sp 1
        Sale_page.click_col(0,'name');
        lib.click(Sp_info_dlg.sku_tab);
        Sp_info_dlg.edit();

        //remove sku
        Sp_sku_dlg.click_col(1,'remove');
        Ui_confirm_dlg.ok();
        Sp_sku_dlg.exit();
        Sp_info_dlg.exit();

        //verify the new sku is removed
        Sale_page.scan(new_sku);lib.wait_for_block_ui();
        Sp_prompt_dlg.cancel();
        expect(Sale_page.get_col(0,'qty')).toEqual('2')

        //clean up
        Sale_page.void();
        lib.auth.logout();
    })
});