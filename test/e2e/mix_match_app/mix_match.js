var lib = require('./../lib');


describe('group_app/service/create', function() {
    /*
        when sku is not exist, it is the create module that kick in which should be tested separatly from this test.
    */
    var baseUrl = 'http://127.0.0.1:8000/';
    var ptor = protractor.getInstance();
    var enter_key = protractor.Key.ENTER;
    
    var mm_sp_lst = element.all(by.repeater('sp in mm.sp_lst'));

    var mm_manage_add_btn = element(by.id('mix_match_app/service/manage/add_btn'));
    var mm_manage_exit_btn = element(by.id('mix_match_app/service/manage/exit_btn'));

    var mm_prompt_name_txt = element(by.id('mix_match_app/service/prompt/name_txt'));
    var mm_prompt_qty_txt = element(by.id('mix_match_app/service/prompt/qty_txt'));
    var mm_prompt_price_txt = element(by.id('mix_match_app/service/prompt/price_txt'));
    var mm_prompt_include_crv_tax_check = element(by.id('mix_match_app/service/prompt/is_include_crv_tax_check'));
    var mm_prompt_add_sp_btn = element(by.id('mix_match_app/service/prompt/add_sp_btn'));
    var mm_prompt_ok_btn = element(by.id('mix_match_app/service/prompt/ok_btn'));
    var mm_prompt_cancel_btn = element(by.id('mix_match_app/service/prompt/cancel_btn'));

    var search_txt = element(by.id('sp_app/service/search_dlg/multiple/search_txt'));
    var search_result = element.all(by.repeater('sp_multiple in sp_lst'));
    var search_ok_btn = element(by.id('sp_app/service/search_dlg/multiple/ok_btn'));

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

        //CREATE: create a mix match with 2 sp
        lib.auth.login(baseUrl,'1','1');
        browser.get(baseUrl);  
        var name_1 = 'name 1';var name_2 = 'name 2';
        lib.api.insert_new('111',name_1);
        lib.api.insert_new('222',name_2);
        var mm_name = 'mm name'; var mm_price = 1.2; var mm_qty = 3;
        var mm_new_name = 'mm new name';var mm_new_price = 2.3; var mm_new_qty = 4;

        //CREATE MM
        lib.ui.click(element(by.id('sp_app/menu/setting')));
        lib.ui.click(element(by.id('sp_app/menu/setting/mix_match')));
        lib.ui.click(mm_manage_add_btn);
        //fillout form
        mm_prompt_name_txt.sendKeys(mm_name,enter_key);
        mm_prompt_qty_txt.sendKeys(mm_qty,enter_key);
        mm_prompt_price_txt.sendKeys(mm_price,enter_key);
        lib.ui.click(mm_prompt_include_crv_tax_check);
        //add sp
        lib.ui.click(mm_prompt_add_sp_btn);
        search_txt.sendKeys('name',enter_key);
        expect(search_result.count()).toEqual(2);
        lib.ui.click(search_result.get(0).element(by.css('.btn')));
        lib.ui.click(search_result.get(1).element(by.css('.btn')));
        lib.ui.click(search_ok_btn);
        expect(mm_sp_lst.count()).toEqual(2);
        expect(mm_sp_lst.get(0).getText()).toEqual(name_1);
        expect(mm_sp_lst.get(1).getText()).toEqual(name_2);
        lib.ui.click(mm_prompt_ok_btn);
        lib.ui.click(mm_manage_exit_btn);

        //lets comeback and verify the creation info
        lib.ui.click(element(by.id('sp_app/menu/setting')));
        lib.ui.click(element(by.id('sp_app/menu/setting/mix_match')));        
        var mm_lst = element.all(by.repeater('mm in mm_lst'));
        expect(mm_lst.count()).toEqual(1);
        var btn_lst = mm_lst.get(0).all(by.css('.btn'));
        lib.ui.click(btn_lst.get(1));//edit

        expect(mm_prompt_name_txt.getAttribute('value')).toEqual(mm_name);
        expect(mm_prompt_price_txt.getAttribute('value')).toEqual(mm_price.toString());
        expect(mm_prompt_qty_txt.getAttribute('value')).toEqual(mm_qty.toString());
        expect(mm_prompt_include_crv_tax_check.isSelected()).toBeTruthy();

        expect(mm_sp_lst.count()).toEqual(2);
        expect(mm_sp_lst.get(0).getText()).toEqual(name_1);
        expect(mm_sp_lst.get(1).getText()).toEqual(name_2);

        //verify we can edit deal
        mm_prompt_name_txt.clear();
        mm_prompt_name_txt.sendKeys(mm_new_name,enter_key);
        mm_prompt_qty_txt.clear();
        mm_prompt_qty_txt.sendKeys(mm_new_qty,enter_key);
        mm_prompt_price_txt.clear();
        mm_prompt_price_txt.sendKeys(mm_new_price,enter_key);
        lib.ui.click(mm_prompt_include_crv_tax_check);      
        lib.ui.click(mm_sp_lst.get(0).element(by.css('.btn')));
        lib.ui.click(mm_prompt_ok_btn);
        lib.ui.click(mm_manage_exit_btn);

        //lets comeback and verify the edition info
        lib.ui.click(element(by.id('sp_app/menu/setting')));
        lib.ui.click(element(by.id('sp_app/menu/setting/mix_match')));        
        expect(mm_lst.count()).toEqual(1);
        lib.ui.click(btn_lst.get(1));//edit        

        expect(mm_prompt_name_txt.getAttribute('value')).toEqual(mm_new_name);
        expect(mm_prompt_price_txt.getAttribute('value')).toEqual(mm_new_price.toString());
        expect(mm_prompt_qty_txt.getAttribute('value')).toEqual(mm_new_qty.toString());
        expect(mm_prompt_include_crv_tax_check.isSelected()).toBeFalsy();

        expect(mm_sp_lst.count()).toEqual(1);
        expect(mm_sp_lst.get(0).getText()).toEqual(name_2);
        lib.ui.click(mm_prompt_cancel_btn);

        //verify we can delete deal
        lib.ui.click(btn_lst.get(0))
        lib.ui.click(element(by.id('service/ui/confirm/ok_btn')));
        lib.ui.click(mm_manage_exit_btn);

        //lets comeback and verify deletion
        lib.ui.click(element(by.id('sp_app/menu/setting')));
        lib.ui.click(element(by.id('sp_app/menu/setting/mix_match')));        
        expect(mm_lst.count()).toEqual(0);  
        
        //clean up
        lib.ui.click(mm_manage_exit_btn);      
    })
});