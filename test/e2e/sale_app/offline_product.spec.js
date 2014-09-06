var lib = require('./../lib');


describe('sale_app/offline_product', function() {
    /*
        when sku is not exist, it is the create module that kick in which should be tested separatly from this test.
    */
    var baseUrl = 'http://127.0.0.1:8000/';
    var ptor = protractor.getInstance();
    var enter_key = protractor.Key.ENTER;

    //confirm service
    var confirm_dlg = element(by.id('service/ui/confirm/dialog'));
    var confirm_ok_btn = element(by.id('service/ui/confirm/ok_btn'));
    var confirm_cancel_btn = element(by.id('service/ui/confirm/cancel_btn'));

    //prompt service
    var prompt_txt = element(by.id('service/ui/prompt/prompt_txt'));
    var prompt_ok_btn = element(by.id('service/ui/prompt/ok_btn'));
    

    //sp prompt ui
    var sp_prompt_name                  = element(by.id('sp_app/service/prompt/name_txt'));
    var sp_prompt_price                 = element(by.id('sp_app/service/prompt/price_txt'));
    var sp_prompt_crv                   = element(by.id('sp_app/service/prompt/crv_txt'));
    var sp_prompt_cost                  = element(by.id('sp_app/service/prompt/cost_txt'));
    var sp_prompt_p_type                = element(by.id('sp_app/service/prompt/p_type_txt'));
    var sp_prompt_p_tag                 = element(by.id('sp_app/service/prompt/p_tag_txt'));
    var sp_prompt_vendor                = element(by.id('sp_app/service/prompt/vendor_txt'));
    var sp_prompt_buydown               = element(by.id('sp_app/service/prompt/buydown_txt'));  
    var sp_prompt_value_customer_price  = element(by.id('sp_app/service/prompt/value_customer_price_txt')); 
    var sp_prompt_sku                   = element(by.id('sp_app/service/prompt/sku_txt')); 
    var sp_prompt_ok_btn                = element(by.id('sp_app/service/prompt/ok_btn')); 
    var sp_prompt_cancel_btn            = element(by.id('sp_app/service/prompt/cancel_btn')); 

    //sale page
    var non_inv_btn = element(by.id('sale_app/main_page/non_inventory_btn'));
    var void_btn = element(by.id('sale_app/main_page/void_btn'));
    var tender_btn = element(by.id('sale_app/main_page/tender_btn'));
    var ds_lst = element.all(by.repeater('ds in ds_lst'))
    var name_index = 1;
    var price_index = 2;
    
    beforeEach(function(){
        lib.auth.login(baseUrl,'1','1');
        browser.get(baseUrl); 
        lib.setup.init_data();
        lib.auth.logout();
    })

    afterEach(function(){
        lib.auth.logout();
    })

    it('can create and edit offline product',function(){
        lib.auth.login(baseUrl,'1','1');
        lib.sale_page.load_this_page(10000,true/*is_offline*/);
        
        //scan
        var sku = '123';
        lib.sale_page.scan('123');

        //confirm offline message
        expect(confirm_dlg.isPresent()).toBeTruthy();   
        confirm_ok_btn.click();

        //fill out form
        var name = 'offline product';
        var price = 5.43;
        var crv = 0.12;
        var cost = 4.31;
        var p_type = 'type';
        var p_tag = 'tag';
        var vendor = 'vendor';
        var buydown = 1.23;
        var value_customer_price = 4.11;

        sp_prompt_name.sendKeys(name,enter_key);
        sp_prompt_price.sendKeys(price,enter_key);
        sp_prompt_crv.sendKeys(crv,enter_key);
        sp_prompt_cost.sendKeys(cost,enter_key);
        sp_prompt_p_type.sendKeys(p_type,enter_key);
        sp_prompt_p_tag.sendKeys(p_tag,enter_key);
        sp_prompt_vendor.sendKeys(vendor,enter_key);
        sp_prompt_buydown.sendKeys(buydown,enter_key);    
        sp_prompt_value_customer_price.sendKeys(value_customer_price,enter_key); 
        expect(sp_prompt_sku.getAttribute('value')).toEqual(sku);
        sp_prompt_ok_btn.click();

        //verify product is created
        ptor.sleep(2000);//wait for product to be saved offline and rescan
        expect(ds_lst.count()).toEqual(1);
        expect(tender_btn.getText()).toEqual('$4.32');

        //attemp to edit this product offline
        ds_lst.get(0).all(by.tagName('td')).get(name_index).click();

        //verify edit prefill
        expect(sp_prompt_name.getAttribute('value')).toEqual(name);
        expect(sp_prompt_price.getAttribute('value')).toEqual(price.toString());
        expect(sp_prompt_crv.getAttribute('value')).toEqual(crv.toString());
        expect(sp_prompt_cost.getAttribute('value')).toEqual(cost.toString());
        expect(sp_prompt_p_type.getAttribute('value')).toEqual(p_type);
        expect(sp_prompt_p_tag.getAttribute('value')).toEqual(p_tag);
        expect(sp_prompt_vendor.getAttribute('value')).toEqual(vendor.toString());
        expect(sp_prompt_buydown.getAttribute('value')).toEqual(buydown.toString());
        expect(sp_prompt_value_customer_price.getAttribute('value')).toEqual(value_customer_price.toString());

        //edit data
        name = 'offline product_';
        price = 7.42;
        crv = 1.31;
        cost = 4.21;
        p_type = 'type_';
        p_tag = 'tag_';
        vendor = 'vendor_';
        buydown = 0.21;
        value_customer_price = 4.13;

        sp_prompt_name.clear();
        sp_prompt_price.clear();
        sp_prompt_crv.clear();
        sp_prompt_cost.clear();
        sp_prompt_p_type.clear();
        sp_prompt_p_tag.clear();
        sp_prompt_vendor.clear();
        sp_prompt_buydown.clear();
        sp_prompt_value_customer_price.clear();

        sp_prompt_name.sendKeys(name,enter_key);
        sp_prompt_price.sendKeys(price,enter_key);
        sp_prompt_crv.sendKeys(crv,enter_key);
        sp_prompt_cost.sendKeys(cost,enter_key);
        sp_prompt_p_type.sendKeys(p_type,enter_key);
        sp_prompt_p_tag.sendKeys(p_tag,enter_key);
        sp_prompt_vendor.sendKeys(vendor,enter_key);
        sp_prompt_buydown.sendKeys(buydown,enter_key);    
        sp_prompt_value_customer_price.sendKeys(value_customer_price,enter_key);       
        sp_prompt_ok_btn.click();  

        //verify edit result 
        ptor.sleep(2000);//wait for product to be saved offline and rescan
        expect(ds_lst.count()).toEqual(1);
        expect(tender_btn.getText()).toEqual('$8.52');      

        //come back to verify edit is success  
        ds_lst.get(0).all(by.tagName('td')).get(name_index).click();
        expect(sp_prompt_name.getAttribute('value')).toEqual(name);
        expect(sp_prompt_price.getAttribute('value')).toEqual(price.toString());
        expect(sp_prompt_crv.getAttribute('value')).toEqual(crv.toString());
        expect(sp_prompt_cost.getAttribute('value')).toEqual(cost.toString());
        expect(sp_prompt_p_type.getAttribute('value')).toEqual(p_type);
        expect(sp_prompt_p_tag.getAttribute('value')).toEqual(p_tag);
        expect(sp_prompt_vendor.getAttribute('value')).toEqual(vendor.toString());
        expect(sp_prompt_buydown.getAttribute('value')).toEqual(buydown.toString());
        expect(sp_prompt_value_customer_price.getAttribute('value')).toEqual(value_customer_price.toString());      
        sp_prompt_cancel_btn.click();  

        //clean up
        void_btn.click();

    },60000);
});