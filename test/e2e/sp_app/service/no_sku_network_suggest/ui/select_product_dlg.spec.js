var base_path = './../../../../'
var lib = require(base_path + 'lib');

describe('no_sku_network_suggest -> select product dialog', function() {
    var Sp_page = require(base_path + 'page/sp/Sp_page.js');
    var Select_product_dlg = require(base_path + 'page/sp/suggest/Select_product_dlg.js');
    var Network_product_partial = require(base_path + 'page/product/network_product_partial.js');
    var Sp_prompt_dlg = require(base_path + 'page/sp/Sp_prompt_dlg.js');

    beforeEach(function(){
        lib.auth.login('1','1');
        lib.setup.init_data();
        lib.auth.logout();
    })

    it('can calculate mod and median statistic for name,price,crv,cost,tax for product suggestion',function(){
        //--------------------------------
        //setup 1 same product for 3 store
        //--------------------------------
        var sku = '111';var val_cus_price = null;var is_sale_report = true; var p_type = null;var p_tag = null;
        
        var name_1 = 'a'; var price_1 = 1; var cost_1 = 2   ; var crv_1 = 1; var tax_1 = true;
        var name_2 = 'a'; var price_2 = 5; var cost_2 = null; var crv_2 = 1; var tax_2 = true;
        var name_3 = 'b'; var price_3 = 6; var cost_3 = 7   ; var crv_3 = 2; var tax_3 = false;

        lib.auth.login('1','1');
        var sp = null;
        lib.api.insert_new(sku,name_1,price_1,val_cus_price,crv_1,tax_1,is_sale_report,p_type,p_tag,cost_1).then(
            function(sp_created){
                sp = sp_created;
            }
        )

        lib.auth.login('2','2');
        browser.wait(function(){
            return sp !== null;
        }).then(
            function(){
                lib.api.insert_old(sp.product_id,sku,name_2,price_2,val_cus_price,crv_2,tax_2,is_sale_report,p_type,p_type,cost_2);
            }
        )

        lib.auth.login('3','3');
        browser.wait(function(){
            return sp !== null;
        }).then(
            function(){
                lib.api.insert_old(sp.product_id,sku,name_3,price_3,val_cus_price,crv_3,tax_3,is_sale_report,p_type,p_type,cost_3);
            }
        )

        //-----------------------------------------------------
        //verify statistic calculation in select product dialog
        //-----------------------------------------------------
        lib.auth.login('4','4');
        Sp_page.sku_search(sku);
        expect(Select_product_dlg.lst.count()).toEqual(1);
        expect(Select_product_dlg.get_col(0,'store_count')).toEqual('3');
        expect(Select_product_dlg.get_col(0,'name')).toEqual('a');    
        expect(Select_product_dlg.get_col(0,'price')).toEqual('$5.00');
        expect(Select_product_dlg.get_col(0,'crv')).toEqual('$1.00');   
        expect(Select_product_dlg.get_col(0,'cost')).toEqual('$4.50');   
        expect(Select_product_dlg.get_col(0,'is_taxable')).toEqual(true);    
        expect(Select_product_dlg.get_is_taxable_percent(0)).toEqual('(67%)');

        //--------------------------------------------------------------------------------
        //verify statistic calculation of network_product in confirm select product dialog
        //--------------------------------------------------------------------------------
            //-------
            //summary
            //-------   
            Select_product_dlg.click_col(0,'add');
            expect(Network_product_partial.summary.name_lbl.getText()).toEqual('a');
            expect(Network_product_partial.summary.price_lbl.getText()).toEqual('$5.00');
            expect(Network_product_partial.summary.crv_lbl.getText()).toEqual('$1.00');        
            expect(Network_product_partial.summary.cost_lbl.getText()).toEqual('$4.50');        
            expect(Network_product_partial.summary.is_taxable.sign_span.getAttribute('class')).toEqual('glyphicon glyphicon-check');
            expect(Network_product_partial.summary.is_taxable.percent_span.getText()).toEqual('(67%)');
            //-------------
            //detail - name
            //-------------  
            expect(Network_product_partial.detail.name.lst.count()).toEqual(2);
            expect(Network_product_partial.detail.name.get_col(0,'name')).toEqual('a');
            expect(Network_product_partial.detail.name.get_col(0,'percent')).toEqual('67%');
            expect(Network_product_partial.detail.name.get_col(1,'name')).toEqual('b');
            expect(Network_product_partial.detail.name.get_col(1,'percent')).toEqual('33%');    
            //------------
            //detail - crv
            //------------  
            expect(Network_product_partial.detail.crv.lst.count()).toEqual(2);
            expect(Network_product_partial.detail.crv.get_col(0,'crv')).toEqual('$1.00');
            expect(Network_product_partial.detail.crv.get_col(0,'percent')).toEqual('67%');
            expect(Network_product_partial.detail.crv.get_col(1,'crv')).toEqual('$2.00');
            expect(Network_product_partial.detail.crv.get_col(1,'percent')).toEqual('33%');     
            //--------------------------
            //detail - cost_price_volumn
            //--------------------------  
            expect(Network_product_partial.detail.cost_price_volumn.lst.count()).toEqual(3);
            expect(Network_product_partial.detail.cost_price_volumn.get_col(0,'cost')).toEqual('$2.00');
            expect(Network_product_partial.detail.cost_price_volumn.get_col(0,'price')).toEqual('$1.00');
            expect(Network_product_partial.detail.cost_price_volumn.get_col(1,'cost')).toEqual('$7.00');
            expect(Network_product_partial.detail.cost_price_volumn.get_col(1,'price')).toEqual('$6.00');        
            expect(Network_product_partial.detail.cost_price_volumn.get_col(2,'cost')).toEqual('');
            expect(Network_product_partial.detail.cost_price_volumn.get_col(2,'price')).toEqual('$5.00');                        
    })

    // it('can hide the percentage amount for 100 percent of is_taxable suggestion',function(){
    //     //--------------------------------
    //     //setup 1 same product for 3 store
    //     //--------------------------------
    //     var sku = '111';var val_cus_price = null;var is_sale_report = true; var p_type = null;var p_tag = null;
        
    //     var name_1 = 'a'; var price_1 = 1; var cost_1 = 2   ; var crv_1 = 1; var tax_1 = true;
    //     var name_2 = 'a'; var price_2 = 5; var cost_2 = null; var crv_2 = 1; var tax_2 = true;

    //     lib.auth.login('1','1');
    //     var sp = null;
    //     lib.api.insert_new(sku,name_1,price_1,val_cus_price,crv_1,tax_1,is_sale_report,p_type,p_tag,cost_1).then(
    //         function(sp_created){
    //             sp = sp_created;
    //         }
    //     )

    //     lib.auth.login('2','2');
    //     browser.wait(function(){
    //         return sp !== null;
    //     }).then(
    //         function(){
    //             lib.api.insert_old(sp.product_id,sku,name_2,price_2,val_cus_price,crv_2,tax_2,is_sale_report,p_type,p_type,cost_2);
    //         }
    //     )

    //     //---------------------------------------------------------
    //     //verify percent amount is hide for 100% in select p dialog
    //     //---------------------------------------------------------
    //     lib.auth.login('4','4');
    //     Sp_page.sku_search(sku);
    //     expect(Select_product_dlg.lst.count()).toEqual(1);
    //     expect(Select_product_dlg.get_col(0,'store_count')).toEqual('2');
    //     expect(Select_product_dlg.get_col(0,'is_taxable')).toEqual(true);    
    //     expect(Select_product_dlg.get_is_taxable_percent(0)).toEqual(null);

    //     //----------------------------------------------------------
    //     //verify percent amount is hide for 100% in select sp dialog
    //     //----------------------------------------------------------
    //     Select_product_dlg.click_col(0,'add');
    //     expect(Network_product_partial.summary.is_taxable.sign_span.getAttribute('class')).toEqual('glyphicon glyphicon-check');
    //     expect(Network_product_partial.summary.is_taxable.percent_span.isDisplayed()).toEqual(false);        
    // })

    // it('can hide the sign and amount for is_taxable suggestion when it is 50%',function(){
    //     //--------------------------------
    //     //setup 1 same product for 3 store
    //     //--------------------------------
    //     var sku = '111';var val_cus_price = null;var is_sale_report = true; var p_type = null;var p_tag = null;
        
    //     var name_1 = 'a'; var price_1 = 1; var cost_1 = 2   ; var crv_1 = 1; var tax_1 = true;
    //     var name_2 = 'a'; var price_2 = 5; var cost_2 = null; var crv_2 = 1; var tax_2 = false;

    //     lib.auth.login('1','1');
    //     var sp = null;
    //     lib.api.insert_new(sku,name_1,price_1,val_cus_price,crv_1,tax_1,is_sale_report,p_type,p_tag,cost_1).then(
    //         function(sp_created){
    //             sp = sp_created;
    //         }
    //     )

    //     lib.auth.login('2','2');
    //     browser.wait(function(){
    //         return sp !== null;
    //     }).then(
    //         function(){
    //             lib.api.insert_old(sp.product_id,sku,name_2,price_2,val_cus_price,crv_2,tax_2,is_sale_report,p_type,p_type,cost_2);
    //         }
    //     )

    //     //-----------------------------------------------------------------------------------------
    //     //verify is_taxible is hide for both sign and percent if it is 50% in select product dialog
    //     //-----------------------------------------------------------------------------------------
    //     lib.auth.login('4','4');
    //     Sp_page.sku_search(sku);
    //     expect(Select_product_dlg.lst.count()).toEqual(1);
    //     expect(Select_product_dlg.get_col(0,'store_count')).toEqual('2');
    //     expect(Select_product_dlg.get_col(0,'is_taxable')).toEqual(null);    
    //     expect(Select_product_dlg.get_is_taxable_percent(0)).toEqual(null);

    //     //------------------------------------------------------------------------------------------
    //     //verify is_taxible is hide for both sign and percent if it is 50% in confirm select product
    //     //------------------------------------------------------------------------------------------
    //     Select_product_dlg.click_col(0,'add');
    //     expect(Network_product_partial.summary.is_taxable.sign_span.isDisplayed()).toEqual(false);  
    //     expect(Network_product_partial.summary.is_taxable.percent_span.isDisplayed()).toEqual(false);        
    // })        
});