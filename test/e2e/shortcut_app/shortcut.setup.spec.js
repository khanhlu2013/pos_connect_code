var lib = require('./../lib');


describe('shortcut_app/service/manage', function() {
    /*
        when sku is not exist, it is the create module that kick in which should be tested separatly from this test.
    */
    var baseUrl = 'http://127.0.0.1:8000/';
    var ptor = protractor.getInstance();
    var enter_key = protractor.Key.ENTER;

    var search_txt = element(by.id('sp_app/service/search_dlg/single/search_txt'));
    var search_result = element.all(by.repeater('search_sp_single in sp_lst'));

    var prompt_txt = element(by.id('service/ui/prompt/prompt_txt'));
    var prompt_ok_btn = element(by.id('service/ui/prompt/ok_btn'));
    var prompt_cancel_btn = element(by.id('service/ui/prompt/cancel_btn'));

    var prompt_child_ok = element(by.id('shortcut_app/service/prompt/ok_btn'));
    var prompt_child_cancel = element(by.id('shortcut_app/service/prompt/cancel_btn'));
    var prompt_child_caption_txt = element(by.id('shortcut_app/service/prompt/caption_txt'));
    var prompt_child_sp_btn = element(by.id('shortcut_app/service/prompt/sp_btn'));
    var prompt_child_sp_txt = element(by.id('shortcut_app/service/prompt/sp_txt'));

    var row_lst = element.all(by.repeater("row_setup in row_lst"));
    var folder_1 = row_lst.get(1).all(by.tagName('td')).get(0);
    var folder_1_edit = row_lst.get(1).all(by.tagName('td')).get(1).all(by.tagName('button')).get(0);
    var cell_0 = row_lst.get(0).all(by.tagName('td')).get(2);
    var cell_4 = row_lst.get(1).all(by.tagName('td')).get(3);

    var shortcut_exit_btn = element(by.id('shortcut_app/service/manage/exit_btn'));

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
        var sku_1 = '111';var sku_2 = '222';var product_name_1 = 'product name 1';var product_name_2 = 'product name 2';
        var folder_1_name = 'folder 1';
        var cell_0_caption = 'cell 0';
        var cell_4_caption = 'cell 4';
        lib.api.insert_new(sku_1,product_name_1);
        lib.api.insert_new(sku_2,product_name_2);        
        lib.ui.click(element(by.id('sp_app/menu/setting')));
        lib.ui.click(element(by.id('sp_app/menu/setting/shortcut')));

        //select folder at position 1, and name this folder
        lib.ui.click(folder_1);
        lib.ui.click(folder_1_edit);
        prompt_txt.sendKeys(folder_1_name,enter_key);
        lib.ui.click(prompt_ok_btn);

        //create 2 shortcut at position 0 and 4
        lib.ui.click(cell_0);
        prompt_child_caption_txt.sendKeys(cell_0_caption,enter_key);
        lib.ui.click(prompt_child_sp_btn);
        search_txt.sendKeys(sku_1,enter_key);
        lib.ui.click(search_result.get(0).element(by.css('.btn')));
        lib.ui.click(prompt_child_ok);
        expect(cell_0.getText()).toEqual(cell_0_caption);

        lib.ui.click(cell_4);
        prompt_child_caption_txt.sendKeys(cell_4_caption,enter_key);
        lib.ui.click(prompt_child_sp_btn);
        search_txt.sendKeys(sku_2,enter_key);
        lib.ui.click(search_result.get(0).element(by.css('.btn')));
        lib.ui.click(prompt_child_ok);
        expect(cell_4.getText()).toEqual(cell_4_caption);
        
        //exit and comback
        lib.ui.click(shortcut_exit_btn);
        lib.ui.click(element(by.id('sp_app/menu/setting')));
        lib.ui.click(element(by.id('sp_app/menu/setting/shortcut')));

        //verify folder at position 0 is empty
        expect(cell_0.getText()).toEqual('');
        expect(cell_4.getText()).toEqual('');
        expect(folder_1.getText()).toEqual(folder_1_name);

        //click on folder 1, and verify there is 2 shortcut at position 0 and 4
        lib.ui.click(folder_1);
        expect(cell_0.getText()).toEqual(cell_0_caption);
        expect(cell_4.getText()).toEqual(cell_4_caption);

        //click on these shortcut to verify the caption and product name
        lib.ui.click(cell_0);
        expect(prompt_child_caption_txt.getAttribute('value')).toEqual(cell_0_caption);
        expect(prompt_child_sp_txt.getAttribute('value')).toEqual(product_name_1);
        lib.ui.click(prompt_child_cancel);

        lib.ui.click(cell_4);
        expect(prompt_child_caption_txt.getAttribute('value')).toEqual(cell_4_caption);
        expect(prompt_child_sp_txt.getAttribute('value')).toEqual(product_name_2);
        lib.ui.click(prompt_child_cancel);        

        //clean up
        lib.ui.click(shortcut_exit_btn);
    })
});