var lib = require('./../lib');


describe('group_app/service/create', function() {
    /*
        when sku is not exist, it is the create module that kick in which should be tested separatly from this test.
    */
    var baseUrl = 'http://127.0.0.1:8000/';
    var ptor = protractor.getInstance();
    var enter_key = protractor.Key.ENTER;
    var prompt_txt = element(by.id('service/ui/prompt/prompt_txt'));
    var prompt_ok_btn = element(by.id('service/ui/prompt/ok_btn'));
    var prompt_cancel_btn = element(by.id('service/ui/prompt/cancel_btn'));
    beforeEach(function(){
        lib.auth.login(baseUrl,'1','1');
        browser.get(baseUrl); 
        lib.setup.init_data();
        lib.auth.logout();
    })

    afterEach(function(){
        lib.auth.logout();
    })

    it('can create,edit,remove group',function(){
        lib.auth.login(baseUrl,'1','1');
        var group_name = 'my group name';
        browser.get(baseUrl);  
 		lib.ui.click(element(by.id('sp_app/menu/setting')));
        lib.ui.click(element(by.id('sp_app/menu/setting/tax')));
        var tax = 9.725;
        prompt_txt.clear();
        prompt_txt.sendKeys(tax,enter_key);
        lib.ui.click(prompt_ok_btn);
 		lib.ui.click(element(by.id('sp_app/menu/setting')));
        lib.ui.click(element(by.id('sp_app/menu/setting/tax')));
        expect(prompt_txt.getAttribute('value')).toEqual(tax.toString());
		lib.ui.click(prompt_cancel_btn);
    })
});