var lib = require('./../../../lib');


describe('sp_app/service/edit/group', function() {
    /*
        when sku is not exist, it is the create module that kick in which should be tested separatly from this test.
    */
    var baseUrl = 'http://127.0.0.1:8000/';
    var ptor = protractor.getInstance();
    var enter_key = protractor.Key.ENTER;
    var sp_result = element.all(by.repeater('sp in sp_lst'));
    var sku_txt = element(by.model('sku_search_str'));

    beforeEach(function(){
        lib.auth.login(baseUrl,'1','1');
        browser.get(baseUrl); 
        lib.setup.init_data();
        lib.auth.logout();
    })

    afterEach(function(){
        lib.auth.logout();
    })

    it('can add and remove group',function(){

        //fixture create sp
        lib.auth.login(baseUrl,'1','1');
        browser.get(baseUrl);  

        var group_name = 'my group name';
        var sku = '111';
        lib.api.insert_new(sku,'aa'/*name*/);

        //fixture: create emtpy group
        lib.ui.click(element(by.id('sp_app/menu/setting')));
        lib.ui.click(element(by.id('sp_app/menu/setting/group')));
        lib.ui.click(element(by.id('group_app/service/manage/add_btn')));
        element(by.id('group_app/service/prompt/name_txt')).sendKeys(group_name,enter_key);
        lib.ui.click(element(by.id('group_app/service/prompt/ok_btn')));
        lib.ui.click(element(by.id('group_app/service/manage/exit_btn')));

        //add group to sp
        sku_txt.sendKeys(sku,enter_key);
        expect(sp_result.count()).toEqual(1);
        lib.ui.click(sp_result.get(0).element(by.css('.btn')));
        lib.ui.click(element(by.id('sp_app/service/info/tab/group')));
        lib.ui.click(element(by.id('sp_app/service/info/edit_btn')));
        lib.ui.click(element(by.id('sp_app/service/edit/group/add_btn')));
        var select_group_lst = element.all(by.repeater('group in group_lst'));
        expect(select_group_lst.count()).toEqual(1);
        lib.ui.click(select_group_lst.get(0).element(by.css('.btn')));
        lib.ui.click(element(by.id('group_app/service/search_dlg/multiple/ok_btn')));
        lib.ui.click(element(by.id('sp_app/service/edit/group/ok_btn')));
        //verify sp info display 1 group
        var info_group_lst = element.all(by.repeater('group_info in sp.group_lst'));
        expect(info_group_lst.count()).toEqual(1);

        //remove group
        lib.ui.click(element(by.id('sp_app/service/info/edit_btn')));
        var group_lst = element.all(by.repeater('group_edit in sp.group_lst'))
        expect(group_lst.count()).toEqual(1);
        lib.ui.click(group_lst.get(0).element(by.css('.btn')));
        lib.ui.click(element(by.id('sp_app/service/edit/group/ok_btn')));
        expect(info_group_lst.count()).toEqual(0);

        lib.ui.click(element(by.id('sp_app/service/info/exit_btn')));


    })
});