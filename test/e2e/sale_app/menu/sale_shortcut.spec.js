var base_path = './../../';
var lib = require(base_path + 'lib');

describe('sale app', function() {

    var Sp_search_single_dlg = require(base_path + 'page/sp/search/Single_dlg.js');
    var Ui_prompt_dlg = require(base_path + 'page/ui/Prompt_dlg.js');
    var Shortcut_prompt_dlg = require(base_path + 'page/shortcut/Prompt_dlg.js');
    var Shortcut_manage_dlg = require(base_path + 'page/shortcut/Manage_dlg.js');
    var Sale_page = require(base_path + 'page/sale/Sale_page.js');
    var Non_inventory_prompt_dlg = require(base_path + 'page/sp/Non_inventory_prompt_dlg.js');

    //shortcut setup/manage


    beforeEach(function(){
        lib.auth.login('1','1');
        lib.setup.init_data();
        lib.auth.logout();
    })

    it('can use and setup shortcut',function(){
        lib.auth.login('1','1');

        //create 2 sp
        var sku_1 = '111';var product_name_1 = 'product name 1';lib.api.insert_new(sku_1,product_name_1);
        var sku_2 = '222';var product_name_2 = 'product name 2';lib.api.insert_new(sku_2,product_name_2); 
        
        Sale_page.visit();
        var parent_position = 1;
        var folder_1_name = 'folder 1';
        var child_0_position = 0;
        var child_4_position = 4;       
        var child_5_position = 5; 
        var child_0_caption = 'cell 0';
        var child_4_caption = 'cell 4';    
        var child_5_caption = 'none inventory';        

        //create a parent folder
        Sale_page.menu_setting_shortcut();
        Shortcut_manage_dlg.click_parent(parent_position);
        Shortcut_manage_dlg.click_parent_edit(parent_position);
        Ui_prompt_dlg.set_prompt(folder_1_name);
        Ui_prompt_dlg.ok();
        expect(Shortcut_manage_dlg.get_parent_text(parent_position)).toEqual(folder_1_name);

        //create 2 shortcut inside this parent folder
        Shortcut_manage_dlg.click_child(child_0_position);
        Shortcut_prompt_dlg.set_caption(child_0_caption);
        Shortcut_prompt_dlg.prompt_sp();
        Sp_search_single_dlg.search(sku_1);
        Sp_search_single_dlg.click_col(0,'select');
        Shortcut_prompt_dlg.ok();
        expect(Shortcut_manage_dlg.get_child_text(child_0_position)).toEqual(child_0_caption);

        Shortcut_manage_dlg.click_child(child_4_position);
        Shortcut_prompt_dlg.set_caption(child_4_caption);
        Shortcut_prompt_dlg.prompt_sp();
        Sp_search_single_dlg.search(sku_2);
        Sp_search_single_dlg.click_col(0,'select');
        Shortcut_prompt_dlg.ok();
        expect(Shortcut_manage_dlg.get_child_text(child_4_position)).toEqual(child_4_caption);
        Shortcut_manage_dlg.exit();

        //verify shortcut is not created for default position 0 (they are created under position 1)
        expect(Sale_page.get_parent_text(parent_position)).toEqual(folder_1_name);
        expect(Sale_page.get_child_text(child_0_position)).toEqual("");
        expect(Sale_page.get_child_text(child_4_position)).toEqual("");     

        //verify shortcut is creaed under position 1
        Sale_page.click_parent(parent_position);       
        expect(Sale_page.get_child_text(child_0_position)).toEqual(child_0_caption);
        expect(Sale_page.get_child_text(child_4_position)).toEqual(child_4_caption);     

        //verify clicking shortcut will scan the product
        Sale_page.click_child(child_0_position);
        Sale_page.click_child(child_4_position);
        lib.wait_for_block_ui();
        expect(Sale_page.lst.count()).toEqual(2);

        // //verify that create a shortcut in manage dialog will update shortcut usage grid in sale page
        expect(Sale_page.get_child_text(child_5_position)).toEqual('');
        Sale_page.menu_setting_shortcut();
        Shortcut_manage_dlg.click_parent(parent_position);
        Shortcut_manage_dlg.click_child(child_5_position);
        Shortcut_prompt_dlg.set_caption(child_5_caption);
        Shortcut_prompt_dlg.ok();
        Shortcut_manage_dlg.exit();
        Sale_page.click_parent(parent_position);
        expect(Sale_page.get_child_text(child_5_position)).toEqual(child_5_caption);

        //verify that clicking a non_inventory shortcut will bring up non_inventory dialog
        Sale_page.click_child(child_5_position);
        expect(Non_inventory_prompt_dlg.self.isPresent()).toEqual(true);
        Non_inventory_prompt_dlg.cancel();

        //clean up
        Sale_page.void();
        lib.auth.logout();
    })
});