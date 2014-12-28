var base_path = './../';
var lib = require(base_path + 'lib');

describe('report menu in sp page', function() {
    var Sp_page = require(base_path + 'page/sp/Sp_page.js');
    var Report_manage_dlg = require(base_path + 'page/report/Manage_dlg.js');
    var Report_prompt_dlg = require(base_path + 'page/report/Prompt_dlg.js');
    var Sp_multiple_dlg = require(base_path + 'page/sp/search/Multiple_dlg.js');
    var Ui_alert_dlg = require(base_path + 'page/ui/Alert_dlg.js');
    var Ui_confirm_dlg = require(base_path + 'page/ui/Confirm_dlg.js');

    beforeEach(function(){
        lib.auth.login('1','1');
        lib.setup.init_data();
        lib.auth.logout();
    })

    it('can create,edit,remove report',function(){
        lib.auth.login('1','1');
        var report_name = 'my report name';
        lib.api.insert_new('111','aa'/*name*/);
        lib.api.insert_new('222','ab'/*name*/);
        
        Sp_page.menu_report_create();
        Report_manage_dlg.add();
        Report_prompt_dlg.set_name(report_name);
        Report_prompt_dlg.add();
        Sp_multiple_dlg.search('a');

        expect(Sp_multiple_dlg.lst.count()).toEqual(2);
        Sp_multiple_dlg.click_col(0,'select');
        Sp_multiple_dlg.click_col(1,'select');
        Sp_multiple_dlg.ok();
        Report_prompt_dlg.ok();

        //verify report is added and containing 2 sp
        expect(Report_manage_dlg.lst.count()).toEqual(1);
        Report_manage_dlg.click_col(0,'edit');

        expect(Report_prompt_dlg.lst.count()).toEqual(2);
        Report_prompt_dlg.cancel();

        //REMOVE: can't remove because it is not empty
        Report_manage_dlg.click_col(0,'remove');
        Ui_confirm_dlg.ok();
        expect(Ui_alert_dlg.self.isPresent()).toBeTruthy();
        Ui_alert_dlg.ok();

        //EDIT: remove both sp, and change name
        var new_report_name = 'my new report name';
        Report_manage_dlg.click_col(0,'edit');
        expect(Report_prompt_dlg.lst.count()).toEqual(2);
        Report_prompt_dlg.click_col(0,'remove');
        Report_prompt_dlg.click_col(0,'remove');
        Report_prompt_dlg.set_name(new_report_name);
        Report_prompt_dlg.ok();

        //verify the new edited report
        expect(Report_manage_dlg.lst.count()).toEqual(1);
        Report_manage_dlg.click_col(0,'edit');
        expect(Report_prompt_dlg.lst.count()).toEqual(0);
        expect(Report_prompt_dlg.get_name()).toEqual(new_report_name);
        Report_prompt_dlg.cancel();

        //REMOVE
        Report_manage_dlg.click_col(0,'remove');
        Ui_confirm_dlg.ok();
        expect(Report_manage_dlg.lst.count()).toEqual(0);
        Report_manage_dlg.exit();
    },60000)
});