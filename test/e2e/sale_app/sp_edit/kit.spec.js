var base_path = './../../';
var lib = require(base_path + 'lib');

describe('sale page', function() {

    var Sale_page = require(base_path + 'page/sale/Sale_page.js');
    var Sp_page = require(base_path + 'page/sp/Sp_page.js');
    var Sp_info_dlg = require(base_path + 'page/sp/Sp_info_dlg.js');
    var Sp_kit_dlg = require(base_path + 'page/sp/edit/Sp_kit_dlg.js');
    var Sp_kit_prompt_dlg = require(base_path + 'page/sp/edit/Sp_kit_prompt_dlg.js');
    var Sp_prompt_dlg = require(base_path + 'page/sp/Sp_prompt_dlg.js');
    var Sp_search_single_dlg = require(base_path + 'page/sp/search/Single_dlg.js');
    var Ui_alert_dlg = require(base_path + 'page/ui/Alert_dlg.js');

    beforeEach(function(){
        lib.auth.login('1','1');
        lib.setup.init_data();
        lib.auth.logout();
    });

    it('can create,edit,delete kit',function(){
        //fixture: create 3 product
        lib.auth.login('1','1');
        var sku_1 = '1';var product_name_1 = 'product name 1';var product_price_1=1;
        var sku_2 = '2';  
        var sku_3 = '3';
        lib.api.insert_new(sku_1,product_name_1,product_price_1);
        lib.api.insert_new(sku_2,'product name 2'/*name*/);
        lib.api.insert_new(sku_3,'product name 3'/*name*/,null/*price*/,null/*value_customer_price*/,1.1/*crv*/,null/*is_taxable*/,null/*is_sale_report*/,null/*p_type*/,null/*p_tag*/,2.2/*cost*/,null/*vendor*/,3.3/*buydown*/);

        //load sale page and scan 3 product
        Sale_page.visit();
        Sale_page.scan(sku_1);
        Sale_page.scan(sku_2);
        Sale_page.scan(sku_3);
        expect(Sale_page.lst.count()).toEqual(3);

        //add 2 and 3 into 1        
        Sale_page.click_col(0,'name');
        Sp_info_dlg.switch_tab('kit');
        Sp_info_dlg.edit();
        
        Sp_kit_dlg.add();
        Sp_kit_prompt_dlg.set_qty(2);
        Sp_kit_prompt_dlg.prompt_sp();
        Sp_search_single_dlg.search(sku_2);
        Sp_search_single_dlg.click_col(0,'select');
        Sp_kit_prompt_dlg.ok();
        Sp_kit_dlg.add();
        Sp_kit_prompt_dlg.set_qty(3);
        Sp_kit_prompt_dlg.prompt_sp();
        Sp_search_single_dlg.search(sku_3);
        Sp_search_single_dlg.click_col(0,'select');
        Sp_kit_prompt_dlg.ok();

        Sp_kit_dlg.ok();
        Sp_info_dlg.exit();

        //add 3 into 2
        Sale_page.click_col(1,'name');
        Sp_info_dlg.switch_tab('kit');
        Sp_info_dlg.edit();     

        Sp_kit_dlg.add();
        Sp_kit_prompt_dlg.set_qty(3);
        Sp_kit_prompt_dlg.prompt_sp();
        Sp_search_single_dlg.search(sku_3);
        Sp_search_single_dlg.click_col(0,'select'); 
        Sp_kit_prompt_dlg.ok();

        Sp_kit_dlg.ok();
        Sp_info_dlg.exit();

        //VERIFY CIRCULAR VALIDATION: add 2 into 3 and it should failed
        //search for product 3
        Sale_page.click_col(2,'name');
        Sp_info_dlg.switch_tab('kit');
        Sp_info_dlg.edit();  

        //add product 2
        Sp_kit_dlg.add();
        Sp_kit_prompt_dlg.set_qty(2);
        Sp_kit_prompt_dlg.prompt_sp();
        Sp_search_single_dlg.search(sku_2);
        Sp_search_single_dlg.click_col(0,'select');
        Sp_kit_prompt_dlg.ok();

        //alert
        expect(Ui_alert_dlg.self.isPresent()).toBeTruthy();
        Ui_alert_dlg.ok();
        Sp_kit_dlg.cancel();
        Sp_info_dlg.exit();

        //verify kit calculation of product 1
        Sale_page.click_col(0,'name');
        Sp_info_dlg.edit(); 
        expect(Sp_prompt_dlg.get_crv()).toEqual('9.9');
        expect(Sp_prompt_dlg.get_cost()).toEqual('19.8');
        expect(Sp_prompt_dlg.get_buydown()).toEqual('29.7');
        Sp_prompt_dlg.cancel();
        Sp_info_dlg.exit();

        //edit and remove kit info of product 1
        Sale_page.click_col(0,'name');
        Sp_info_dlg.switch_tab('kit');
        Sp_info_dlg.edit();

        expect(Sp_kit_dlg.lst.count()).toEqual(2);
        Sp_kit_dlg.click_col(0,'remove');
        Sp_kit_dlg.click_col(0,'edit');
        Sp_kit_prompt_dlg.set_qty(2);
        Sp_kit_prompt_dlg.ok();
        Sp_kit_dlg.ok();
        Sp_info_dlg.exit();

        //verify edit and removal of kit info of product 1
        Sale_page.click_col(0,'name');
        Sp_info_dlg.edit(); 
        expect(Sp_prompt_dlg.get_crv()).toEqual('2.2');
        expect(Sp_prompt_dlg.get_cost()).toEqual('4.4');
        expect(Sp_prompt_dlg.get_buydown()).toEqual('6.6');
        Sp_prompt_dlg.cancel();
        Sp_info_dlg.exit();

        //clean up
        Sale_page.void();
        lib.auth.logout();
    },60000)
});