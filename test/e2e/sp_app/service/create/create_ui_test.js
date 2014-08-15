var lib = require('./../../../lib');



describe('sp_app/service/create - ui test - ', function() {
    /*
        when sku is not exist, it is the create module that kick in which should be tested separatly from this test.
    */
    var baseUrl = 'http://127.0.0.1:8000/';
    var ptor = protractor.getInstance();
    var enter_key = protractor.Key.ENTER;

    var sp_result = element.all(by.repeater('sp in sp_lst'));
    var sku_txt = element(by.model('sku_search_str'));
    var alert_message_lbl = element(by.id('service/ui/alert/message_lbl'));
    var alert_ok_btn = element(by.id('service/ui/alert/ok_btn')); 

    beforeEach(function(){
        lib.auth.login(baseUrl,'1','1');
        browser.get(baseUrl); 
        lib.setup.init_data();
        lib.auth.logout();
    })

    afterEach(function(){
        lib.auth.logout();
    })


    it('with no suggestion, can by pass suggestion prompt and popup sp info prompt to create new product',function(){
        //fixture
        var sku = '111';
        lib.auth.login(baseUrl,'1','1');
        browser.get(baseUrl);   
        sku_txt.clear();sku_txt.sendKeys(enter_key);
        sku_txt.sendKeys(sku,enter_key);  
        expect(sp_result.count()).toEqual(0);  

        //verify prefill
        expect(element(by.id('sp_app/service/prompt/dialog')).isPresent()).toBeTruthy();
        expect(element(by.id('sp_app/service/prompt/is_sale_report_check')).isSelected()).toBeTruthy();
        expect(element(by.id('sp_app/service/prompt/sku_txt')).getAttribute('value')).toEqual(sku); 
        expect(element(by.id('sp_app/service/prompt/sku_txt')).isEnabled()).toBeFalsy();

        //clean up
        lib.ui.click(element(by.id('sp_app/service/prompt/cancel_btn')));        
    })


    it('with 1 pid suggestion but NO crv and cost suggestion, can hide crv and cost suggestion',function(){
        //FIXTURE: we going to insert a product into store 2
        lib.auth.login(baseUrl,'2','2');
        browser.get(baseUrl); 
        var product_name = 'new product name';
        var sku='111'
        lib.api.insert_new(sku,product_name);
        lib.auth.logout();

        //TEST
        lib.auth.login(baseUrl,'1','1');
        browser.get(baseUrl); 
        sku_txt.sendKeys(sku,enter_key); 

        //VERIFY SUGGESTION PROMPT
        expect(element(by.id('sp_app/service/create/select_suggestion/dialog')).isPresent()).toBeTruthy();
        var product_lst = element.all(by.repeater('product in prod_store__prod_sku__0_0'));
        expect(product_lst.count()).toEqual(1);
        var product = product_lst.get(0);
        expect(product.getText()).toEqual(product_name + ' ' + 'import');//fail here

        //VERIFY PROMPT PREFILL SELECTED SUGGESTION
        lib.ui.click(product.element(by.css('.btn')));
        expect(element(by.id('sp_app/service/prompt/dialog')).isPresent()).toBeTruthy();
        expect(element(by.id('sp_app/service/prompt/suggest_crv')).isDisplayed()).toBeFalsy();
        expect(element(by.id('sp_app/service/prompt/suggest_cost')).isDisplayed()).toBeFalsy();

        //clean up
        lib.ui.click(element(by.id('sp_app/service/prompt/cancel_btn')));
    });


    it('with 1 pid suggestion, can show main suggestion but disable extra suggestion',function(){
        //FIXTURE: we going to insert a product into store 2
        lib.auth.login(baseUrl,'2','2');
        browser.get(baseUrl); 
        var name = "new product name";
        var price = 1.1;
        var crv = 2.2;
        var is_taxable = true;
        var cost = 3.3;

        var sku='111'
        lib.api.insert_new(sku,name,price,null/*value_customer_price*/,crv,is_taxable,null/*is_sale_report*/,null/*p_type*/,null/*p_tag*/,cost,null/*vendor*/,null/*buydown*/);
        lib.auth.logout();

        //TEST
        lib.auth.login(baseUrl,'1','1');
        browser.get(baseUrl); 
        sku_txt.sendKeys(sku,enter_key); 

        //verify suggestion prompt
        expect(element(by.id('sp_app/service/create/select_suggestion/dialog')).isPresent()).toBeTruthy();
        var product_lst = element.all(by.repeater('product in prod_store__prod_sku__0_0'));
        expect(product_lst.count()).toEqual(1);
        var product = product_lst.get(0);
        expect(product.getText()).toEqual(name + ' ' + 'import');//fail here

        //verify sp prompt
        lib.ui.click(product.element(by.css('.btn')));
        expect(element(by.id('sp_app/service/prompt/dialog')).isPresent()).toBeTruthy();

        expect(element(by.id('sp_app/service/prompt/suggest_name')).isDisplayed()).toBeTruthy();
        expect(element(by.id('sp_app/service/prompt/suggest_price')).isDisplayed()).toBeTruthy();
        expect(element(by.id('sp_app/service/prompt/suggest_crv')).isDisplayed()).toBeTruthy();
        expect(element(by.id('sp_app/service/prompt/suggest_cost')).isDisplayed()).toBeTruthy();
        expect(element(by.id('sp_app/service/prompt/suggest_taxable')).isDisplayed()).toBeTruthy();

        expect(element(by.id('sp_app/service/prompt/suggest_name_extra_btn')).isEnabled()).toBeFalsy();
        expect(element(by.id('sp_app/service/prompt/suggest_price_extra_btn')).isEnabled()).toBeFalsy();
        expect(element(by.id('sp_app/service/prompt/suggest_crv_extra_btn')).isEnabled()).toBeFalsy();
        expect(element(by.id('sp_app/service/prompt/suggest_cost_extra_btn')).isEnabled()).toBeFalsy();
        expect(element(by.id('sp_app/service/prompt/suggest_taxable_extra_btn')).isEnabled()).toBeFalsy();

        //clean up
        lib.ui.click(element(by.id('sp_app/service/prompt/cancel_btn')));
    });


    it('with 2 pid suggestion, can show main suggestion and extra suggestion',function(){
        //FIXTURE: we going to insert a product into store 2
        var product_id = null;
        var sku='111'      

        lib.auth.login(baseUrl,'2','2');
        browser.get(baseUrl);           
        var name_2 = "new product name 2";
        var price_2 = 1.1;
        var crv_2 = 2.2;
        var is_taxable_2 = true;
        var cost_2 = 3.3;
        lib.api.insert_new(sku,name_2,price_2,null/*value_customer_price*/,crv_2,is_taxable_2,null/*is_sale_report*/,null/*p_type*/,null/*p_tag*/,cost_2,null/*vendor*/,null/*buydown*/)
        .then(function(data){
            product_id = data.product_id;
        })

        lib.auth.logout();
        lib.auth.login(baseUrl,'3','3');
        browser.get(baseUrl); 
        var name_3 = "new product name 3";
        var price_3 = 9.9;
        var crv_3 = 8.8;
        var is_taxable_3 = false;
        var cost_3 = 7.7;
        ptor.wait(function(){
            return product_id != null;//when it is true, quit waiting
        }).then(
            function(){
                lib.api.insert_old(product_id,sku,name_3,price_3,null/*value_customer_price*/,crv_3,is_taxable_3,null/*is_sale_report*/,null/*p_type*/,null/*p_tag*/,cost_3,null/*vendor*/,null/*buydown*/);        
            }
        )

        lib.auth.logout();
        lib.auth.login(baseUrl,'1','1');
        browser.get(baseUrl);         
        sku_txt.sendKeys(sku,enter_key);

        //verify suggestion prompt
        expect(element(by.id('sp_app/service/create/select_suggestion/dialog')).isPresent()).toBeTruthy();
        var product_lst = element.all(by.repeater('product in prod_store__prod_sku__0_0'));
        expect(product_lst.count()).toEqual(1);
        var product = product_lst.get(0);
        expect(product.getText()).toEqual(name_2 + ' ' + 'import');//fail here

        //verify sp prompt
        lib.ui.click(product.element(by.css('.btn')));
        expect(element(by.id('sp_app/service/prompt/dialog')).isPresent()).toBeTruthy();

        expect(element(by.id('sp_app/service/prompt/suggest_name')).isDisplayed()).toBeTruthy();//fail here
        expect(element(by.id('sp_app/service/prompt/suggest_price')).isDisplayed()).toBeTruthy();
        expect(element(by.id('sp_app/service/prompt/suggest_crv')).isDisplayed()).toBeTruthy();
        expect(element(by.id('sp_app/service/prompt/suggest_cost')).isDisplayed()).toBeTruthy();

        expect(element(by.id('sp_app/service/prompt/suggest_name_extra_btn')).isEnabled()).toBeTruthy();
        expect(element(by.id('sp_app/service/prompt/suggest_price_extra_btn')).isEnabled()).toBeTruthy();
        expect(element(by.id('sp_app/service/prompt/suggest_crv_extra_btn')).isEnabled()).toBeTruthy();
        expect(element(by.id('sp_app/service/prompt/suggest_cost_extra_btn')).isEnabled()).toBeTruthy();

        //verify suggest main
        lib.ui.click(element(by.id('sp_app/service/prompt/suggest_name_main_btn')));
        expect(element(by.id('sp_app/service/prompt/name_txt')).getAttribute('value')).toEqual(name_2);
        lib.ui.click(element(by.id('sp_app/service/prompt/suggest_price_main_btn')));
        expect(element(by.id('sp_app/service/prompt/price_txt')).getAttribute('value')).toEqual('5.5');
        lib.ui.click(element(by.id('sp_app/service/prompt/suggest_cost_main_btn')));
        expect(element(by.id('sp_app/service/prompt/cost_txt')).getAttribute('value')).toEqual('5.5');    
        lib.ui.click(element(by.id('sp_app/service/prompt/suggest_taxable_main_btn')));

        //verify suggest_name_extra
        var suggest_name_extra = element.all(by.repeater("sp in suggest_product.sp_lst | orderBy:'name'"));
        expect(suggest_name_extra.count()).toEqual(2);
        lib.ui.click(element(by.id('sp_app/service/prompt/suggest_name_extra_btn')));
        lib.ui.click(suggest_name_extra.get(0).element(by.tagName('a')));
        expect(element(by.id('sp_app/service/prompt/name_txt')).getAttribute('value')).toEqual(name_2);         
        lib.ui.click(element(by.id('sp_app/service/prompt/suggest_name_extra_btn')));
        lib.ui.click(suggest_name_extra.get(1).element(by.tagName('a')));
        expect(element(by.id('sp_app/service/prompt/name_txt')).getAttribute('value')).toEqual(name_3);   

        //verify suggest_price_extra
        var suggest_price_extra = element.all(by.repeater("sp in suggest_product.sp_lst | orderBy:'price'"));
        expect(suggest_price_extra.count()).toEqual(2);
        lib.ui.click(element(by.id('sp_app/service/prompt/suggest_price_extra_btn')));
        lib.ui.click(suggest_price_extra.get(0).element(by.tagName('a')));
        expect(element(by.id('sp_app/service/prompt/price_txt')).getAttribute('value')).toEqual(price_2.toString());
        lib.ui.click(element(by.id('sp_app/service/prompt/suggest_price_extra_btn')));
        lib.ui.click(suggest_price_extra.get(1).element(by.tagName('a')));
        expect(element(by.id('sp_app/service/prompt/price_txt')).getAttribute('value')).toEqual(price_3.toString()); 

        //verify suggest_crv_extra
        var suggest_crv_extra = element.all(by.repeater("sp in suggest_product.sp_lst | orderBy:'get_crv()'"));
        expect(suggest_crv_extra.count()).toEqual(2);
        lib.ui.click(element(by.id('sp_app/service/prompt/suggest_crv_extra_btn')));
        lib.ui.click(suggest_crv_extra.get(0).element(by.tagName('a')));
        expect(element(by.id('sp_app/service/prompt/crv_txt')).getAttribute('value')).toEqual(crv_2.toString());
        lib.ui.click(element(by.id('sp_app/service/prompt/suggest_crv_extra_btn')));
        lib.ui.click(suggest_crv_extra.get(1).element(by.tagName('a')));
        expect(element(by.id('sp_app/service/prompt/crv_txt')).getAttribute('value')).toEqual(crv_3.toString()); 

        //verify suggest_crv_extra
        var suggest_cost_extra = element.all(by.repeater("sp in suggest_product.sp_lst | orderBy:'get_cost()'"));
        expect(suggest_cost_extra.count()).toEqual(2);
        lib.ui.click(element(by.id('sp_app/service/prompt/suggest_cost_extra_btn')));
        lib.ui.click(suggest_cost_extra.get(0).element(by.tagName('a')));
        expect(element(by.id('sp_app/service/prompt/cost_txt')).getAttribute('value')).toEqual(cost_2.toString());
        lib.ui.click(element(by.id('sp_app/service/prompt/suggest_cost_extra_btn')));
        lib.ui.click(suggest_cost_extra.get(1).element(by.tagName('a')));
        expect(element(by.id('sp_app/service/prompt/cost_txt')).getAttribute('value')).toEqual(cost_3.toString()); 

        //verify suggest_taxable_extra
        var suggest_taxable_extra = element.all(by.repeater("stat in tax_suggest_statistic"));
        expect(suggest_taxable_extra.count()).toEqual(2);
        lib.ui.click(element(by.id('sp_app/service/prompt/suggest_taxable_extra_btn')));
        lib.ui.click(suggest_taxable_extra.get(0).element(by.tagName('a')));
        expect(element(by.id('sp_app/service/prompt/is_taxable_check')).isSelected()).toBeTruthy();
        lib.ui.click(element(by.id('sp_app/service/prompt/suggest_taxable_extra_btn')));
        lib.ui.click(suggest_taxable_extra.get(1).element(by.tagName('a')));
        expect(element(by.id('sp_app/service/prompt/is_taxable_check')).isSelected()).toBeFalsy();

        //clean up
        lib.ui.click(element(by.id('sp_app/service/prompt/cancel_btn')));        
    });

    it('with 3 pid suggestion, can calculate mode suggestion for crv and taxable and median for cost and price',function(){
        //FIXTURE: we going to insert a product into store 2
        var product_id = null;
        var sku='111'      

        lib.auth.login(baseUrl,'2','2');
        browser.get(baseUrl);           
        var name_2 = "new product name 2";
        var price_2 = 1.1;
        var crv_2 = 2.2;
        var is_taxable_2 = true;
        var cost_2 = 3.3;
        lib.api.insert_new(sku,name_2,price_2,null/*value_customer_price*/,crv_2,is_taxable_2,null/*is_sale_report*/,null/*p_type*/,null/*p_tag*/,cost_2,null/*vendor*/,null/*buydown*/)
        .then(function(data){
            product_id = data.product_id;
        })

        lib.auth.logout();
        lib.auth.login(baseUrl,'3','3');
        browser.get(baseUrl); 
        var name_3 = "new product name 3";
        var price_3 = 4.4;
        var crv_3 = 2.2;
        var is_taxable_3 = true;
        var cost_3 = 6.6;
        ptor.wait(function(){
            return product_id != null;//when it is true, quit waiting
        }).then(
            function(){
                lib.api.insert_old(product_id,sku,name_3,price_3,null/*value_customer_price*/,crv_3,is_taxable_3,null/*is_sale_report*/,null/*p_type*/,null/*p_tag*/,cost_3,null/*vendor*/,null/*buydown*/);        
            }
        )

        lib.auth.logout();
        lib.auth.login(baseUrl,'4','4');
        browser.get(baseUrl); 
        var name_4 = "new product name 4";
        var price_4 = 7.7;
        var crv_4 = 8.8;
        var is_taxable_4 = false;
        var cost_4 = 9.9;
        ptor.wait(function(){
            return product_id != null;//when it is true, quit waiting
        }).then(
            function(){
                lib.api.insert_old(product_id,sku,name_4,price_4,null/*value_customer_price*/,crv_4,is_taxable_4,null/*is_sale_report*/,null/*p_type*/,null/*p_tag*/,cost_4,null/*vendor*/,null/*buydown*/);        
            }
        )

        lib.auth.logout();
        lib.auth.login(baseUrl,'1','1');
        browser.get(baseUrl);         
        sku_txt.sendKeys(sku,enter_key);

        //verify suggestion prompt
        expect(element(by.id('sp_app/service/create/select_suggestion/dialog')).isPresent()).toBeTruthy();
        var product_lst = element.all(by.repeater('product in prod_store__prod_sku__0_0'));
        expect(product_lst.count()).toEqual(1);
        var product = product_lst.get(0);
        expect(product.getText()).toEqual(name_2 + ' ' + 'import'); //fail here

        //verify sp prompt
        lib.ui.click(product.element(by.css('.btn')));

        //verify suggest main
        lib.ui.click(element(by.id('sp_app/service/prompt/suggest_price_main_btn')));
        expect(element(by.id('sp_app/service/prompt/price_txt')).getAttribute('value')).toEqual('4.4');
        lib.ui.click(element(by.id('sp_app/service/prompt/suggest_crv_main_btn')));
        expect(element(by.id('sp_app/service/prompt/crv_txt')).getAttribute('value')).toEqual('2.2');                  
        lib.ui.click(element(by.id('sp_app/service/prompt/suggest_cost_main_btn')));
        expect(element(by.id('sp_app/service/prompt/cost_txt')).getAttribute('value')).toEqual('6.6');    
        lib.ui.click(element(by.id('sp_app/service/prompt/suggest_taxable_main_btn')));
        expect(element(by.id('sp_app/service/prompt/is_taxable_check')).isSelected()).toBeTruthy();

        //clean up
        lib.ui.click(element(by.id('sp_app/service/prompt/cancel_btn')));        
    });
});

