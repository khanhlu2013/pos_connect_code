var base_path = './../';
var lib = require(base_path + 'lib');

describe('sale_app/shortcut/setup_n_usage', function() {

    var Sp_search_single_dlg = require(base_path + 'page/sp/search/Single_dlg.js');
    var Ui_prompt_dlg = require(base_path + 'page/ui/Prompt_dlg.js');
    var Shortcut_prompt_dlg = require(base_path + 'page/shortcut/Prompt_dlg.js');
    var Shortcut_setup_dlg = require(base_path + 'page/shortcut/Manage_dlg.js');
    var Sale_page = require(base_path + 'page/sale/Sale_page.js');

    //shortcut setup/manage
    var folder_1_setup = Shortcut_setup_dlg.lst.get(1).all(by.tagName('td')).get(0);
    var folder_1_edit = Shortcut_setup_dlg.lst.get(1).all(by.tagName('td')).get(1).all(by.tagName('button')).get(0);
    var cell_setup_0 = Shortcut_setup_dlg.lst.get(0).all(by.tagName('td')).get(2);
    var cell_setup_4 = Shortcut_setup_dlg.lst.get(1).all(by.tagName('td')).get(3);

    //shortcut usage/sale
    var folder_1_usage = Sale_page.shortcut_lst.get(1).all(by.tagName('td')).get(0);
    var cell_usage_0 = Sale_page.shortcut_lst.get(0).all(by.tagName('td')).get(1);    
    var cell_usage_4 = Sale_page.shortcut_lst.get(1).all(by.tagName('td')).get(2);

    beforeEach(function(){
        lib.auth.login('1','1');
        lib.setup.init_data();
        lib.auth.logout();
    })

    it('can create,edit,remove shortcut',function(){
        lib.auth.login('1','1');

        //create 2 sp
        var sku_1 = '111';var sku_2 = '222';var product_name_1 = 'product name 1';var product_name_2 = 'product name 2';
        lib.api.insert_new(sku_1,product_name_1);
        lib.api.insert_new(sku_2,product_name_2);  
        Sale_page.visit();

        //create 2 shortcut
        var folder_1_name = 'folder 1';
        var cell_0_caption = 'cell 0';
        var cell_4_caption = 'cell 4';      
        Sale_page.menu_setting_shortcut();

        lib.click(folder_1_setup);
        lib.click(folder_1_edit);
        Ui_prompt_dlg.set_prompt(folder_1_name);
        Ui_prompt_dlg.ok();
        expect(folder_1_setup.getText()).toEqual(folder_1_name);

        lib.click(cell_setup_0);
        Shortcut_prompt_dlg.set_caption(cell_0_caption);
        Shortcut_prompt_dlg.prompt_sp();
        Sp_search_single_dlg.search(sku_1);
        Sp_search_single_dlg.click_col(0,'select');
        Shortcut_prompt_dlg.ok();
        expect(cell_setup_0.getText()).toEqual(cell_0_caption);

        lib.click(cell_setup_4);
        Shortcut_prompt_dlg.set_caption(cell_4_caption);
        Shortcut_prompt_dlg.prompt_sp();
        Sp_search_single_dlg.search(sku_2);
        Sp_search_single_dlg.click_col(0,'select');
        Shortcut_prompt_dlg.ok();
        expect(cell_setup_4.getText()).toEqual(cell_4_caption);
        Shortcut_setup_dlg.exit();

        //verify shortcut usage is created  
        expect(folder_1_usage.getText()).toEqual(folder_1_name);
        expect(cell_usage_0.getText()).toEqual("");
        expect(cell_usage_4.getText()).toEqual("");            
        lib.click(folder_1_usage);
        expect(cell_usage_0.getText()).toEqual(cell_0_caption);
        expect(cell_usage_4.getText()).toEqual(cell_4_caption);     

        //verify
        lib.click(cell_usage_0);
        lib.click(cell_usage_4);
        lib.wait_for_block_ui();
        expect(Sale_page.lst.count()).toEqual(2);

        //clean up
        Sale_page.void();
        lib.auth.logout();
    })
});