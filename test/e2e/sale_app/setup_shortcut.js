var lib = require('./../lib');


describe('sale_app/shortcut/setup_n_usage', function() {
    var baseUrl = 'http://127.0.0.1:8000/';
    var ptor = protractor.getInstance();
    var enter_key = protractor.Key.ENTER;

    //sp_app/service/search_dlg
    var search_txt = element(by.id('sp_app/service/search_dlg/single/search_txt'));
    var search_result = element.all(by.repeater('search_sp_single in sp_lst'));

    //service/ui/prompt
    var prompt_txt = element(by.id('service/ui/prompt/prompt_txt'));
    var prompt_ok_btn = element(by.id('service/ui/prompt/ok_btn'));
    var prompt_cancel_btn = element(by.id('service/ui/prompt/cancel_btn'));

    //shortcut_app/service/prompt
    var prompt_child_ok = element(by.id('shortcut_app/service/prompt/ok_btn'));
    var prompt_child_cancel = element(by.id('shortcut_app/service/prompt/cancel_btn'));
    var prompt_child_caption_txt = element(by.id('shortcut_app/service/prompt/caption_txt'));
    var prompt_child_sp_btn = element(by.id('shortcut_app/service/prompt/sp_btn'));
    var prompt_child_sp_txt = element(by.id('shortcut_app/service/prompt/sp_txt'));

    //shortcut setup/manage
    var row_setup_lst = element.all(by.repeater("row_setup in row_lst"));
    var folder_1_setup = row_setup_lst.get(1).all(by.tagName('td')).get(0);
    var folder_1_edit = row_setup_lst.get(1).all(by.tagName('td')).get(1).all(by.tagName('button')).get(0);
    var cell_setup_0 = row_setup_lst.get(0).all(by.tagName('td')).get(2);
    var cell_setup_4 = row_setup_lst.get(1).all(by.tagName('td')).get(3);
    var shortcut_setup_exit_btn = element(by.id('shortcut_app/service/manage/exit_btn'));

    //shortcut usage/sale
    var row_usage_lst = element.all(by.repeater("row_usage in row_lst"));
    var folder_1_usage = row_usage_lst.get(1).all(by.tagName('td')).get(0);
    var cell_usage_0 = row_usage_lst.get(0).all(by.tagName('td')).get(1);    
    var cell_usage_4 = row_usage_lst.get(1).all(by.tagName('td')).get(2);

    //sale page
    var ds_lst = element.all(by.repeater('ds in ds_lst'));
    var void_btn = element(by.id('sale_app/main_page/void_btn'));

    beforeEach(function(){
        lib.auth.login(baseUrl,'1','1');
        browser.get(baseUrl); 
        lib.setup.init_data();
        lib.auth.logout();
    })

    afterEach(function(){
        lib.auth.logout();
    })

    it('can create,edit,remove shortcut',function(){
        lib.auth.login(baseUrl,'1','1');
        browser.get(baseUrl); 

        //create 2 sp
        var sku_1 = '111';var sku_2 = '222';var product_name_1 = 'product name 1';var product_name_2 = 'product name 2';
        lib.api.insert_new(sku_1,product_name_1);
        lib.api.insert_new(sku_2,product_name_2);  
        lib.sale_page.load_this_page();                  

        //create 2 shortcut
        var folder_1_name = 'folder 1';
        var cell_0_caption = 'cell 0';
        var cell_4_caption = 'cell 4';        
        lib.ui.click(element(by.id('sale_app/menu/setting')));
        lib.ui.click(element(by.id('sale_app/menu/setting/shortcut')));        

        lib.ui.click(folder_1_setup);
        lib.ui.click(folder_1_edit);
        prompt_txt.sendKeys(folder_1_name,enter_key);
        lib.ui.click(prompt_ok_btn);
        expect(folder_1_setup.getText()).toEqual(folder_1_name);

        lib.ui.click(cell_setup_0);
        prompt_child_caption_txt.sendKeys(cell_0_caption,enter_key);
        lib.ui.click(prompt_child_sp_btn);
        search_txt.sendKeys(sku_1,enter_key);
        lib.ui.click(search_result.get(0).element(by.css('.btn')));
        lib.ui.click(prompt_child_ok);
        expect(cell_setup_0.getText()).toEqual(cell_0_caption);

        lib.ui.click(cell_setup_4);
        prompt_child_caption_txt.sendKeys(cell_4_caption,enter_key);
        lib.ui.click(prompt_child_sp_btn);
        search_txt.sendKeys(sku_2,enter_key);
        lib.ui.click(search_result.get(0).element(by.css('.btn')));
        lib.ui.click(prompt_child_ok);
        expect(cell_setup_4.getText()).toEqual(cell_4_caption);

        shortcut_setup_exit_btn.click();

        //verify shortcut usage is created  
        expect(folder_1_usage.getText()).toEqual(folder_1_name);
        expect(cell_usage_0.getText()).toEqual("");
        expect(cell_usage_4.getText()).toEqual("");            
        folder_1_usage.click();
        expect(cell_usage_0.getText()).toEqual(cell_0_caption);
        expect(cell_usage_4.getText()).toEqual(cell_4_caption);     

        //verify
        cell_usage_0.click();
        cell_usage_4.click();
        expect(ds_lst.count()).toEqual(2);

        //clean up
        void_btn.click();
    })
});