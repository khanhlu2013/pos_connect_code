var lib = require('./../lib');


describe('main page', function() {
    /*
        when sku is not exist, it is the create module that kick in which should be tested separatly from this test.
    */
    var baseUrl = 'http://127.0.0.1:8000/';
    var ptor = protractor.getInstance();

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

    it('can search for sku exist within store',function(){
        /*  
            Fixture setup
                . we insert 2 different product with same sku to two stores.
                . we login store 1, and search for that sku. We then verify that sku search that exist only search within current store.

        */
        var sku = '111'

        lib.auth.login(baseUrl,'2','2');
        browser.get(baseUrl); 
        lib.api.insert_new(sku,'222'/*name*/)

        lib.auth.logout();

        lib.auth.login(baseUrl,'1','1');
        browser.get(baseUrl);   
        lib.api.insert_new(sku,'111'/*name*/)        

        //TEST
        sku_txt.clear();sku_txt.sendKeys(protractor.Key.ENTER);
        sku_txt.sendKeys(sku,protractor.Key.ENTER);
        expect(sp_result.count()).toEqual(1);            

        sku_txt.clear();sku_txt.sendKeys(protractor.Key.ENTER);
        sku_txt.sendKeys('111 222',protractor.Key.ENTER);
        expect(sp_result.count()).toEqual(0);  
        expect(alert_message_lbl.getText()).toEqual('error: sku cannot contain space');
        alert_ok_btn.click(); 
    })
});