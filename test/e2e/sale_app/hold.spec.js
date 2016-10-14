var base_path = './../';
var lib = require(base_path + 'lib');

describe('sale_app/hold', function() {
    var Sale_page = require(base_path + 'page/sale/Sale_page.js');
    var Ui_confirm_dlg = require(base_path + 'page/ui/Confirm_dlg.js');
    var Get_hold_dlg = require(base_path + 'page/sale/Get_hold_dlg.js');

    beforeEach(function(){
        lib.auth.login('1','1');
        lib.setup.init_data();
        lib.auth.logout();
    })

    function hold_cur_ps(){
        Sale_page.menu_action_hold();
        Ui_confirm_dlg.ok();
    }

    it('can create,edit,remove shortcut',function(){
        lib.auth.login('1','1');

        //------------
        // create 3 sp
        //------------
        var sku_1 = '111';
        var sku_2 = '222';
        var sku_3 = '333';
        var product_name_1 = 'product name 1';
        var product_name_2 = 'product name 2';
        var product_name_3 = 'proudct name 3';
        lib.api.insert_new(sku_1,product_name_1);
        lib.api.insert_new(sku_2,product_name_2);  
        lib.api.insert_new(sku_3,product_name_3); 
        Sale_page.visit();

        //when there is nothing on hold, ok button will be disable
        Sale_page.menu_action_get_hold();
        expect(Get_hold_dlg.ok_btn.getAttribute('disabled')).toBeTruthy();
        Get_hold_dlg.cancel();

        //------------------------------------------------------------------------------------------------------------
        // create 2 hold and one pending scan, which is need so that get hold will prompt to hold current pending scan
        //------------------------------------------------------------------------------------------------------------
        Sale_page.scan(sku_1);lib.wait_for_block_ui();
        hold_cur_ps();
        Sale_page.scan(sku_2);lib.wait_for_block_ui();
        hold_cur_ps();
        Sale_page.scan(sku_3);lib.wait_for_block_ui();

        //---------------------------
        // verify 2 current hold data
        //---------------------------
        Sale_page.menu_action_get_hold();
        expect(Get_hold_dlg.hold.lst.count()).toEqual(2);
        expect(Get_hold_dlg.hold_ln.lst.count()).toEqual(0);
        Get_hold_dlg.hold.click_col(0,'select');

        expect(Get_hold_dlg.hold_ln.get_col(0,'product')).toEqual(product_name_1);
        Get_hold_dlg.hold.click_col(1,'select');
        expect(Get_hold_dlg.hold_ln.get_col(0,'product')).toEqual(product_name_2);
        
        //-----------------------------------------------------------------------------------------------
        // when getting a hold (hold number 2), it will prompt us to confirm holding current pending scan
        //----------------------------------------------------------------------------------------------- 
        Get_hold_dlg.ok();
        expect(Ui_confirm_dlg.message_lbl.getText()).toEqual('we need to hold current scan. continue?');
        Ui_confirm_dlg.ok();

        //-----------------------------------------------------------
        // confirm hold number 2 is retrive and loaded into sale page
        //-----------------------------------------------------------
        expect(Sale_page.lst.count()).toEqual(1);
        expect(Sale_page.get_col(0,'name')).toEqual(product_name_2);

        //-------------------------------------------
        // expect product 1 and 3 is currenty on hold
        //-------------------------------------------
        Sale_page.menu_action_get_hold();
        expect(Get_hold_dlg.hold.lst.count()).toEqual(2);
        expect(Get_hold_dlg.hold_ln.lst.count()).toEqual(0);
        Get_hold_dlg.hold.click_col(0,'select');
        expect(Get_hold_dlg.hold_ln.get_col(0,'product')).toEqual(product_name_1);
        Get_hold_dlg.hold.click_col(1,'select');
        expect(Get_hold_dlg.hold_ln.get_col(0,'product')).toEqual(product_name_3); 
        Get_hold_dlg.cancel();

        //---------
        // clean up
        //---------
        Sale_page.void();
        lib.auth.logout();
    })
});