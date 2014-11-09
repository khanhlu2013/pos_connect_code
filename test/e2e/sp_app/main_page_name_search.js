var base_path = './../';
var lib = require(base_path + 'lib');

describe('main page', function() {
    var baseUrl = 'http://127.0.0.1:8000/';

    var sp_result = element.all(by.repeater('sp in sp_lst'));
    var name_txt = element(by.model('name_search_str'));
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

    it('can search for name',function(){
        /*  
            Objective:
                . only search within store
                . can search 1 or 2 words. 
                . swap search allow

            Fixture setup
                . we insert a product to store 2
                . we also insert another product with same name to store 1
                . we login store 1, and search for that name. We then verify that name search only search within current store.

        */
        lib.auth.login(baseUrl,'2','2');
        browser.get(baseUrl); 

        var sku = '222';var name = 'abc efg xyz';
        lib.api.insert_new(sku,name)

        lib.auth.logout();

        lib.auth.login(baseUrl,'1','1');
        browser.get(baseUrl);   
        var sku = '111';var name = 'abc efg xyz';
        lib.api.insert_new(sku,name)

        //TEST 
        name_txt.clear();name_txt.sendKeys(protractor.Key.ENTER);
        name_txt.sendKeys('abc',protractor.Key.ENTER);
        expect(sp_result.count()).toEqual(1);

        name_txt.clear();name_txt.sendKeys(protractor.Key.ENTER);
        name_txt.sendKeys('abc efg',protractor.Key.ENTER);
        expect(sp_result.count()).toEqual(1);      

        name_txt.clear();name_txt.sendKeys(protractor.Key.ENTER);
        name_txt.sendKeys('efg abc',protractor.Key.ENTER);
        expect(sp_result.count()).toEqual(1);        

        name_txt.clear();name_txt.sendKeys(protractor.Key.ENTER);
        name_txt.sendKeys('b f',protractor.Key.ENTER);
        expect(sp_result.count()).toEqual(1);      

        name_txt.clear();name_txt.sendKeys(protractor.Key.ENTER);
        name_txt.sendKeys('f b',protractor.Key.ENTER);
        expect(sp_result.count()).toEqual(1);   

        name_txt.clear();name_txt.sendKeys(protractor.Key.ENTER);
        name_txt.sendKeys('efg abc xyz',protractor.Key.ENTER);
        expect(sp_result.count()).toEqual(0);               
        expect(alert_message_lbl.getText()).toEqual('error: search 2 words maximum');//fail here
        lib.ui.click(alert_ok_btn);

        name_txt.clear();name_txt.sendKeys(protractor.Key.ENTER);
        name_txt.sendKeys('xxx',protractor.Key.ENTER);
        expect(sp_result.count()).toEqual(0);               
        expect(alert_message_lbl.getText()).toEqual('no result found for "xxx"');//fail here
        lib.ui.click(alert_ok_btn);
    })
});
