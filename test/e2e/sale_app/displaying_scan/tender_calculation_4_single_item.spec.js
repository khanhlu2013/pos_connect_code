var lib = require('./../../lib');


describe('sale_app/displaying_scan/tender_calculation_4_single_item', function() {
    /*
        when sku is not exist, it is the create module that kick in which should be tested separatly from this test.
    */
    var baseUrl = 'http://127.0.0.1:8000/';
    var ptor = protractor.getInstance();
    var enter_key = protractor.Key.ENTER;

    var tax_rate = 8.725 //a hard code amount when create store fixture
    //prompt service
    var prompt_txt = element(by.id('service/ui/prompt/prompt_txt'));
    var prompt_ok_btn = element(by.id('service/ui/prompt/ok_btn'));

    //sale page
    var void_btn = element(by.id('sale_app/main_page/void_btn'));
    var tender_btn = element(by.id('sale_app/main_page/tender_btn'));
    var ds_lst = element.all(by.repeater('ds in ds_lst'))

    //displaying scan info dlg
    var info_dlg_override_price_btn = element(by.id('sale_app/service/displaying_scan/detail_price_dlg/override_price_btn'));
    var info_dlg_ok_btn = element(by.id('sale_app/service/displaying_scan/detail_price_dlg/ok_btn'));

    beforeEach(function(){
        lib.auth.login(baseUrl,'1','1');
        browser.get(baseUrl); 
        lib.setup.init_data();
        lib.auth.logout();
    })

    afterEach(function(){
        lib.auth.logout();
    })

    function exe_override_price(new_price){
        ds_lst.get(0).all(by.tagName('td')).get(2).click();
        info_dlg_override_price_btn.click();
        prompt_txt.sendKeys(new_price);
        prompt_ok_btn.click();
        info_dlg_ok_btn.click();
        ptor.sleep(200);//wait for pouch to re-calculate ds_lst
    }
/*

   case        taxable     override    regular_price   buydown     crv     mm_deal     mm_deal_include
A   1           0           0           1               0           0       0           0
    2           0           0           1               1           1       0           0           
    3           0           0           1               1           1       1           0
    4           0           0           1               1           1       1           1

    1           0           1           1               0           0       0           0
    2           0           1           1               1           1       0           0           
    3           0           1           1               1           1       1           0
    4           0           1           1               1           1       1           1



B   1           1           0           1               0           0       0           0
    2           1           0           1               1           1       0           0           
    3           1           0           1               1           1       1           0
    4           1           0           1               1           1       1           1

    1           1           1           1               0           0       0           0
    2           1           1           1               1           1       0           0           
    3           1           1           1               1           1       1           0
    4           1           1           1               1           1       1           1

*/
    it('can calculate ds',function(){
        lib.auth.login(baseUrl,'1','1');
        browser.get(baseUrl); 
        
        var price=12.34;override_price=11.28;var crv_=0.23;buyd = 1.75;_1=true;_0=false

        //FIXTURE--------------------------------------------------------------------------------------------------------------------------------------------
        //FIXTURE GROUP A (NON TAX GROUP) -------------------------------------------------------------------------------------------------------------------
        var a1_sku='a1',a1_name='a1',a1_crv=null,a1_taxable=_0,a1_buydown=null;
        var a2_sku='a2',a2_name='a2',a2_crv=crv_,a2_taxable=_0,a2_buydown=buyd;
        var a3_sku='a3',a3_name='a3',a3_crv=crv_,a3_taxable=_0,a3_buydown=buyd;
        var a4_sku='a4',a4_name='a4',a4_crv=crv_,a4_taxable=_0,a4_buydown=buyd;
        
        var a3_deal_price = 4.7,a3_deal_qty=2;a3_deal_is_include=false;
        var a4_deal_price = 4.5,a4_deal_qty=2;a4_deal_is_include=true;  

        lib.api.insert_new(a1_sku,a1_name,price,null/*value_cust_price*/,a1_crv,a1_taxable,null/*sale_report*/,null/*p_type*/,null/*p_tag*/,null/*cost*/,null/*vendor*/,a1_buydown);
        lib.api.insert_new(a2_sku,a2_name,price,null/*value_cust_price*/,a2_crv,a2_taxable,null/*sale_report*/,null/*p_type*/,null/*p_tag*/,null/*cost*/,null/*vendor*/,a2_buydown);
        lib.api.insert_new(a3_sku,a3_name,price,null/*value_cust_price*/,a3_crv,a3_taxable,null/*sale_report*/,null/*p_type*/,null/*p_tag*/,null/*cost*/,null/*vendor*/,a3_buydown)
        .then(function(sp){lib.api.insert_mm('a3 deal',a3_deal_price,a3_deal_is_include,a3_deal_qty,[sp])})
        lib.api.insert_new(a4_sku,a4_name,price,null/*value_cust_price*/,a4_crv,a4_taxable,null/*sale_report*/,null/*p_type*/,null/*p_tag*/,null/*cost*/,null/*vendor*/,a4_buydown)
        .then(function(sp){lib.api.insert_mm('a4 deal',a4_deal_price,a4_deal_is_include,a4_deal_qty,[sp])})

        //FIXTURE GROUP B (NON TAX GROUP) -------------------------------------------------------------------------------------------------------------------
        var b1_sku='b1',b1_name='b1',b1_crv=null,b1_taxable=_1,b1_buydown=null;
        var b2_sku='b2',b2_name='b2',b2_crv=crv_,b2_taxable=_1,b2_buydown=buyd;
        var b3_sku='b3',b3_name='b3',b3_crv=crv_,b3_taxable=_1,b3_buydown=buyd;
        var b4_sku='b4',b4_name='b4',b4_crv=crv_,b4_taxable=_1,b4_buydown=buyd;
        
        var b3_deal_price = 4.7,b3_deal_qty=2;b3_deal_is_include=false;
        var b4_deal_price = 4.5,b4_deal_qty=2;b4_deal_is_include=true;  

        lib.api.insert_new(b1_sku,b1_name,price,null/*value_cust_price*/,b1_crv,b1_taxable,null/*sale_report*/,null/*p_type*/,null/*p_tag*/,null/*cost*/,null/*vendor*/,b1_buydown);
        lib.api.insert_new(b2_sku,b2_name,price,null/*value_cust_price*/,b2_crv,b2_taxable,null/*sale_report*/,null/*p_type*/,null/*p_tag*/,null/*cost*/,null/*vendor*/,b2_buydown);
        lib.api.insert_new(b3_sku,b3_name,price,null/*value_cust_price*/,b3_crv,b3_taxable,null/*sale_report*/,null/*p_type*/,null/*p_tag*/,null/*cost*/,null/*vendor*/,b3_buydown)
        .then(function(sp){lib.api.insert_mm('b3 deal',b3_deal_price,b3_deal_is_include,b3_deal_qty,[sp])})
        lib.api.insert_new(b4_sku,b4_name,price,null/*value_cust_price*/,b4_crv,b4_taxable,null/*sale_report*/,null/*p_type*/,null/*p_tag*/,null/*cost*/,null/*vendor*/,b4_buydown)
        .then(function(sp){lib.api.insert_mm('b4 deal',b4_deal_price,b4_deal_is_include,b4_deal_qty,[sp])})

        //LOAD SALE PAGE - SYNC OFFLINE DB--------------------------------------------------------------------------------------------------------------------
        lib.sale_page.load_this_page();

        //TEST A GROUP ---------------------------------------------------------------------------------------------------------------------------------------
        //NO OVERRIDE PRICE
        lib.sale_page.scan(a1_sku);
        expect(tender_btn.getText()).toEqual('$12.34');        
        void_btn.click();
        lib.sale_page.scan(a2_sku);
        expect(tender_btn.getText()).toEqual('$10.82');        
        void_btn.click();
        lib.sale_page.scan(a3_deal_qty + ' ' + a3_sku);
        expect(tender_btn.getText()).toEqual('$1.66');        
        void_btn.click();
        lib.sale_page.scan(a4_deal_qty + ' ' + a4_sku);
        expect(tender_btn.getText()).toEqual('$1.00');        
        void_btn.click();        
        //YES OVERRIDE PRICE
        lib.sale_page.scan(a1_sku);
        exe_override_price(override_price);
        expect(tender_btn.getText()).toEqual('$11.28');        
        void_btn.click();
        lib.sale_page.scan(a2_sku);
        exe_override_price(override_price);
        expect(tender_btn.getText()).toEqual('$9.76');        
        void_btn.click();
        lib.sale_page.scan(a3_deal_qty + ' ' + a3_sku);
        exe_override_price(override_price);
        expect(tender_btn.getText()).toEqual('$1.66');        
        void_btn.click();
        lib.sale_page.scan(a4_deal_qty + ' ' + a4_sku);
        exe_override_price(override_price);
        expect(tender_btn.getText()).toEqual('$1.00');        
        void_btn.click();      

        //TEST B GROUP ---------------------------------------------------------------------------------------------------------------------------------------
        //NO OVERRIDE PRICE
        lib.sale_page.scan(b1_sku);
        expect(tender_btn.getText()).toEqual('$13.42');        
        void_btn.click();
        lib.sale_page.scan(b2_sku);
        expect(tender_btn.getText()).toEqual('$11.92');        
        void_btn.click();
        lib.sale_page.scan(b3_deal_qty + ' ' + b3_sku);
        expect(tender_btn.getText()).toEqual('$2.11');        
        void_btn.click();
        lib.sale_page.scan(b4_deal_qty + ' ' + b4_sku);
        expect(tender_btn.getText()).toEqual('$1.00');        
        void_btn.click();        
        //YES OVERRIDE PRICE
        lib.sale_page.scan(b1_sku);
        exe_override_price(override_price);
        expect(tender_btn.getText()).toEqual('$12.26');        
        void_btn.click();
        lib.sale_page.scan(b2_sku);
        exe_override_price(override_price);
        expect(tender_btn.getText()).toEqual('$10.76');        
        void_btn.click();
        lib.sale_page.scan(b3_deal_qty + ' ' + b3_sku);
        exe_override_price(override_price);
        expect(tender_btn.getText()).toEqual('$2.11');        
        void_btn.click();
        lib.sale_page.scan(b4_deal_qty + ' ' + b4_sku);
        exe_override_price(override_price);
        expect(tender_btn.getText()).toEqual('$1.00');        
        void_btn.click();                           
    },60000/*60 second timeout*/)
});