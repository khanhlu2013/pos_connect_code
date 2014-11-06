var base_path = './../';
var lib = require(base_path + 'lib');

describe('shortcut manager at sp_page', function() {
    var Sp_search_dlg = require(base_path + 'page/sp/search/Single_dlg.js');
    var Ui_prompt_dlg = require(base_path + 'page/ui/Prompt_dlg.js');
    var Shortcut_manage_dlg = require(base_path + 'page/shortcut/Manage_dlg.js');
    var Shortcut_prompt_dlg = require(base_path + 'page/shortcut/Prompt_dlg.js');
    var Sp_page = require(base_path + 'page/sp/Sp_page.js');

    var parent_position = 1;
    var child_0_position = 0;
    var child_4_position = 4;
    var child_5_position = 5;

    beforeEach(function(){
        lib.auth.login('1','1');
        lib.setup.init_data();
        lib.auth.logout();
    })

    it('can create,edit,remove shortcut',function(){
        lib.auth.login('1','1');
        var sku_1 = '111';var sku_2 = '222';var product_name_1 = 'product name 1';var product_name_2 = 'product name 2';
        var folder_1_name = 'folder 1';
        var cell_0_caption = 'cell 0';
        var cell_4_caption = 'cell 4';
        var cell_5_caption = 'non inventory';
        lib.api.insert_new(sku_1,product_name_1);
        lib.api.insert_new(sku_2,product_name_2); 
        Sp_page.menu_setting_shortcut();

        //can create a parent folder at position 1
        Shortcut_manage_dlg.click_parent(parent_position);
        Shortcut_manage_dlg.click_parent_edit(parent_position);
        Ui_prompt_dlg.set_prompt(folder_1_name);
        Ui_prompt_dlg.ok();
        expect(Shortcut_manage_dlg.get_parent_text(parent_position)).toEqual(folder_1_name);

        //in this parent folder(position 1), create 2 shortcut at position 0 and 4.verify the caption text for these 2 shortcut at the manage dialog
        Shortcut_manage_dlg.click_child(child_0_position);
        Shortcut_prompt_dlg.set_caption(cell_0_caption);
        Shortcut_prompt_dlg.prompt_sp();
        Sp_search_dlg.search(sku_1);
        Sp_search_dlg.click_col(0,'select');
        Shortcut_prompt_dlg.ok();
        expect(Shortcut_manage_dlg.get_child_text(child_0_position)).toEqual(cell_0_caption);

        Shortcut_manage_dlg.click_child(child_4_position);
        Shortcut_prompt_dlg.set_caption(cell_4_caption);
        Shortcut_prompt_dlg.prompt_sp();
        Sp_search_dlg.search(sku_2);
        Sp_search_dlg.click_col(0,'select');
        Shortcut_prompt_dlg.ok();
        expect(Shortcut_manage_dlg.get_child_text(child_4_position)).toEqual(cell_4_caption);
        
        //exit and comback to verify more info
        Shortcut_manage_dlg.exit();
        Sp_page.menu_setting_shortcut();

        //verify folder at position 0 does not contain 2 child shortcut that is setup above (they are located in position 1 instead)
        expect(Shortcut_manage_dlg.get_child_text(child_0_position)).toEqual('');
        expect(Shortcut_manage_dlg.get_child_text(child_4_position)).toEqual('');

        //verify folder at position 1 have 2 setup shortcut with correct caption
        Shortcut_manage_dlg.click_parent(parent_position);
        expect(Shortcut_manage_dlg.get_child_text(child_0_position)).toEqual(cell_0_caption);
        expect(Shortcut_manage_dlg.get_child_text(child_4_position)).toEqual(cell_4_caption);

        //verify the 2 setup shortcut containing correct caption and sp inside prompt dialog
        Shortcut_manage_dlg.click_child(child_0_position);
        expect(Shortcut_prompt_dlg.get_caption()).toEqual(cell_0_caption);
        expect(Shortcut_prompt_dlg.get_sp()).toEqual(product_name_1);
        Shortcut_prompt_dlg.cancel();

        Shortcut_manage_dlg.click_child(child_4_position);
        expect(Shortcut_prompt_dlg.get_caption()).toEqual(cell_4_caption);
        expect(Shortcut_prompt_dlg.get_sp()).toEqual(product_name_2);
        Shortcut_prompt_dlg.cancel();  

        //verify we can setup non_inventory
        Shortcut_manage_dlg.click_child(child_5_position);
        Shortcut_prompt_dlg.set_caption(cell_5_caption);
        expect(Shortcut_prompt_dlg.non_inventory_warning_lbl.isDisplayed()).toBeTruthy();
        Shortcut_prompt_dlg.ok();
        expect(Shortcut_manage_dlg.get_child_text(child_5_position)).toEqual(cell_5_caption);    
        
        //lets comback to verify there is no sp for this non inventory setup. also the remove sp button is hide
        Shortcut_manage_dlg.click_child(child_5_position);
        expect(Shortcut_prompt_dlg.get_sp()).toEqual('');
        expect(Shortcut_prompt_dlg.remove_sp_btn.isDisplayed()).toEqual(false);
        Shortcut_prompt_dlg.cancel();

        //lets verify that we can remove sp from a child
        Shortcut_manage_dlg.click_child(child_0_position);
        Shortcut_prompt_dlg.remove_sp();
        Shortcut_prompt_dlg.ok();
        Shortcut_manage_dlg.click_child(child_0_position);
        expect(Shortcut_prompt_dlg.get_sp()).toEqual('');
    })
});