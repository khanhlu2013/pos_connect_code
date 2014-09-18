var lib = require('./../lib');


describe('sale_app/setup_pt', function() {
    /*
        when sku is not exist, it is the create module that kick in which should be tested separatly from this test.
    */
    var baseUrl = 'http://127.0.0.1:8000/';
    var ptor = protractor.getInstance();
    var enter_key = protractor.Key.ENTER;
    
    //menu
    var menu_setting = element(by.id('sale_app/menu/setting'));
    var menu_setting_pt = element(by.id('sale_app/menu/setting/payment_type'));

    //pt_manage_dlg
    var pt_manage_lst = element.all(by.repeater("pt_manage in pt_lst | orderBy:\'sort\'"));
    var pt_manage_create_btn = element(by.id('payment_type_app/service/manage/create_btn'));
    var pt_manage_exit_btn = element(by.id('payment_type_app/service/manage/exit_btn'));

    //pt_prompt_dlg
    var pt_prompt_name_txt = element(by.id('payment_type_app/service/prompt/name_txt'));
    var pt_prompt_sort_txt = element(by.id('payment_type_app/service/prompt/sort_txt'));
    var pt_prompt_active_check = element(by.id('payment_type_app/service/prompt/active_check'))
    var pt_prompt_ok_btn = element(by.id('payment_type_app/service/prompt/ok_btn'));
    var pt_prompt_cancel_btn = element(by.id('payment_type_app/service/prompt/cancel_btn'));

    //tender_ui
    var pt_tender_lst = element.all(by.repeater("pt_tender in pt_lst | orderBy:\'sort\'"));
    var cash_txt = element(by.id('sale_app/service/tender_ui/pt_txt/null'));
    var tender_ok_btn = element(by.id('sale_app/service/tender_ui/ok_btn'));
    var tender_cancel_btn = element(by.id('sale_app/service/tender_ui/cancel_btn'));

    //sale page
    var void_btn = element(by.id('sale_app/main_page/void_btn'));
    var tender_btn = element(by.id('sale_app/main_page/tender_btn'));
    var non_inv_btn = element(by.id('sale_app/main_page/non_inventory_btn'));
    var ds_lst = element.all(by.repeater('ds in ds_lst'))

    beforeEach(function(){
        lib.auth.login(baseUrl,'1','1');
        browser.get(baseUrl); 
        lib.setup.init_data();
        lib.auth.logout();
    })

    afterEach(function(){
        lib.auth.logout();
    })

    it('can do it',function(){
        lib.auth.login(baseUrl,'1','1');
        browser.get(baseUrl); 
        var sku = 111;var name = 'product 1';var price = 1;
        lib.api.insert_new(sku,name,price);                        
        lib.sale_page.load_this_page();

        //verify there is no pt beside the default cash
        lib.sale_page.scan(sku);
        tender_btn.click();
        expect(pt_tender_lst.count()).toEqual(1);
        tender_cancel_btn.click();

        //create pt_1
        menu_setting.click();
        menu_setting_pt.click();
        var pt_name_1 = 'a';
        var pt_sort_1 = 'b';
        pt_manage_create_btn.click();
        pt_prompt_name_txt.sendKeys(pt_name_1,enter_key);
        pt_prompt_sort_txt.sendKeys(pt_sort_1,enter_key);
        expect(pt_prompt_active_check.isSelected()).toBeTruthy();
        // pt_prompt_active_check.click();
        pt_prompt_ok_btn.click();
        pt_manage_exit_btn.click();        

        //create pt_2
        menu_setting.click();
        menu_setting_pt.click();
        var pt_name_2 = 'b';
        var pt_sort_2 = 'c';
        pt_manage_create_btn.click();
        pt_prompt_name_txt.sendKeys(pt_name_2,enter_key);
        pt_prompt_sort_txt.sendKeys(pt_sort_2,enter_key);
        expect(pt_prompt_active_check.isSelected()).toBeTruthy();
        // pt_prompt_active_check.click();
        pt_prompt_ok_btn.click();
        pt_manage_exit_btn.click();  

        //verify created 2 pt
        tender_btn.click();
        expect(pt_tender_lst.count()).toEqual(3);
        expect(pt_tender_lst.get(1).all(by.tagName('label')).get(0).getText()).toEqual(pt_name_1 + ':');
        expect(pt_tender_lst.get(2).all(by.tagName('label')).get(0).getText()).toEqual(pt_name_2 + ':');
        tender_cancel_btn.click();

        //edit sort of pt_2
        var new_sort_pt_2 = 'a';
        menu_setting.click();
        menu_setting_pt.click();
        pt_manage_lst.get(1).all(by.css('.btn')).get(0).click();
        pt_prompt_sort_txt.clear();
        pt_prompt_sort_txt.sendKeys(new_sort_pt_2,enter_key);
        pt_prompt_ok_btn.click();
        pt_manage_exit_btn.click();  

        //verify new sorted order
        tender_btn.click();
        expect(pt_tender_lst.count()).toEqual(3);
        expect(pt_tender_lst.get(1).all(by.tagName('label')).get(0).getText()).toEqual(pt_name_2 + ':');
        expect(pt_tender_lst.get(2).all(by.tagName('label')).get(0).getText()).toEqual(pt_name_1 + ':');
        tender_cancel_btn.click();                

        //edit active of pt_1
        menu_setting.click();
        menu_setting_pt.click();
        pt_manage_lst.get(1).all(by.css('.btn')).get(0).click();
        pt_prompt_active_check.click();
        pt_prompt_ok_btn.click();
        pt_manage_exit_btn.click();  

        //verify pt_1 is no longer active
        tender_btn.click();
        expect(pt_tender_lst.count()).toEqual(2);
        expect(pt_tender_lst.get(1).all(by.tagName('label')).get(0).getText()).toEqual(pt_name_2 + ':');
        tender_cancel_btn.click();    

        //clean up
        void_btn.click();
    },60000/*60 second timeout*/)
});