var base_path = './../../../'
var lib = require(base_path + 'lib');

describe('sp page', function() {

    var Sp_page = require(base_path + 'page/sp/Sp_page.js');
    var Sp_info_dlg = require(base_path + 'page/sp/Sp_info_dlg.js');
    var Sp_kit_dlg = require(base_path + 'page/sp/edit/Sp_kit_dlg.js');
    var Sp_kit_prompt_dlg = require(base_path + 'page/sp/edit/Sp_kit_prompt_dlg.js');
    var Sp_search_single_dlg = require(base_path + 'page/sp/search/Single_dlg.js');
    var Ui_alert_dlg = require(base_path + 'page/ui/Alert_dlg.js');

    beforeEach(function(){
        lib.auth.login('1','1');
        lib.setup.init_data();
        lib.auth.logout();
    });

    it('can crud sp.kit',function(){
        //fixture: create 3 product
        lib.auth.login('1','1');
        var sku_1 = '1';var product_name_1 = 'product name 1';var product_price_1=1;
        var sku_2 = '2';  
        var sku_3 = '3';
        lib.api.insert_new(sku_1,product_name_1,product_price_1);
        lib.api.insert_new(sku_2,'product name 2'/*name*/);
        lib.api.insert_new(sku_3,'product name 3'/*name*/,null/*price*/,null/*value_customer_price*/,1.1/*crv*/,null/*is_taxable*/,null/*is_sale_report*/,null/*p_type*/,null/*p_tag*/,2.2/*cost*/,null/*vendor*/,3.3/*buydown*/);

        //add 2 and 3 into 1        
        Sp_page.sku_search(sku_1);
        expect(Sp_page.lst.count()).toEqual(1);  
        Sp_page.click_col(0,'info');
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
        Sp_page.sku_search(sku_2);
        expect(Sp_page.lst.count()).toEqual(1);  
        Sp_page.click_col(0,'info');
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
        Sp_page.sku_search(sku_3);
        expect(Sp_page.lst.count()).toEqual(1);  
        Sp_page.click_col(0,'info');
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

        //VERIFY KIT CALCULATION CRV,COST,BUYDOWN
        Sp_page.sku_search(sku_1);
        expect(Sp_page.get_col(0,'crv')).toEqual('$9.90');
        expect(Sp_page.get_col(0,'cost')).toEqual('$19.80');
        expect(Sp_page.get_col(0,'buydown')).toEqual('$29.70');

        //VERIFY KIT EDIT AND REMOVAL of product 1
        Sp_page.click_col(0,'info');
        Sp_info_dlg.switch_tab('kit');
        Sp_info_dlg.edit();

        expect(Sp_kit_dlg.lst.count()).toEqual(2);
        Sp_kit_dlg.click_col(0,'remove');
        Sp_kit_dlg.click_col(0,'edit');
        Sp_kit_prompt_dlg.set_qty(2);
        Sp_kit_prompt_dlg.ok();
        Sp_kit_dlg.ok();
        Sp_info_dlg.exit();

        expect(Sp_page.get_col(0,'crv')).toEqual('$2.20');
        expect(Sp_page.get_col(0,'cost')).toEqual('$4.40');
        expect(Sp_page.get_col(0,'buydown')).toEqual('$6.60');    

        //clean up
        lib.auth.logout();
    },60000)
});