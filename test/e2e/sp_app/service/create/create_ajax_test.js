var base_path = './../../../';
var lib = require(base_path + 'lib');

describe('sp_app/service/create', function() {

    var sp_result = element.all(by.repeater('sp in sp_lst'));
    var sku_txt = element(by.model('sku_search_str'));
    var alert_message_lbl = element(by.id('service/ui/alert/message_lbl'));
    var alert_ok_btn = element(by.id('service/ui/alert/ok_btn')); 

    beforeEach(function(){
        lib.auth.login('1','1');
        lib.setup.init_data();
        lib.auth.logout();
    })

    it('can insert new',function(){
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
            sku : '12345'
        }
        lib.auth.login('1','1');
        sku_txt.clear();sku_txt.sendKeys(enter_key);
        sku_txt.sendKeys(data.sku,enter_key);  
        expect(sp_result.count()).toEqual(0);  

        //verify prefill
        expect(element(by.id('sp_app/service/prompt/dialog')).isPresent()).toBeTruthy();
        expect(element(by.id('sp_app/service/prompt/is_sale_report_check')).isSelected()).toBeTruthy();
        expect(element(by.id('sp_app/service/prompt/sku_txt')).getAttribute('value')).toEqual(data.sku); 
        expect(element(by.id('sp_app/service/prompt/sku_txt')).isEnabled()).toBeFalsy();

        //verify suggestion
        expect(element(by.id('sp_app/service/prompt/suggest_name')).isDisplayed()).toBeFalsy();
        expect(element(by.id('sp_app/service/prompt/suggest_price')).isDisplayed()).toBeFalsy();
        expect(element(by.id('sp_app/service/prompt/suggest_crv')).isDisplayed()).toBeFalsy();
        expect(element(by.id('sp_app/service/prompt/suggest_cost')).isDisplayed()).toBeFalsy();
        expect(element(by.id('sp_app/service/prompt/suggest_taxable')).isDisplayed()).toBeFalsy();

        //fillout & submit form
        element(by.id('sp_app/service/prompt/name_txt')).sendKeys(data.name,enter_key);
        element(by.id('sp_app/service/prompt/price_txt')).sendKeys(data.price,enter_key);
        element(by.id('sp_app/service/prompt/crv_txt')).sendKeys(data.crv,enter_key);
        element(by.id('sp_app/service/prompt/cost_txt')).sendKeys(data.cost,enter_key);
        element(by.id('sp_app/service/prompt/p_type_txt')).sendKeys(data.p_type,enter_key);
        element(by.id('sp_app/service/prompt/p_tag_txt')).sendKeys(data.p_tag,enter_key);
        element(by.id('sp_app/service/prompt/vendor_txt')).sendKeys(data.vendor,enter_key);
        element(by.id('sp_app/service/prompt/buydown_txt')).sendKeys(data.buydown,enter_key);    
        element(by.id('sp_app/service/prompt/value_customer_price_txt')).sendKeys(data.value_customer_price,enter_key);   
        if(data.is_taxable){
            lib.ui.click(element(by.id('sp_app/service/prompt/is_taxable_check')));
        }
        if(!data.is_sale_report){
            lib.ui.click(element(by.id('sp_app/service/prompt/is_sale_report_check')));
        }         

        //verify new created product
        lib.ui.click(element(by.id('sp_app/service/prompt/ok_btn')));
        expect(sp_result.count()).toEqual(1);
        lib.product_page.get_line_text(data).then(function(txt){expect(sp_result.get(0).getText()).toEqual(txt); })

        //clean up
        lib.auth.logout();
    })


    it('can insert old',function(){
        //FIXTURE: we going to insert a product into store 2
        lib.auth.login('2','2');
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
        }

        var sku='111'
        lib.api.insert_new(sku,data.name);
        lib.auth.logout();

        //TEST
        lib.auth.login('1','1');
        sku_txt.sendKeys(sku,enter_key); 

        //select suggestion
        var product_lst = element.all(by.repeater('product in prod_store__prod_sku__0_0'));
        var product = product_lst.get(0);
        lib.ui.click(product.element(by.css('.btn')));

        element(by.id('sp_app/service/prompt/name_txt')).sendKeys(data.name,enter_key);
        element(by.id('sp_app/service/prompt/price_txt')).sendKeys(data.price,enter_key);
        element(by.id('sp_app/service/prompt/crv_txt')).sendKeys(data.crv,enter_key);
        element(by.id('sp_app/service/prompt/cost_txt')).sendKeys(data.cost,enter_key);
        element(by.id('sp_app/service/prompt/p_type_txt')).sendKeys(data.p_type,enter_key);
        element(by.id('sp_app/service/prompt/p_tag_txt')).sendKeys(data.p_tag,enter_key);
        element(by.id('sp_app/service/prompt/vendor_txt')).sendKeys(data.vendor,enter_key);
        element(by.id('sp_app/service/prompt/buydown_txt')).sendKeys(data.buydown,enter_key);    
        element(by.id('sp_app/service/prompt/value_customer_price_txt')).sendKeys(data.value_customer_price,enter_key);    
        lib.ui.click(element(by.id('sp_app/service/prompt/ok_btn')));

        expect(sp_result.count()).toEqual(1);
        lib.product_page.get_line_text(data).then(
            function(txt){
                expect(sp_result.get(0).getText()).toEqual(txt);
            }
        )

        //clean up
        lib.auth.logout();        
    });


    it('can suggest to add sku for product that existed in current store',function(){
        // SETUP:
        lib.auth.login('1','1');
        var original_sku = '111';
        var new_sku = '222';
        var product_id = null;
        lib.api.insert_new(original_sku,'a product name')
        .then(function(data){
            product_id=data.product_id;
        })

        lib.auth.logout();

        lib.auth.login('2','2');
        ptor.wait(function(){
            return product_id != null;
        }).then(function(){
            lib.api.insert_old(product_id,original_sku,'a product name');
            lib.api.add_sku(product_id,new_sku);
        })

        lib.auth.logout();
        lib.auth.login('1','1');
        sku_txt.sendKeys(new_sku,enter_key); 

        expect(element(by.id('sp_app/service/create/select_suggestion/dialog')).isPresent()).toBeTruthy();
        var sp_lst = element.all(by.repeater('sp in prod_store__prod_sku__1_0'));
        expect(sp_lst.count()).toEqual(1)
        var sp = sp_lst.get(0);
        lib.ui.click(sp.element(by.css('.btn')));

        expect(sp_result.count()).toEqual(1);
        
        //clean up
        lib.auth.logout();        
    })
});