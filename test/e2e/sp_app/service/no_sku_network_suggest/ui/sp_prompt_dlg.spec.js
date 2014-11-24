var base_path = './../../../../'
var lib = require(base_path + 'lib');

describe('no_sku_network_suggest -> sp_prompt dialog', function() {
    var Sp_page = require(base_path + 'page/sp/Sp_page.js');
    var Select_product_dlg = require(base_path + 'page/sp/suggest/Select_product_dlg.js');
    var Select_product_confirm_dlg = require(base_path + 'page/sp/suggest/Select_product_confirm_dlg.js');
    var Sp_prompt_dlg = require(base_path + 'page/sp/Sp_prompt_dlg.js');

    beforeEach(function(){
        lib.auth.login('1','1');
        lib.setup.init_data();
        lib.auth.logout();
    })

    it('can disable all suggestion when there is no suggest',function(){
        lib.auth.login('1','1');
        Sp_page.sku_search('a_dummy_sku');        

        expect(Sp_prompt_dlg.suggest.main.name_btn.isDisplayed()).toEqual(false);
        expect(Sp_prompt_dlg.suggest.extra.name_btn.isDisplayed()).toEqual(false);
        
        expect(Sp_prompt_dlg.suggest.main.price_btn.isDisplayed()).toEqual(false);
        expect(Sp_prompt_dlg.suggest.extra.price_btn.isDisplayed()).toEqual(false);

        expect(Sp_prompt_dlg.suggest.main.crv_btn.isDisplayed()).toEqual(false);
        expect(Sp_prompt_dlg.suggest.extra.crv_btn.isDisplayed()).toEqual(false);     
        
        expect(Sp_prompt_dlg.suggest.main.cost_btn.isDisplayed()).toEqual(false);
        expect(Sp_prompt_dlg.suggest.extra.cost_btn.isDisplayed()).toEqual(false);

        expect(Sp_prompt_dlg.suggest.main.is_taxable_btn.isDisplayed()).toEqual(false);
        expect(Sp_prompt_dlg.suggest.extra.is_taxable_btn.isDisplayed()).toEqual(false);   
    })


    it('can disable extra suggestion when there is extra suggest',function(){
        lib.auth.login('2','2');
        var sku='a_sku',name='prod name',price=1.2,val_cust_price=null,crv=0.03,is_taxable=true,is_sale_report=true,p_type=null,p_tag=null,cost=0.75;
        lib.api.insert_new(sku,name,price,val_cust_price,crv,is_taxable,is_sale_report,p_type,p_tag,cost);


        lib.auth.login('1','1')
        Sp_page.sku_search(sku);
        Select_product_dlg.click_col(0,'add');
        Select_product_confirm_dlg.ok();

        //----------------------------------
        //verify extra suggestion is disable
        //----------------------------------
        expect(Sp_prompt_dlg.suggest.main.name_btn.isDisplayed()).toEqual(true);
        expect(Sp_prompt_dlg.suggest.extra.name_btn.isEnabled()).toEqual(false);
        
        expect(Sp_prompt_dlg.suggest.main.price_btn.isDisplayed()).toEqual(true);
        expect(Sp_prompt_dlg.suggest.extra.price_btn.isEnabled()).toEqual(false);

        expect(Sp_prompt_dlg.suggest.main.crv_btn.isDisplayed()).toEqual(true);
        expect(Sp_prompt_dlg.suggest.extra.crv_btn.isEnabled()).toEqual(false);     
        
        expect(Sp_prompt_dlg.suggest.main.cost_btn.isDisplayed()).toEqual(true);
        expect(Sp_prompt_dlg.suggest.extra.cost_btn.isEnabled()).toEqual(false);

        expect(Sp_prompt_dlg.suggest.main.is_taxable_btn.isDisplayed()).toEqual(true);
        expect(Sp_prompt_dlg.suggest.extra.is_taxable_btn.isEnabled()).toEqual(true);   

        //----------------------------------
        //test the click for main suggestion
        //----------------------------------
        lib.click(Sp_prompt_dlg.suggest.main.name_btn);
        lib.click(Sp_prompt_dlg.suggest.main.price_btn);
        lib.click(Sp_prompt_dlg.suggest.main.crv_btn);
        lib.click(Sp_prompt_dlg.suggest.main.cost_btn);
        lib.click(Sp_prompt_dlg.suggest.main.is_taxable_btn);

        expect(Sp_prompt_dlg.get_name()).toEqual(name);
        expect(Sp_prompt_dlg.get_price()).toEqual(price.toString());
        expect(Sp_prompt_dlg.get_crv()).toEqual(crv.toString());
        expect(Sp_prompt_dlg.get_cost()).toEqual(cost.toString());        
        expect(Sp_prompt_dlg.get_is_taxable()).toEqual(is_taxable);
    })    

    it('can diplay both main and extra suggestion both is available',function(){
        //------------------------------------------------------------
        //setup 2 store so that we have both main and extra suggestion
        //------------------------------------------------------------        
        lib.auth.login('2','2');
        var sku='111',val_cust_price=null,is_sale_report=true,p_type=null,p_tag=null;
        var name_1='prod name',price_1=1.2,crv_1=0.03,is_taxable_1=true,cost_1=0.75;
        var sp = null;
        lib.api.insert_new(sku,name_1,price_1,val_cust_price,crv_1,is_taxable_1,is_sale_report,p_type,p_tag,cost_1).then(
            function(create_sp){
                sp = create_sp;
            }
        )
        lib.auth.login('3','3');
        var name_2='prod name 2',price_2=1.25,crv_2=0.13,is_taxable_2=true,cost_2=0.95;
        browser.wait(function(){
            return sp !== null;
        }).then(
            function(){
                lib.api.insert_old(sp.product_id,sku,name_2,price_2,val_cust_price,crv_2,is_taxable_2,is_sale_report,p_type,p_tag,cost_2);
            }
        )
        lib.auth.login('4','4');
        var name_3='prod name 2',price_3=7.15,crv_3=0.13,is_taxable_3=false,cost_3=null;
        browser.wait(function(){
            return sp !== null;
        }).then(
            function(){
                lib.api.insert_old(sp.product_id,sku,name_3,price_3,val_cust_price,crv_3,is_taxable_3,is_sale_report,p_type,p_tag,cost_3);
            }
        )
        //--------------------------------------------------
        //verify both main and extra suggestion is available
        //--------------------------------------------------      
        lib.auth.login('1','1');        
        Sp_page.sku_search(sku);
        Select_product_dlg.click_col(0,'add');
        Select_product_confirm_dlg.ok();

        expect(Sp_prompt_dlg.suggest.main.name_btn.isDisplayed()).toEqual(true);
        expect(Sp_prompt_dlg.suggest.extra.name_btn.isEnabled()).toEqual(true);
        
        expect(Sp_prompt_dlg.suggest.main.price_btn.isDisplayed()).toEqual(true);
        expect(Sp_prompt_dlg.suggest.extra.price_btn.isEnabled()).toEqual(true);

        expect(Sp_prompt_dlg.suggest.main.crv_btn.isDisplayed()).toEqual(true);
        expect(Sp_prompt_dlg.suggest.extra.crv_btn.isEnabled()).toEqual(true);     
        
        expect(Sp_prompt_dlg.suggest.main.cost_btn.isDisplayed()).toEqual(true);
        expect(Sp_prompt_dlg.suggest.extra.cost_btn.isEnabled()).toEqual(true);

        expect(Sp_prompt_dlg.suggest.main.is_taxable_btn.isDisplayed()).toEqual(true);
        expect(Sp_prompt_dlg.suggest.extra.is_taxable_btn.isEnabled()).toEqual(true); 

        //-----------------------------
        //verify suggest main statistic
        //-----------------------------
        expect(Sp_prompt_dlg.suggest.main.name_btn.getText()).toEqual('prod name 2');
        expect(Sp_prompt_dlg.suggest.main.price_btn.getText()).toEqual('$1.25');
        expect(Sp_prompt_dlg.suggest.main.crv_btn.getText()).toEqual('$0.13');
        expect(Sp_prompt_dlg.suggest.main.cost_btn.getText()).toEqual('$0.85');
        expect(Sp_prompt_dlg.suggest.main.is_taxable_btn.getAttribute('class')).toEqual('glyphicon btn btn-primary glyphicon-check');
        expect(Sp_prompt_dlg.suggest.main.is_taxable_btn.all(by.tagName('span')).get(0).getText()).toEqual('(67%)');

        //------------------------------
        //verify extra suggest statistic
        //------------------------------        
        expect(Sp_prompt_dlg.suggest.extra.name_lst.count()).toEqual(2);
        expect(Sp_prompt_dlg.suggest.extra.name_lst.get(0).all(by.tagName('a')).get(0).getWebElement().getInnerHtml()).toEqual('prod name 2 - (67%)');   
        expect(Sp_prompt_dlg.suggest.extra.name_lst.get(1).all(by.tagName('a')).get(0).getWebElement().getInnerHtml()).toEqual('prod name - (33%)'); 

        expect(Sp_prompt_dlg.suggest.extra.price_lst.count()).toEqual(3);
        expect(Sp_prompt_dlg.suggest.extra.price_lst.get(0).all(by.tagName('a')).get(0).getWebElement().getInnerHtml()).toEqual('$1.20');
        expect(Sp_prompt_dlg.suggest.extra.price_lst.get(1).all(by.tagName('a')).get(0).getWebElement().getInnerHtml()).toEqual('$1.25');
        expect(Sp_prompt_dlg.suggest.extra.price_lst.get(2).all(by.tagName('a')).get(0).getWebElement().getInnerHtml()).toEqual('$7.15');

        expect(Sp_prompt_dlg.suggest.extra.crv_lst.count()).toEqual(2);
        expect(Sp_prompt_dlg.suggest.extra.crv_lst.get(0).all(by.tagName('a')).get(0).getWebElement().getInnerHtml()).toEqual('$0.13 - (67%)'); 
        expect(Sp_prompt_dlg.suggest.extra.crv_lst.get(1).all(by.tagName('a')).get(0).getWebElement().getInnerHtml()).toEqual('$0.03 - (33%)');         

        expect(Sp_prompt_dlg.suggest.extra.cost_lst.count()).toEqual(2);
        expect(Sp_prompt_dlg.suggest.extra.cost_lst.get(0).all(by.tagName('a')).get(0).getWebElement().getInnerHtml()).toEqual('$0.75');
        expect(Sp_prompt_dlg.suggest.extra.cost_lst.get(1).all(by.tagName('a')).get(0).getWebElement().getInnerHtml()).toEqual('$0.95');

        expect(Sp_prompt_dlg.suggest.extra.is_taxable_btn.getAttribute('class')).toEqual('glyphicon btn btn-primary glyphicon-unchecked');
        expect(Sp_prompt_dlg.suggest.extra.is_taxable_btn.all(by.tagName('span')).get(0).getText()).toEqual('(33%)');          
    })    
});