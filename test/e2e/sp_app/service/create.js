var lib = require('./../../lib');


describe('create service', function() {
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

    it(', when searching for sku that is not exist in current store and network,can by pass suggestion and popup prompt to create new product',function(){

        var data = {
            name : 'new product name',
            price : 1.1,
            crv : 2.2,
            is_taxable : true,
            cost : 3.3,
            is_sale_report : true,
            p_type : 'my type',
            p_tag : 'my tag',
            vendor : 'my vendor',
            buydown : 4.4,
            value_customer_price : 5.5,
            sku : '12345'
        }


        lib.auth.login(baseUrl,'1','1');
        browser.get(baseUrl);   
        sku_txt.clear();sku_txt.sendKeys(enter_key);
        sku_txt.sendKeys(data.sku,enter_key);  
        expect(sp_result.count()).toEqual(0);  

        //expect prompt to popup with sku prefill that is disabled
        expect(element(by.id('sp_app/service/prompt/dialog')).isPresent()).toBeTruthy();
        expect(element(by.id('sp_app/service/prompt/is_sale_report')).isSelected).toBeTruthy();
        expect(element(by.id('sp_app/service/prompt/sku_txt')).getAttribute('value')).toEqual(data.sku); 
        expect(element(by.id('sp_app/service/prompt/sku_txt')).isEnabled()).toBeFalsy();

        //fillout & submit form
        element(by.id('sp_app/service/prompt/name_txt')).sendKeys(data.name,enter_key);
        element(by.id('sp_app/service/prompt/price_txt')).sendKeys(data.price,enter_key);
        element(by.id('sp_app/service/prompt/crv_txt')).sendKeys(data.crv,enter_key);
        if(data.is_taxable){
            element(by.id('sp_app/service/prompt/is_taxable_check')).click();
        }
        element(by.id('sp_app/service/prompt/cost_txt')).sendKeys(data.cost,enter_key);
        if(!data.is_sale_report){
            element(by.id('sp_app/service/prompt/is_sale_report_check')).click();
        }    
        element(by.id('sp_app/service/prompt/p_type_txt')).sendKeys(data.p_type,enter_key);
        element(by.id('sp_app/service/prompt/p_tag_txt')).sendKeys(data.p_tag,enter_key);
        element(by.id('sp_app/service/prompt/vendor_txt')).sendKeys(data.vendor,enter_key);
        element(by.id('sp_app/service/prompt/buydown_txt')).sendKeys(data.buydown,enter_key);    
        element(by.id('sp_app/service/prompt/value_customer_price_txt')).sendKeys(data.value_customer_price,enter_key);    
        element(by.id('sp_app/service/prompt/ok_btn')).click();

        //verify new created product
        expect(sp_result.count()).toEqual(1);
        browser.executeAsyncScript(function(data,callback){
            var currencyFilter = angular.injector(['ng']).get('currencyFilter') ;
            var str =
                data.name + ' ' + 
                currencyFilter(data.price) + ' ' +
                currencyFilter(data.crv) + ' ' +
                data.p_type + ' ' +
                data.p_tag + ' ' +
                data.vendor + ' ' +
                currencyFilter(data.cost) + ' ' +
                currencyFilter(data.buydown) + ' ' +
                currencyFilter(data.value_customer_price) 
            ;
            callback(str);
        },data).then(function(str){
            expect(sp_result.get(0).getText()).toEqual(str);
        })
    })

    it(', when searching for sku that is prod_store__prod_sku__0_0.length == 1, can prompt suggestion and fill out selected suggestion',function(){
        //FIXTURE: we going to insert a product into store 2
        lib.auth.login(baseUrl,'2','2');
        var sku='111'
        lib.api.insert_new(sku,'product name');
        lib.auth.logout();

        //TEST
        lib.auth.login(baseUrl,'1','1');
        sku_txt.sendKeys(sku,enter_key); 
        expect(element(by.id('sp_app/service/create/select_suggestion/dialog')).isPresent().toBeTruthy());
        element(by.id('sp_app/service/create/select_suggestion/cancel_btn')).click();
    });

    // it(', when searching for sku that prod_store__prod_sku = 1_0,can suggestion to simply add sku',function(){
    //     // SETUP:
    //     //     insert a product to store 1
    //     //     add this product into store 2.
    //     //     From store 2, we will add a new sku to this product. 
    //     //     From store 1, we will scan this new added sku by store 2
    //     //     A suggestion should be popup for us to simply add sku.
        
    //     lib.auth.login(baseUrl,'1','1');

    //     var original_sku = '111';
    //     lib.api.insert_new(original_sku,'a product name')

    //     lib.auth.logout();
    //     lib.auth.login(baseUrl,'2','2');
    //     lib.api.insert_old
    // })
});