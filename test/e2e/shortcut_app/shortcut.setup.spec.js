var base_path = './../';
var lib = require(base_path + 'lib');

describe('shortcut_app/service/manage', function() {
    var Sp_search_dlg = require(base_path + 'page/sp/search/Single_dlg.js');
    var Ui_prompt_dlg = require(base_path + 'page/ui/Prompt_dlg.js');
    var Shortcut_manage_dlg = require(base_path + 'page/shortcut/Manage_dlg.js');
    var Shortcut_prompt_dlg = require(base_path + 'page/shortcut/Prompt_dlg.js');
    var Sp_page = require(base_path + 'page/sp/Sp_page.js');

    var row_lst = Shortcut_manage_dlg.lst;
    var folder_1 = row_lst.get(1).all(by.tagName('td')).get(0);
    var folder_1_edit = row_lst.get(1).all(by.tagName('td')).get(1).all(by.tagName('button')).get(0);
    var cell_0 = row_lst.get(0).all(by.tagName('td')).get(2);
    var cell_4 = row_lst.get(1).all(by.tagName('td')).get(3);

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
        lib.api.insert_new(sku_1,product_name_1);
        lib.api.insert_new(sku_2,product_name_2); 
        Sp_page.menu_setting_shortcut();

        //select folder at position 1, and name this folder
        lib.click(folder_1);
        lib.click(folder_1_edit);
        Ui_prompt_dlg.set_prompt(folder_1_name);
        Ui_prompt_dlg.ok();

        //create 2 shortcut at position 0 and 4
        lib.click(cell_0);
        Shortcut_prompt_dlg.set_caption(cell_0_caption);
        Shortcut_prompt_dlg.prompt_sp();
        Sp_search_dlg.search(sku_1);
        Sp_search_dlg.click_col(0,'select');
        Shortcut_prompt_dlg.ok();
        expect(cell_0.getText()).toEqual(cell_0_caption);

        lib.click(cell_4);
        Shortcut_prompt_dlg.set_caption(cell_4_caption);
        Shortcut_prompt_dlg.prompt_sp();
        Sp_search_dlg.search(sku_2);
        Sp_search_dlg.click_col(0,'select');
        Shortcut_prompt_dlg.ok();
        expect(cell_4.getText()).toEqual(cell_4_caption);
        
        //exit and comback
        Shortcut_manage_dlg.exit();
        Sp_page.menu_setting_shortcut();

        //verify folder at position 0 is empty
        expect(cell_0.getText()).toEqual(''); //-> fail here
        expect(cell_4.getText()).toEqual('');
        expect(folder_1.getText()).toEqual(folder_1_name);

        //click on folder 1, and verify there is 2 shortcut at position 0 and 4
        lib.click(folder_1);
        expect(cell_0.getText()).toEqual(cell_0_caption);
        expect(cell_4.getText()).toEqual(cell_4_caption);

        //click on these shortcut to verify the caption and product name
        lib.click(cell_0);

        expect(Shortcut_prompt_dlg.get_caption()).toEqual(cell_0_caption);
        expect(Shortcut_prompt_dlg.get_sp()).toEqual(product_name_1);
        Shortcut_prompt_dlg.cancel();

        lib.click(cell_4);
        expect(Shortcut_prompt_dlg.get_caption()).toEqual(cell_4_caption);
        expect(Shortcut_prompt_dlg.get_sp()).toEqual(product_name_2);
        Shortcut_prompt_dlg.cancel();     

        //clean up
        Shortcut_manage_dlg.exit();
        lib.auth.logout();
    })
});