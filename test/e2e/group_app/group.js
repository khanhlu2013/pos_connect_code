var lib = require('./../lib');


describe('group_app/service/create', function() {
    /*
        when sku is not exist, it is the create module that kick in which should be tested separatly from this test.
    */
    var baseUrl = 'http://127.0.0.1:8000/';
    var ptor = protractor.getInstance();
    var enter_key = protractor.Key.ENTER;

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

        //CREATE: create a group with 2 sp
        lib.auth.login(baseUrl,'1','1');
        var group_name = 'my group name';
        browser.get(baseUrl);  
        lib.api.insert_new('111','aa'/*name*/);
        lib.api.insert_new('222','ab'/*name*/);
        lib.ui.click(element(by.id('sp_app/menu/setting')));
        lib.ui.click(element(by.id('sp_app/menu/setting/group')));
        lib.ui.click(element(by.id('group_app/service/manage/add_btn')));
        element(by.id('group_app/service/prompt/name_txt')).sendKeys(group_name,enter_key);
        lib.ui.click(element(by.id('group_app/service/prompt/add_btn')));
        element(by.id('sp_app/service/search_dlg/multiple/search_txt')).sendKeys('a',enter_key);
        var search_result_lst = element.all(by.repeater('sp_multiple in sp_lst'));
        expect(search_result_lst.count()).toEqual(2);
        lib.ui.click(search_result_lst.get(0).element(by.css('.btn')));
        lib.ui.click(search_result_lst.get(1).element(by.css('.btn')));
        lib.ui.click(element(by.id('sp_app/service/search_dlg/multiple/ok_btn')));
        lib.ui.click(element(by.id('group_app/service/prompt/ok_btn')));

        //verify group is added and containing 2 sp
        var group_lst = element.all(by.repeater('group in group_lst'));
        expect(group_lst.count()).toEqual(1);
        var btn_lst = group_lst.get(0).all(by.css('.btn'));
        lib.ui.click(btn_lst.get(2));
        var sp_lst = element.all(by.repeater('sp in group.sp_lst'));
        expect(sp_lst.count()).toEqual(2);
        lib.ui.click(element(by.id('group_app/service/prompt/cancel_btn')));

        //REMOVE: can't remove because it is not empty
        lib.ui.click(btn_lst.get(1));
        lib.ui.click(element(by.id('service/ui/confirm/ok_btn')));
        expect(element(by.id('service/ui/alert/dialog')).isPresent()).toBeTruthy();
        lib.ui.click(element(by.id('service/ui/alert/ok_btn')));

        //EDIT: remove both sp, and change name
        var new_group_name = 'my new group name';
        lib.ui.click(btn_lst.get(2));
        expect(sp_lst.count()).toEqual(2);
        lib.ui.click(sp_lst.get(0).element(by.css('.btn')));
        lib.ui.click(sp_lst.get(0).element(by.css('.btn')));
        element(by.id('group_app/service/prompt/name_txt')).clear();
        element(by.id('group_app/service/prompt/name_txt')).sendKeys(new_group_name,enter_key);
        lib.ui.click(element(by.id('group_app/service/prompt/ok_btn')));

        //verify the new edited group
        expect(group_lst.count()).toEqual(1);
        lib.ui.click(btn_lst.get(2));
        expect(sp_lst.count()).toEqual(0);
        expect(element(by.id('group_app/service/prompt/name_txt')).getAttribute('value')).toEqual(new_group_name);
        lib.ui.click(element(by.id('group_app/service/prompt/cancel_btn')));


        //REMOVE
        lib.ui.click(btn_lst.get(1));
        lib.ui.click(element(by.id('service/ui/confirm/ok_btn')));
        expect(group_lst.count()).toEqual(0);

        lib.ui.click(element(by.id('group_app/service/manage/exit_btn')));
    })
});