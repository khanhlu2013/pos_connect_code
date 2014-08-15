var lib = require('./../../../lib');


describe('sp_app/service/edit/sku', function() {
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

    it('can add new sku',function(){
        var sku_lst = element.all(by.repeater('sku_assoc in sp.get_my_sku_assoc_lst() | orderBy : \'sku\''));

        //fixture
        var old_sku = '111';
        var new_sku = '222';
        lib.auth.login(baseUrl,'1','1');
        browser.get(baseUrl);  
        lib.api.insert_new(old_sku,'xxx'/*name*/);

        sku_txt.clear();sku_txt.sendKeys(enter_key);
        sku_txt.sendKeys(old_sku,enter_key);  
        expect(sp_result.count()).toEqual(1);  
        lib.ui.click(sp_result.get(0).element(by.css('.btn')));
        expect(element(by.id('sp_app/service/info/dialog')).isPresent()).toBeTruthy();
        
        //open edit sku dialog
        lib.ui.click(element(by.id('sp_app/service/info/tab/sku')));
        lib.ui.click(element(by.id('sp_app/service/info/edit_btn')));
        expect(element(by.id('sp_app/service/edit/sku/dialog')).isPresent()).toBeTruthy();
        expect(sku_lst.count()).toEqual(1);

        //add new sku
        lib.ui.click(element(by.id('sp_app/service/edit/sku/add_btn')));
        expect(element(by.id('service/ui/prompt/dialog')).isPresent()).toBeTruthy();
        element(by.id('service/ui/prompt/prompt_txt')).sendKeys(new_sku,enter_key);
        lib.ui.click(element(by.id('service/ui/prompt/ok_btn')));

        //verify new added sku
        expect(sku_lst.count()).toEqual(2);
        expect(sku_lst.get(0).getText()).toEqual(old_sku);
        expect(sku_lst.get(1).getText()).toEqual(new_sku);

        //clean up
        lib.ui.click(element(by.id('sp_app/service/edit/sku/exit_btn')));
        lib.ui.click(element(by.id('sp_app/service/info/exit_btn')));
    })

    
    it('can add old sku, aka this sku is already assoc with this product through another store subscription but this sku is not yet subscribed by this store',function(){
        lib.auth.login(baseUrl,'2','2');
        browser.get(baseUrl);
        var sku_1 = '111';
        var sku_2 = '222';
        var product_id = null;
        lib.api.insert_new(sku_1,'xxx'/*product name*/)
        .then(function(data){product_id = data.product_id});

        browser.wait(function(){
            return product_id != null;
        }).then(function(){
            lib.api.add_sku(product_id,sku_2);
        })

        lib.auth.logout();

        lib.auth.login(baseUrl,'1','1');
        browser.get(baseUrl);
        browser.wait(function(){
            return product_id != null;
        }).then(function(){
            lib.api.insert_old(product_id,sku_1,'xxx'/*name*/);
        })

        //search for product
        sku_txt.sendKeys(sku_1,enter_key);
        expect(sp_result.count()).toEqual(1);
        lib.ui.click(sp_result.get(0).element(by.css('.btn')));

        //navigate to edit sku
        lib.ui.click(element(by.id('sp_app/service/info/tab/sku')));
        lib.ui.click(element(by.id('sp_app/service/info/edit_btn')));
        lib.ui.click(element(by.id('sp_app/service/edit/sku/add_btn')));
        //verify sku is not yet added
        var sku_lst = element.all(by.repeater('sku_assoc in sp.get_my_sku_assoc_lst()'));
        expect(sku_lst.count()).toEqual(1);
        //add new sku
        element(by.id('service/ui/prompt/prompt_txt')).sendKeys(sku_2);
        lib.ui.click(element(by.id('service/ui/prompt/ok_btn')));

        //verify sku is added
        expect(sku_lst.count()).toEqual(2);

        lib.ui.click(element(by.id('sp_app/service/edit/sku/exit_btn')));
        lib.ui.click(element(by.id('sp_app/service/info/exit_btn')));
    })


    it('can add remove sku subscription and leave other store subscription un-touch',function(){
        lib.auth.login(baseUrl,'2','2');
        browser.get(baseUrl);
        var sku_1 = '111';
        var sku_2 = '222';
        var product_id = null;
        lib.api.insert_new(sku_1,'xxx'/*product name*/)
        .then(function(data){product_id = data.product_id});

        browser.wait(function(){
            return product_id != null;
        }).then(function(){
            lib.api.add_sku(product_id,sku_2);
        })

        lib.auth.logout();

        lib.auth.login(baseUrl,'1','1');
        browser.get(baseUrl);
        browser.wait(function(){
            return product_id != null;
        }).then(function(){
            lib.api.insert_old(product_id,sku_1,'xxx'/*name*/);
            lib.api.add_sku(product_id,sku_2);
        })

        //search for product
        sku_txt.sendKeys(sku_1,enter_key);
        expect(sp_result.count()).toEqual(1);
        lib.ui.click(sp_result.get(0).element(by.css('.btn')));

        //navigate to edit sku
        ptor.sleep(500);
        lib.ui.click(element(by.id('sp_app/service/info/tab/sku')));
        lib.ui.click(element(by.id('sp_app/service/info/edit_btn')));
        var sku_lst = element.all(by.repeater('sku_assoc in sp.get_my_sku_assoc_lst()'));
        expect(sku_lst.count()).toEqual(2);

        //remove sku
        lib.ui.click(sku_lst.get(0).element(by.css('.btn')));
        lib.ui.click(element(by.id('service/ui/confirm/ok_btn')));
        //verify sku is removed
        expect(sku_lst.count()).toEqual(1);
        lib.ui.click(element(by.id('sp_app/service/edit/sku/exit_btn')));
        lib.ui.click(element(by.id('sp_app/service/info/exit_btn')));        


        //verify other store subscription stay the same
        lib.auth.logout();
        lib.auth.login(baseUrl,'2','2')
        browser.get(baseUrl);
        sku_txt.sendKeys(sku_1,enter_key);
        lib.ui.click(sp_result.get(0).element(by.css('.btn')));
        lib.ui.click(element(by.id('sp_app/service/info/tab/sku')));
        lib.ui.click(element(by.id('sp_app/service/info/edit_btn')));
        expect(sku_lst.count()).toEqual(2);

        lib.ui.click(element(by.id('sp_app/service/edit/sku/exit_btn')));
        lib.ui.click(element(by.id('sp_app/service/info/exit_btn')));
    })    
});