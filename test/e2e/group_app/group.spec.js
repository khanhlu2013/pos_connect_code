var base_path = './../';
var lib = require(base_path + 'lib');

describe('group_app/service/create', function() {
    var Sp_page = require(base_path + 'page/sp/Sp_page.js');
    var Group_manage_dlg = require(base_path + 'page/group/Manage_dlg.js');
    var Group_prompt_dlg = require(base_path + 'page/group/Prompt_dlg.js');
    var Sp_multiple_dlg = require(base_path + 'page/sp/search/Multiple_dlg.js');
    var Ui_alert_dlg = require(base_path + 'page/ui/Alert_dlg.js');
    var Ui_confirm_dlg = require(base_path + 'page/ui/Confirm_dlg.js');

    beforeEach(function(){
        lib.auth.login('1','1');
        lib.setup.init_data();
        lib.auth.logout();
    })

    it('can create,edit,remove group',function(){
        lib.auth.login('1','1');
        var group_name = 'my group name';
        lib.api.insert_new('111','aa'/*name*/);
        lib.api.insert_new('222','ab'/*name*/);
        
        Sp_page.menu_setting_group();
        Group_manage_dlg.add();
        Group_prompt_dlg.set_name(group_name);
        Group_prompt_dlg.add();
        Sp_multiple_dlg.search('a');

        expect(Sp_multiple_dlg.lst.count()).toEqual(2);
        Sp_multiple_dlg.click_col(0,'select');
        Sp_multiple_dlg.click_col(1,'select');
        Sp_multiple_dlg.ok();
        Group_prompt_dlg.ok();

        //verify group is added and containing 2 sp
        expect(Group_manage_dlg.lst.count()).toEqual(1);
        Group_manage_dlg.click_col(0,'edit');

        expect(Group_prompt_dlg.lst.count()).toEqual(2);
        Group_prompt_dlg.cancel();

        //REMOVE: can't remove because it is not empty
        Group_manage_dlg.click_col(0,'remove');
        Ui_confirm_dlg.ok();
        expect(Ui_alert_dlg.self.isPresent()).toBeTruthy();
        Ui_alert_dlg.ok();

        //EDIT: remove both sp, and change name
        var new_group_name = 'my new group name';
        Group_manage_dlg.click_col(0,'edit');
        expect(Group_prompt_dlg.lst.count()).toEqual(2);
        Group_prompt_dlg.click_col(0,'remove');
        Group_prompt_dlg.click_col(0,'remove');
        Group_prompt_dlg.set_name(new_group_name);
        Group_prompt_dlg.ok();

        //verify the new edited group
        expect(Group_manage_dlg.lst.count()).toEqual(1);
        Group_manage_dlg.click_col(0,'edit');
        expect(Group_prompt_dlg.lst.count()).toEqual(0);
        expect(Group_prompt_dlg.get_name()).toEqual(new_group_name);
        Group_prompt_dlg.cancel();

        //REMOVE
        Group_manage_dlg.click_col(0,'remove');
        Ui_confirm_dlg.ok();
        expect(Group_manage_dlg.lst.count()).toEqual(0);
        Group_manage_dlg.exit();

        //clearn up
        lib.auth.logout();
    })
});