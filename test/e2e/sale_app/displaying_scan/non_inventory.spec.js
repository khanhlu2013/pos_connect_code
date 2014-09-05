var lib = require('./../../lib');


describe('sale_app/displaying_scan/non_inventory', function() {
    /*
        when sku is not exist, it is the create module that kick in which should be tested separatly from this test.
    */
    var baseUrl = 'http://127.0.0.1:8000/';
    var ptor = protractor.getInstance();
    var enter_key = protractor.Key.ENTER;

    //prompt service
    var prompt_txt = element(by.id('service/ui/prompt/prompt_txt'));
    var prompt_ok_btn = element(by.id('service/ui/prompt/ok_btn'));

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

    it('can scan,edit price, edit name,remove non inventory',function(){
        lib.auth.login(baseUrl,'1','1');
        lib.sale_page.load_this_page(3000);

        //can scan non inventory
        non_inv_btn.click();
        prompt_txt.sendKeys('1.23');
        prompt_ok_btn.click();
        expect(ds_lst.count()).toEqual(1);
        expect(tender_btn.getText()).toEqual('$1.23');

        //can combine
        non_inv_btn.click();
        prompt_txt.sendKeys('1.23');
        prompt_ok_btn.click();
        expect(ds_lst.count()).toEqual(1);
        expect(tender_btn.getText()).toEqual('$2.46');        
        expect(ds_lst.get(0).all(by.tagName('td')).get(0).getText()).toEqual('2');

        //can separate 
        non_inv_btn.click();
        prompt_txt.sendKeys('1.11');
        prompt_ok_btn.click();
        expect(ds_lst.count()).toEqual(2);
        expect(tender_btn.getText()).toEqual('$3.57');        
        expect(ds_lst.get(1).all(by.tagName('td')).get(0).getText()).toEqual('1');       

        //can remove 
        ds_lst.get(1).all(by.tagName('button')).get(0).click();
        expect(ds_lst.count()).toEqual(1);
        expect(tender_btn.getText()).toEqual('$2.46');          
        
        //can change name   
        var new_name = 'new non product name';
        ds_lst.get(0).all(by.tagName('td')).get(name_index).click();
        prompt_txt.clear();
        prompt_txt.sendKeys(new_name,enter_key);
        prompt_ok_btn.click();
        expect(ds_lst.get(0).all(by.tagName('td')).get(name_index).getText()).toEqual(new_name);

        //can change price
        var new_price = 1.11;
        ds_lst.get(0).all(by.tagName('td')).get(price_index).click();
        prompt_txt.clear();
        prompt_txt.sendKeys(new_price,enter_key);
        prompt_ok_btn.click();
        expect(ds_lst.get(0).all(by.tagName('td')).get(price_index).getText()).toEqual('$1.11');        
        expect(tender_btn.getText()).toEqual('$2.22');    

        //clean up
        void_btn.click(); 
    });
});