var base_path = './../../';
var lib = require(base_path + 'lib');

describe('sale page', function() {

    var Sale_page = require(base_path + 'page/sale/Sale_page.js');
    var Mm_prompt_dlg = require(base_path + 'page/mix_match/Prompt_dlg.js');
    var Mm_manage_dlg = require(base_path + 'page/mix_match/Manage_dlg.js');    

    beforeEach(function(){
        lib.auth.login('1','1');
        lib.setup.init_data();
        lib.auth.logout();
    })

    it('can watch for mm_lst change and refresh ds',function(){
        lib.auth.login('1','1');

        //insert sp
        var product_name = 'deal product';
        var product_sku = '111';
        var product_price = 1.8;
        var product_crv = 0.2
        var sp = null;
        lib.api.insert_new(product_sku,product_name,product_price,null/*val_cus_price*/,product_crv).then(
            function(created_sp){
                sp = created_sp
            }
        )

        //insert deal
        var _3_deal_name = "3 items deal";var _3_deal_price = 4; var _3_deal_is_include = false; _3_deal_qty = 3;
        var _5_deal_name = "5 items deal";var _5_deal_price = 5; var _5_deal_is_include = false; _5_deal_qty = 5;
        browser.wait(function(){
            return sp !== null;
        }).then(function(){
            lib.api.insert_mm(_3_deal_name,_3_deal_price,_3_deal_is_include,_3_deal_qty,[sp],false);
            lib.api.insert_mm(_5_deal_name,_5_deal_price,_5_deal_is_include,_5_deal_qty,[sp],false);
        });

        //lets test 5 element of a deal: qty,price,is_include_crv_tax,is_disable,sp_lst
        Sale_page.visit();
        
        //qty
        Sale_page.scan('4 ' + product_sku);lib.wait_for_block_ui();
        expect(Sale_page.lst.count()).toEqual(2);
        Sale_page.menu_setting_mix_match();
        Mm_manage_dlg.click_col(0,'edit');
        Mm_prompt_dlg.set_qty(4);
        Mm_prompt_dlg.ok();
        Mm_manage_dlg.exit();
        lib.wait_for_block_ui();
        expect(Sale_page.lst.count()).toEqual(1);        
        expect(Sale_page.tender_btn.getText()).toEqual('$4.80');

        //price
        _3_deal_price_new = 4.6;
        Sale_page.menu_setting_mix_match();
        Mm_manage_dlg.click_col(0,'edit');
        Mm_prompt_dlg.set_price(_3_deal_price_new);
        Mm_prompt_dlg.ok();
        Mm_manage_dlg.exit();
        expect(Sale_page.tender_btn.getText()).toEqual('$5.40');

        //is_include_crv_tax
        Sale_page.menu_setting_mix_match();
        Mm_manage_dlg.click_col(0,'edit');
        Mm_prompt_dlg.set_is_include_crv_tax(true);
        Mm_prompt_dlg.ok();
        Mm_manage_dlg.exit();
        expect(Sale_page.tender_btn.getText()).toEqual(lib.currency(_3_deal_price_new));

        //is_disable
        Sale_page.menu_setting_mix_match();
        Mm_manage_dlg.click_col(0,'edit');
        Mm_prompt_dlg.set_is_disable(true);
        Mm_prompt_dlg.ok();
        Mm_manage_dlg.exit();
        expect(Sale_page.tender_btn.getText()).toEqual('$8.00');

        //clean up
        Sale_page.void();
    },60000/*60 second timeout*/)
});