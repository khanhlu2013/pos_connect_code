var lib = require('./../../../lib');


describe('sp_app/service/edit/kit', function() {
    /*
        when sku is not exist, it is the create module that kick in which should be tested separatly from this test.
    */
    var baseUrl = 'http://127.0.0.1:8000/';
    var ptor = protractor.getInstance();
    var enter_key = protractor.Key.ENTER;
    var sp_result = element.all(by.repeater('sp in sp_lst'));
    var sku_txt = element(by.model('sku_search_str'));

    var sp_info_tab_kit = element(by.id('sp_app/service/info/tab/kit'));
    var sp_info_edit_btn = element(by.id('sp_app/service/info/edit_btn'));
    var sp_info_exit_btn = element(by.id('sp_app/service/info/exit_btn'));
    var sp_edit_kit_add_btn = element(by.id('sp_app/service/edit/kit/add_btn')); 
    var sp_edit_kit_ok_btn = element(by.id('sp_app/service/edit/kit/ok_btn'));
    var sp_edit_kit_cancel_btn = element(by.id('sp_app/service/edit/kit/cancel_btn'));
    var kit_prompt_qty = element(by.id('sp_app/service/edit/kit/prompt/qty_txt')); 
    var kit_prompt_sp = element(by.id('sp_app/service/edit/kit/prompt/sp_btn'));
    var kit_prompt_ok_btn = element(by.id('sp_app/service/edit/kit/prompt/ok_btn'));
    var search_txt = element(by.id('sp_app/service/search_dlg/single/search_txt'));
    var search_result = element.all(by.repeater('search_sp_single in sp_lst'));

    beforeEach(function(){
        lib.auth.login(baseUrl,'1','1');
        browser.get(baseUrl);
        lib.setup.init_data();
        lib.auth.logout();
    });

    afterEach(function(){
        lib.auth.logout();
    });

    it('can create kit',function(){
        //fixture: create 3 product
        lib.auth.login(baseUrl,'1','1');
        browser.get(baseUrl);
        var sku_1 = '1';var product_name_1 = 'product name 1';var product_price_1=1;
        var sku_2 = '2';  
        var sku_3 = '3';
        lib.api.insert_new(sku_1,product_name_1,product_price_1);
        lib.api.insert_new(sku_2,'product name 2'/*name*/);
        lib.api.insert_new(sku_3,'product name 3'/*name*/,null/*price*/,null/*value_customer_price*/,1.1/*crv*/,null/*is_taxable*/,null/*is_sale_report*/,null/*p_type*/,null/*p_tag*/,2.2/*cost*/,null/*vendor*/,3.3/*buydown*/);

        //add 2 and 3 into 1        
        sku_txt.clear();sku_txt.sendKeys(enter_key);
        sku_txt.sendKeys(sku_1,enter_key);  
        expect(sp_result.count()).toEqual(1);  
        lib.ui.click(sp_result.get(0).element(by.css('.btn')));
        lib.ui.click(sp_info_tab_kit);
        lib.ui.click(sp_info_edit_btn)
        
        lib.ui.click(sp_edit_kit_add_btn)
        kit_prompt_qty.sendKeys('2',enter_key)
        lib.ui.click(kit_prompt_sp);
        search_txt.sendKeys(sku_2,enter_key);
        lib.ui.click(search_result.get(0).element(by.css('.btn')));
        lib.ui.click(kit_prompt_ok_btn);

        lib.ui.click(sp_edit_kit_add_btn);
        kit_prompt_qty.sendKeys('3',enter_key)
        lib.ui.click(kit_prompt_sp);
        search_txt.sendKeys(sku_3,enter_key);
        lib.ui.click(search_result.get(0).element(by.css('.btn')));
        lib.ui.click(kit_prompt_ok_btn);

        lib.ui.click(sp_edit_kit_ok_btn);
        lib.ui.click(sp_info_exit_btn);

        //add 3 into 2
        sku_txt.clear();sku_txt.sendKeys(enter_key);
        sku_txt.sendKeys(sku_2,enter_key);  
        expect(sp_result.count()).toEqual(1);  
        lib.ui.click(sp_result.get(0).element(by.css('.btn')));
        lib.ui.click(sp_info_tab_kit);
        lib.ui.click(sp_info_edit_btn);      

        lib.ui.click(sp_edit_kit_add_btn);
        kit_prompt_qty.sendKeys('3',enter_key)
        lib.ui.click(kit_prompt_sp);
        search_txt.sendKeys(sku_3,enter_key);
        lib.ui.click(search_result.get(0).element(by.css('.btn')));  
        lib.ui.click(kit_prompt_ok_btn);

        lib.ui.click(sp_edit_kit_ok_btn);
        lib.ui.click(sp_info_exit_btn);

        //VERIFY CIRCULAR VALIDATION: add 2 into 3 and it should failed
        sku_txt.clear();sku_txt.sendKeys(enter_key);
        sku_txt.sendKeys(sku_3,enter_key);  
        expect(sp_result.count()).toEqual(1);  
        lib.ui.click(sp_result.get(0).element(by.css('.btn')));
        lib.ui.click(sp_info_tab_kit);
        lib.ui.click(sp_info_edit_btn);   

        lib.ui.click(sp_edit_kit_add_btn);
        kit_prompt_qty.sendKeys('2',enter_key);
        lib.ui.click(kit_prompt_sp);
        search_txt.sendKeys(sku_2,enter_key);
        lib.ui.click(search_result.get(0).element(by.css('.btn'))); 
        lib.ui.click(kit_prompt_ok_btn);

        expect(element(by.id('service/ui/alert/dialog')).isPresent()).toBeTruthy();
        lib.ui.click(element(by.id('service/ui/alert/ok_btn')));
        lib.ui.click(sp_edit_kit_cancel_btn);
        lib.ui.click(sp_info_exit_btn);

        //VERIFY KIT CALCULATION CRV,COST,BUYDOWN
        sku_txt.clear();sku_txt.sendKeys(enter_key);
        sku_txt.sendKeys(sku_1,enter_key);
        var data = {
            name : product_name_1,
            price : product_price_1,
            crv : 9.9,
            is_taxable : true,
            cost : 19.8,
            is_sale_report : true,
            p_type : null,
            p_tag : null,
            vendor : null,
            buydown : 29.7,
            value_customer_price : null,
        }
        lib.product_page.get_line_text(data).then(function(txt){expect(sp_result.get(0).getText()).toEqual(txt);});

        //VERIFY KIT EDIT AND REMOVAL
        lib.ui.click(sp_result.get(0).element(by.css('.btn')));
        lib.ui.click(sp_info_tab_kit);
        lib.ui.click(sp_info_edit_btn);
        var assoc_lst = element.all(by.repeater('assoc in sp.breakdown_assoc_lst'));
        expect(assoc_lst.count()).toEqual(2);
        var btn_lst = assoc_lst.get(0).all(by.css('.btn'))
        //remove kit
        lib.ui.click(btn_lst.get(1));
        //edit kit
        lib.ui.click(btn_lst.get(0));
        kit_prompt_qty.clear();
        kit_prompt_qty.sendKeys('2',enter_key);
        lib.ui.click(kit_prompt_ok_btn);
        lib.ui.click(sp_edit_kit_ok_btn);
        lib.ui.click(sp_info_exit_btn);

        var data = {
            name : product_name_1,
            price : product_price_1,
            crv : 2.2,
            is_taxable : true,
            cost : 4.4,
            is_sale_report : true,
            p_type : null,
            p_tag : null,
            vendor : null,
            buydown : 6.6,
            value_customer_price : null,
        }
        lib.product_page.get_line_text(data).then(function(txt){expect(sp_result.get(0).getText()).toEqual(txt);});        
    })
});