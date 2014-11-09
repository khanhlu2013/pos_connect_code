var base_path = './../';
var lib = require(base_path + 'lib');

describe('mix match manage in sp_page', function() {
    var Ui_confirm_dlg = require(base_path + 'page/ui/Confirm_dlg.js');
    var Mm_prompt_dlg = require(base_path + 'page/mix_match/Prompt_dlg.js');
    var Mm_manage_dlg = require(base_path + 'page/mix_match/Manage_dlg.js');
    var Sp_search_multiple_dlg = require(base_path + 'page/sp/search/Multiple_dlg.js');
    var Sp_page = require(base_path + 'page/sp/Sp_page.js');

    beforeEach(function(){
        lib.auth.login('1','1');
        lib.setup.init_data();
        lib.auth.logout();
    })

    it('can create,edit,remove mix match deal',function(){
        //CREATE: create a mix match with 2 sp
        lib.auth.login('1','1');
        var name_1 = 'name 1';var name_2 = 'name 2';
        lib.api.insert_new('111',name_1);
        lib.api.insert_new('222',name_2);
        var mm_name = 'mm name'; var mm_price = 1.2; var mm_qty = 3;
        var mm_new_name = 'mm new name';var mm_new_price = 2.3; var mm_new_qty = 4;

        //CREATE MM
        Sp_page.menu_setting_mix_match();
        Mm_manage_dlg.add();

        //fillout form
        Mm_prompt_dlg.set_name(mm_name);
        Mm_prompt_dlg.set_qty(mm_qty);
        Mm_prompt_dlg.set_price(mm_price);
        Mm_prompt_dlg.set_is_include_crv_tax(true);

        //add sp
        Mm_prompt_dlg.add();
        Sp_search_multiple_dlg.search('name');
        expect(Sp_search_multiple_dlg.lst.count()).toEqual(2);
        Sp_search_multiple_dlg.click_col(0,'select');
        Sp_search_multiple_dlg.click_col(1,'select');
        Sp_search_multiple_dlg.ok();

        expect(Mm_prompt_dlg.lst.count()).toEqual(2);
        expect(Mm_prompt_dlg.get_col(0,'product')).toEqual(name_1);
        expect(Mm_prompt_dlg.get_col(1,'product')).toEqual(name_2);
        Mm_prompt_dlg.ok();
        Mm_manage_dlg.exit();

        //lets comeback and verify the creation info
        Sp_page.menu_setting_mix_match();   
        expect(Mm_manage_dlg.lst.count()).toEqual(1);
        Mm_manage_dlg.click_col(0,'edit');
        expect(Mm_prompt_dlg.get_name()).toEqual(mm_name);
        expect(Mm_prompt_dlg.get_price()).toEqual(mm_price.toString());
        expect(Mm_prompt_dlg.get_qty()).toEqual(mm_qty.toString());
        expect(Mm_prompt_dlg.get_is_include_crv_tax()).toBeTruthy();

        expect(Mm_prompt_dlg.lst.count()).toEqual(2);
        expect(Mm_prompt_dlg.get_col(0,'product')).toEqual(name_1);
        expect(Mm_prompt_dlg.get_col(1,'product')).toEqual(name_2);

        //verify we can edit deal
        Mm_prompt_dlg.set_name(mm_new_name);
        Mm_prompt_dlg.set_qty(mm_new_qty);
        Mm_prompt_dlg.set_price(mm_new_price);
        Mm_prompt_dlg.set_is_include_crv_tax(false);
        Mm_prompt_dlg.click_col(0,'remove');
        Mm_prompt_dlg.ok();
        Mm_manage_dlg.exit();

        //lets comeback and verify the edition info
        Sp_page.menu_setting_mix_match();     
        expect(Mm_manage_dlg.lst.count()).toEqual(1);
        Mm_manage_dlg.click_col(0,'edit');
        expect(Mm_prompt_dlg.get_name()).toEqual(mm_new_name);
        expect(Mm_prompt_dlg.get_price()).toEqual(mm_new_price.toString());
        expect(Mm_prompt_dlg.get_qty()).toEqual(mm_new_qty.toString());     
        expect(Mm_prompt_dlg.get_is_include_crv_tax()).toBeFalsy();   

        expect(Mm_prompt_dlg.lst.count()).toEqual(1);
        expect(Mm_prompt_dlg.get_col(0,'product')).toEqual(name_2);
        Mm_prompt_dlg.cancel();

        //verify we can delete deal
        Mm_manage_dlg.click_col(0,'remove');
        Ui_confirm_dlg.ok();
        Mm_manage_dlg.exit();

        //lets comeback and verify deletion
        Sp_page.menu_setting_mix_match();         
        expect(Mm_manage_dlg.lst.count()).toEqual(0);  
        
        //clean up
        Mm_manage_dlg.exit();
        lib.auth.logout();           
    })
});