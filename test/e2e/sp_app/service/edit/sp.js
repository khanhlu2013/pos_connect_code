var lib = require('./../../../lib');


describe('edit service', function() {
    /*
        when sku is not exist, it is the create module that kick in which should be tested separatly from this test.
    */
    var baseUrl = 'http://127.0.0.1:8000/';
    var ptor = protractor.getInstance();
    var enter_key = protractor.Key.ENTER;

    var sp_result = element.all(by.repeater('sp in sp_lst'));
    var sku_txt = element(by.model('sku_search_str'));

    beforeEach(function(){
        lib.auth.login(baseUrl,'1','1');
        browser.get(baseUrl); 
        lib.setup.init_data();
        lib.auth.logout();
    })

    afterEach(function(){
        lib.auth.logout();
    })

    it('can edit product',function(){
        //fixture
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
            sku : '111'
        }
        lib.auth.login(baseUrl,'1','1');
        browser.get(baseUrl);  
        lib.api.insert_new(data.sku,'xxx'/*name*/);

        sku_txt.clear();sku_txt.sendKeys(enter_key);
        sku_txt.sendKeys(data.sku,enter_key);  
        expect(sp_result.count()).toEqual(1);  
        lib.ui.click(sp_result.get(0).element(by.css('.btn')));
        expect(element(by.id('sp_app/service/info/dialog')).isPresent()).toBeTruthy();
        lib.ui.click(element(by.id('sp_app/service/info/edit_btn')));

        //verify prompt ui
        expect(element(by.id('sp_app/service/prompt/dialog')).isPresent()).toBeTruthy();
        expect(element(by.id('sp_app/service/prompt/sku_txt')).isDisplayed()).toBeFalsy();


        //verify suggestion
        expect(element(by.id('sp_app/service/prompt/suggest_name')).isDisplayed()).toBeFalsy();
        expect(element(by.id('sp_app/service/prompt/suggest_price')).isDisplayed()).toBeFalsy();
        expect(element(by.id('sp_app/service/prompt/suggest_crv')).isDisplayed()).toBeFalsy();
        expect(element(by.id('sp_app/service/prompt/suggest_cost')).isDisplayed()).toBeFalsy();
        expect(element(by.id('sp_app/service/prompt/suggest_taxable')).isDisplayed()).toBeFalsy();


        //fillout & submit form
        element(by.id('sp_app/service/prompt/name_txt')).clear();
        element(by.id('sp_app/service/prompt/price_txt')).clear();
        element(by.id('sp_app/service/prompt/crv_txt')).clear();
        element(by.id('sp_app/service/prompt/cost_txt')).clear();
        element(by.id('sp_app/service/prompt/p_type_txt')).clear();
        element(by.id('sp_app/service/prompt/p_tag_txt')).clear();
        element(by.id('sp_app/service/prompt/vendor_txt')).clear();
        element(by.id('sp_app/service/prompt/buydown_txt')).clear();   
        element(by.id('sp_app/service/prompt/value_customer_price_txt')).clear();

        element(by.id('sp_app/service/prompt/name_txt')).sendKeys(data.name,enter_key);
        element(by.id('sp_app/service/prompt/price_txt')).sendKeys(data.price,enter_key);
        element(by.id('sp_app/service/prompt/crv_txt')).sendKeys(data.crv,enter_key);
        element(by.id('sp_app/service/prompt/cost_txt')).sendKeys(data.cost,enter_key);
        element(by.id('sp_app/service/prompt/p_type_txt')).sendKeys(data.p_type,enter_key);
        element(by.id('sp_app/service/prompt/p_tag_txt')).sendKeys(data.p_tag,enter_key);
        element(by.id('sp_app/service/prompt/vendor_txt')).sendKeys(data.vendor,enter_key);
        element(by.id('sp_app/service/prompt/buydown_txt')).sendKeys(data.buydown,enter_key);    
        element(by.id('sp_app/service/prompt/value_customer_price_txt')).sendKeys(data.value_customer_price,enter_key);   

        //verify new created product
        lib.ui.click(element(by.id('sp_app/service/prompt/ok_btn')));
        lib.ui.click(element(by.id('sp_app/service/info/exit_btn')));

        expect(sp_result.count()).toEqual(1);
        lib.product_page.get_line_text(data).then(
            function(txt){
                expect(sp_result.get(0).getText()).toEqual(txt);
            }
        )
    })
});