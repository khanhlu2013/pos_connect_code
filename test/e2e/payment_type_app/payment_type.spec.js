var base_path = './../';
var lib = require(base_path + 'lib');

describe('payment_type_app', function() {
    
    //pt_manage_dlg
    var Manage_dlg = require(base_path + 'page/payment_type/Manage_dlg.js');
    var Pt_prompt_dlg = require(base_path + 'page/payment_type/Prompt_dlg.js');
    var Sp_page = require(base_path + 'page/sp/Sp_page.js');

    beforeEach(function(){
        lib.auth.login('1','1');
        lib.setup.init_data();
        lib.auth.logout();
    })

    it('can create,edit,payment type',function(){
        lib.auth.login('1','1'); 
        Sp_page.menu_setting_payment_type();
        expect(Manage_dlg.lst.count()).toEqual(0);

        //create pt
        var pt_name = 'credit card';
        var pt_sort = 'c';
        Manage_dlg.add();
        Pt_prompt_dlg.set_name(pt_name);
        Pt_prompt_dlg.set_sort(pt_sort);
        expect(Pt_prompt_dlg.get_is_active()).toBeTruthy();
        Pt_prompt_dlg.set_is_active(false);
        Pt_prompt_dlg.ok();
        Manage_dlg.exit();

        //verify creation
        Sp_page.menu_setting_payment_type();
        expect(Manage_dlg.lst.count()).toEqual(1);
        Manage_dlg.click_col(0,'edit');
        expect(Pt_prompt_dlg.get_is_active()).toBeFalsy();
        expect(Pt_prompt_dlg.get_name()).toEqual(pt_name);
        expect(Pt_prompt_dlg.get_sort()).toEqual(pt_sort);

        //edit pt
        var new_pt_name = 'CREDIT CARD';
        var new_pt_sort = 'CC';
        Pt_prompt_dlg.set_name(new_pt_name);
        Pt_prompt_dlg.set_sort(new_pt_sort);
        Pt_prompt_dlg.set_is_active(true);
        Pt_prompt_dlg.ok();
        Manage_dlg.exit();

        //verify edit
        Sp_page.menu_setting_payment_type();
        expect(Manage_dlg.lst.count()).toEqual(1);
        Manage_dlg.click_col(0,'edit');
        expect(Pt_prompt_dlg.get_is_active()).toBeTruthy();
        expect(Pt_prompt_dlg.get_name()).toEqual(new_pt_name);
        expect(Pt_prompt_dlg.get_sort()).toEqual(new_pt_sort);
        Pt_prompt_dlg.cancel();

        //clean up
        Manage_dlg.exit();
        lib.auth.logout();        
    });
});