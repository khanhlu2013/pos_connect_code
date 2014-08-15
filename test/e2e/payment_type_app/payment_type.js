var lib = require('./../lib');


describe('payment_type_app', function() {
    /*
        when sku is not exist, it is the create module that kick in which should be tested separatly from this test.
    */
    var baseUrl = 'http://127.0.0.1:8000/';
    var ptor = protractor.getInstance();
    var enter_key = protractor.Key.ENTER;
    
    var pt_lst = element.all(by.repeater("pt in pt_lst | orderBy:\'name\'"))
    var pt_manage_create_btn = element(by.id('payment_type_app/service/manage/create_btn'));
    var pt_manage_exit_btn = element(by.id('payment_type_app/service/manage/exit_btn'));

    var prompt_txt = element(by.id('service/ui/prompt/prompt_txt'));
    var prompt_ok_btn = element(by.id('service/ui/prompt/ok_btn'));

    var confirm_ok_btn = element(by.id('service/ui/confirm/ok_btn'));

    beforeEach(function(){
        lib.auth.login(baseUrl,'1','1');
        browser.get(baseUrl); 
        lib.setup.init_data();
        lib.auth.logout();
    })

    afterEach(function(){
        lib.auth.logout();
    })

    it('can create,edit,remove payment type',function(){
        lib.auth.login(baseUrl,'1','1');
        browser.get(baseUrl);  
        lib.ui.click(element(by.id('sp_app/menu/setting')));
        lib.ui.click(element(by.id('sp_app/menu/setting/payment_type')));  
        expect(pt_lst.count()).toEqual(0);

        //can create pt
        var pt_name = 'credit card';
        pt_manage_create_btn.click();
        prompt_txt.sendKeys(pt_name,enter_key);
        prompt_ok_btn.click();
        pt_manage_exit_btn.click();
        lib.ui.click(element(by.id('sp_app/menu/setting')));
        lib.ui.click(element(by.id('sp_app/menu/setting/payment_type')));          
        expect(pt_lst.count()).toEqual(1);
        expect(pt_lst.get(0).getText()).toEqual(pt_name);

        //can edit pt
        var new_pt_name = 'CREDIT CARD';
        var btn_lst = pt_lst.get(0).all(by.css('.btn'));
        btn_lst.get(1).click();//edit
        prompt_txt.clear();
        prompt_txt.sendKeys(new_pt_name,enter_key);
        prompt_ok_btn.click();
        pt_manage_exit_btn.click();
        lib.ui.click(element(by.id('sp_app/menu/setting')));
        lib.ui.click(element(by.id('sp_app/menu/setting/payment_type')));          
        expect(pt_lst.count()).toEqual(1);
        expect(pt_lst.get(0).getText()).toEqual(new_pt_name);   
        
        //can delete pt    
        btn_lst.get(0).click();
        confirm_ok_btn.click();
        pt_manage_exit_btn.click();
        lib.ui.click(element(by.id('sp_app/menu/setting')));
        lib.ui.click(element(by.id('sp_app/menu/setting/payment_type')));          
        expect(pt_lst.count()).toEqual(0);         

        //clean up
        pt_manage_exit_btn.click();
    });
});