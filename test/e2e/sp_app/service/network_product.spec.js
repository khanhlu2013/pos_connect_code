var base_path = './../../'
var lib = require(base_path + 'lib');


describe('sp app -> info -> network product', function() {
    var Sp_page = require(base_path + 'page/sp/Sp_page.js');
    var Network_product_partial = require(base_path + 'page/product/network_product_partial.js');
    var Sp_info_dlg = require(base_path + 'page/sp/Sp_info_dlg.js');
    var Sale_page = require(base_path + 'page/sale/Sale_page.js');
    var Tender_dlg = require(base_path + 'page/sale/Tender_dlg.js');

    beforeEach(function(){
        lib.auth.login('1','1');
        lib.setup.init_data();
        lib.auth.logout();
    })

    it('can fetch network product info',function(){
        //--------------------------------
        //setup 1 same product for 3 store
        //--------------------------------
        var sku = '111';var val_cus_price = null;var is_sale_report = true; var p_type = null;var p_tag = null;
        

        var name_1 = 'a'; var price_1 = 1; var cost_1 = 2   ; var crv_1 = 1; var tax_1 = true;var qty1 = 1;
        var name_2 = 'a'; var price_2 = 5; var cost_2 = null; var crv_2 = 1; var tax_2 = true;var qty2 = 2;
        var name_3 = 'b'; var price_3 = 6; var cost_3 = 7   ; var crv_3 = 2; var tax_3 = false;

        //store1
        lib.auth.login('1','1');
        var sp = null;
        lib.api.insert_new(sku,name_1,price_1,val_cus_price,crv_1,tax_1,is_sale_report,p_type,p_tag,cost_1).then(
            function(sp_created){
                sp = sp_created;
            }
        )
        Sale_page.visit();
        Sale_page.scan(qty1 + ' ' +sku);
        Sale_page.tender();
        Tender_dlg.ok();
        Sale_page.menu_action_sync();

        //store2
        lib.auth.login('2','2');
        browser.wait(function(){
            return sp !== null;
        }).then(
            function(){
                lib.api.insert_old(sp.product_id,sku,name_2,price_2,val_cus_price,crv_2,tax_2,is_sale_report,p_type,p_type,cost_2);
            }
        )
        Sale_page.visit();
        Sale_page.scan(qty2 + ' ' + sku);
        Sale_page.tender();
        Tender_dlg.ok();
        Sale_page.menu_action_sync();
        
        //store3
        lib.auth.login('3','3');
        browser.wait(function(){
            return sp !== null;
        }).then(
            function(){
                lib.api.insert_old(sp.product_id,sku,name_3,price_3,val_cus_price,crv_3,tax_3,is_sale_report,p_type,p_type,cost_3);
            }
        )

        //--------------------------------------------------------------------------------
        //verify statistic calculation of network_product in confirm select product dialog
        //--------------------------------------------------------------------------------
            Sp_page.sku_search(sku);
            Sp_page.click_col(0,'info');
            Sp_info_dlg.switch_tab('network_product');
            lib.click(Sp_info_dlg.get_network_product_btn);
            lib.wait_for_block_ui();
            //-------
            //summary
            //-------   
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
            //detail - cost_price_sale
            //--------------------------  
            expect(Network_product_partial.detail.cost_price_sale.lst.count()).toEqual(3);
            expect(Network_product_partial.detail.cost_price_sale.get_col(0,'cost')).toEqual(lib.currency(cost_1));
            expect(Network_product_partial.detail.cost_price_sale.get_col(0,'price')).toEqual(lib.currency(price_1));
            expect(Network_product_partial.detail.cost_price_sale.get_col(0,'sale')).toEqual(qty1.toString());

            expect(Network_product_partial.detail.cost_price_sale.get_col(1,'cost')).toEqual(lib.currency(cost_3));
            expect(Network_product_partial.detail.cost_price_sale.get_col(1,'price')).toEqual(lib.currency(price_3));
            expect(Network_product_partial.detail.cost_price_sale.get_col(1,'sale')).toEqual('');

            expect(Network_product_partial.detail.cost_price_sale.get_col(2,'cost')).toEqual('');
            expect(Network_product_partial.detail.cost_price_sale.get_col(2,'price')).toEqual(lib.currency(price_2));      
            expect(Network_product_partial.detail.cost_price_sale.get_col(2,'sale')).toEqual(qty2.toString());                              
    },70000)
});