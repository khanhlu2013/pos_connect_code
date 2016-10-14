var base_path = './../../';
var lib = require(base_path + 'lib');

describe('sale_app/setup_pt', function() {


    var Pt_manage_dlg = require(base_path + 'page/payment_type/Manage_dlg.js');
    var Tender_dlg = require(base_path + 'page/sale/Tender_dlg.js');
    var Pt_prompt_dlg = require(base_path + 'page/payment_type/Prompt_dlg.js');
    var Sale_page = require(base_path + 'page/sale/Sale_page.js');


    beforeEach(function(){
        lib.auth.login('1','1');
        lib.setup.init_data();
        lib.auth.logout();
    })

    it('can do it',function(){
        lib.auth.login('1','1');
        var sku = 111;var name = 'product 1';var price = 1;
        lib.api.insert_new(sku,name,price);     
        Sale_page.visit();

        //verify there is no pt beside the default cash
        Sale_page.scan(sku);lib.wait_for_block_ui();
        Sale_page.tender();
        expect(Tender_dlg.lst.count()).toEqual(1);
        Tender_dlg.cancel();

        //create pt_1
        Sale_page.menu_setting_payment_type();
        var pt_name_1 = 'a';
        var pt_sort_1 = 'b';
        Pt_manage_dlg.add();
        Pt_prompt_dlg.set_name(pt_name_1);
        Pt_prompt_dlg.set_sort(pt_sort_1);
        expect(Pt_prompt_dlg.get_is_active()).toBeTruthy();
        Pt_prompt_dlg.ok();
        Pt_manage_dlg.exit();        

        //create pt_2
        Sale_page.menu_setting_payment_type();
        var pt_name_2 = 'b';
        var pt_sort_2 = 'c';
        var pt_is_active_2 = true;

        Pt_manage_dlg.add();
        Pt_prompt_dlg.set_name(pt_name_2);
        Pt_prompt_dlg.set_sort(pt_sort_2);
        expect(Pt_prompt_dlg.get_is_active()).toBeTruthy();
        Pt_prompt_dlg.ok();
        Pt_manage_dlg.exit();

        //verify created 2 pt
        Sale_page.tender();
        expect(Tender_dlg.lst.count()).toEqual(3);
        expect(Tender_dlg.get_pt_label_by_index(1)).toEqual(pt_name_1 + ':');
        expect(Tender_dlg.get_pt_label_by_index(2)).toEqual(pt_name_2 + ':');
        Tender_dlg.cancel();

        //edit sort of pt_2
        var new_sort_pt_2 = 'a';
        Sale_page.menu_setting_payment_type();
        Pt_manage_dlg.click_col(1,'edit');
        Pt_prompt_dlg.set_sort(new_sort_pt_2);
        Pt_prompt_dlg.ok();
        Pt_manage_dlg.exit();  

        //verify new sorted order
        Sale_page.tender();
        expect(Tender_dlg.lst.count()).toEqual(3);

        expect(Tender_dlg.get_pt_label_by_index(1)).toEqual(pt_name_2 + ':');
        expect(Tender_dlg.get_pt_label_by_index(2)).toEqual(pt_name_1 + ':');
        Tender_dlg.cancel();

        //edit active of pt_1
        Sale_page.menu_setting_payment_type();
        Pt_manage_dlg.click_col(1,'edit');
        Pt_prompt_dlg.set_is_active(false);
        Pt_prompt_dlg.ok();
        Pt_manage_dlg.exit();   

        //verify pt_1 is no longer active
        Sale_page.tender();
        expect(Tender_dlg.lst.count()).toEqual(2);
        expect(Tender_dlg.get_pt_label_by_index(1)).toEqual(pt_name_2 + ':');
        Tender_dlg.cancel();

        //clean up
        Sale_page.void();
        lib.auth.logout();
    },60000/*60 second timeout*/)
});