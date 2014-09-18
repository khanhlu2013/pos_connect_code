var lib = require('./../lib');


describe('payment_type_app', function() {
    /*
        when sku is not exist, it is the create module that kick in which should be tested separatly from this test.
    */
    var baseUrl = 'http://127.0.0.1:8000/';
    var ptor = protractor.getInstance();
    var enter_key = protractor.Key.ENTER;
    
    //pt_manage_dlg
    var pt_lst = element.all(by.repeater("pt_manage in pt_lst | orderBy:\'sort\'"))
    var pt_manage_create_btn = element(by.id('payment_type_app/service/manage/create_btn'));
    var pt_manage_exit_btn = element(by.id('payment_type_app/service/manage/exit_btn'));

    //pt_prompt_dlg
    var name_txt = element(by.id('payment_type_app/service/prompt/name_txt'));
    var sort_txt = element(by.id('payment_type_app/service/prompt/sort_txt'));
    var active_check = element(by.id('payment_type_app/service/prompt/active_check'))
    var prompt_ok_btn = element(by.id('payment_type_app/service/prompt/ok_btn'));
    var prompt_cancel_btn = element(by.id('payment_type_app/service/prompt/cancel_btn'));

    beforeEach(function(){
        lib.auth.login(baseUrl,'1','1');
        browser.get(baseUrl); 
        lib.setup.init_data();
        lib.auth.logout();
    })

    afterEach(function(){
        lib.auth.logout();
    })

    it('can create,edit,payment type',function(){
        lib.auth.login(baseUrl,'1','1');
        browser.get(baseUrl);  
        lib.ui.click(element(by.id('sp_app/menu/setting')));
        lib.ui.click(element(by.id('sp_app/menu/setting/payment_type')));  
        expect(pt_lst.count()).toEqual(0);

        //create pt
        var pt_name = 'credit card';
        var pt_sort = 'c';
        pt_manage_create_btn.click();
        name_txt.sendKeys(pt_name,enter_key);
        sort_txt.sendKeys(pt_sort,enter_key);
        expect(active_check.isSelected()).toBeTruthy();
        active_check.click();
        prompt_ok_btn.click();
        pt_manage_exit_btn.click();
        
        //verify creation
        lib.ui.click(element(by.id('sp_app/menu/setting')));
        lib.ui.click(element(by.id('sp_app/menu/setting/payment_type')));          
        expect(pt_lst.count()).toEqual(1);
        pt_lst.get(0).all(by.css('.btn')).get(0).click();
        expect(active_check.isSelected()).toBeFalsy();
        expect(name_txt.getAttribute('value')).toEqual(pt_name);
        expect(sort_txt.getAttribute('value')).toEqual(pt_sort);

        //edit pt
        var new_pt_name = 'CREDIT CARD';
        var new_pt_sort = 'CC';
        name_txt.clear();
        name_txt.sendKeys(new_pt_name,enter_key);
        sort_txt.clear();
        sort_txt.sendKeys(new_pt_sort,enter_key);
        active_check.click();
        prompt_ok_btn.click();
        pt_manage_exit_btn.click();

        //verify edit
        lib.ui.click(element(by.id('sp_app/menu/setting')));
        lib.ui.click(element(by.id('sp_app/menu/setting/payment_type')));          
        expect(pt_lst.count()).toEqual(1);   
        pt_lst.get(0).all(by.css('.btn')).get(0).click();
        expect(active_check.isSelected()).toBeTruthy();
        expect(name_txt.getAttribute('value')).toEqual(new_pt_name);
        expect(sort_txt.getAttribute('value')).toEqual(new_pt_sort);
        prompt_cancel_btn.click();

        //clean up
        pt_manage_exit_btn.click();
    });
});