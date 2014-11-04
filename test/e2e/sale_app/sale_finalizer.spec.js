var base_path = './../';
var lib = require(base_path + 'lib');

describe('sale_app', function() {
    var Ui_prompt_dlg = require(base_path + 'page/ui/Prompt_dlg.js');
    var Sale_page = require(base_path + 'page/sale/Sale_page')
    var Receipt_dlg = require(base_path + 'page/receipt/Report_dlg');
    var Sale_able_info_dlg = require(base_path + 'page/sale/Sale_able_info_dlg');
    var Tender_dlg = require(base_path + 'page/sale/Tender_dlg');
    var Non_inventory_prompt_dlg = require(base_path + 'page/sp/Non_inventory_prompt_dlg.js');

    beforeEach(function(){
        lib.auth.login('1','1');
        lib.setup.init_data();
        lib.auth.logout();
    })
    
    it('can record receipt data offline: different payment type, and different kind of receipt_ln such as override_price item, deal item, non_inventory item, kit item',function(){
        lib.auth.login('1','1');

        //setup override price item
        var product_name_1 = 'product name 1';
        var sku_1 = '111';var price_1 = 1;var override_price_1 = 0.5;
        lib.api.insert_new(sku_1,product_name_1,price_1);

        //setup mm_deal item
        var product_name_2 = 'product name 2';
        var sku_2 = '222';var price_2 = 2;var qty_2 = 9;
        var _5_deal_name = "5 items deal";var _5_deal_price = 5; var _5_deal_is_include = false; _5_deal_qty = 5;
        var _3_deal_name = "3 items deal";var _3_deal_price = 4; var _3_deal_is_include = false; _3_deal_qty = 3;

        //setup kit product
        var sp_kit = null;
        var product_kit = 'kit';
        var sku_kit = 'sku_kit';var price_kit = 2;
        lib.api.insert_new(sku_kit,product_kit,price_kit)
        .then(
             function(sp){sp_kit = sp;}
            ,function(reason){expect(true).toEqual(false);}
        );
        //setup bd product
        var sp_bd = null;
        var product_bd = 'bd'
        var sku_bd = 'sku_bd';var price_bd = 1;var crv_bd = 0.1;var cost_bd = 0.2;var buydown_bd = 0.3;var qty_bd = 2;
        lib.api.insert_new(sku_bd,product_bd,price_bd,null/*val_cus_price*/,crv_bd,true/*is_taxable*/,true/*is_sale_report*/,null/*p_type*/,null/*p_tag*/,cost_bd,null/*vendor*/,buydown_bd)
        .then(
             function(sp){sp_bd = sp;}
            ,function(reason){expect(true).toEqual(false);}
        );        
        //link kit and bd product
        var updated_kit_successfully = false;
        browser.wait(function(){
            return sp_kit !== null && sp_bd !== null;//when it is true, quit waiting
        }).then(
            function(){
                var assoc = {breakdown:sp_bd,qty:qty_bd}
                sp_kit.breakdown_assoc_lst.push(assoc);
                lib.api.update_kit(sp_kit).then(
                    function(){
                        updated_kit_successfully = true;
                    }
                    ,function(reason){expect(true).toEqual(false);}
                )
            }
        )            

        //setup pt list
        var credit_card_pt = 'credit card';
        var check_pt = 'check';
        var pt_lst_from_server = null;
        lib.api_pt.insert_lst([credit_card_pt,check_pt])
        .then(
             function(pt_lst){ pt_lst_from_server = pt_lst; expect(pt_lst_from_server.length).toEqual(2);} 
            ,function(reason){ expect(true).toEqual(false); }
        );

        lib.api.insert_new(sku_2,product_name_2,price_2)
        .then(function(sp){
            lib.api.insert_mm(_5_deal_name,_5_deal_price,_5_deal_is_include,_5_deal_qty,[sp]);
            lib.api.insert_mm(_3_deal_name,_3_deal_price,_3_deal_is_include,_3_deal_qty,[sp]);
        })

        //test sale finalizer and receipt report data
        Sale_page.visit();

        //setup and override price item
        Sale_page.scan(sku_1);
        Sale_page.click_col(0,'price');
        Sale_able_info_dlg.override_price();
        Ui_prompt_dlg.set_prompt(override_price_1);
        Ui_prompt_dlg.ok();
        Sale_able_info_dlg.ok();

        //setup mm_deal item
        Sale_page.scan(qty_2 + ' ' + sku_2)
        
        //setup non_inventory
        var ni_price=1.1;var ni_crv=2.2; var ni_is_taxable=true;
        Sale_page.non_inventory();
        Non_inventory_prompt_dlg.set_price(ni_price);
        Non_inventory_prompt_dlg.set_crv(ni_crv);
        Non_inventory_prompt_dlg.set_is_taxable(ni_is_taxable);
        Non_inventory_prompt_dlg.ok();        
        
        //setup kit
        browser.wait(function(){
            return updated_kit_successfully;
        }).then(
            function(){
                Sale_page.scan(sku_kit);
            }
        )            

        //finalize sale
        expect(Sale_page.lst.count()).toEqual(5);  
        expect(Sale_page.tender_btn.getText()).toEqual('$16.68');
        Sale_page.tender();

        browser.wait(function(){
            return pt_lst_from_server !== null;//when it is true, quit waiting
        }).then(
            function(){
                Tender_dlg.cash_txt.sendKeys('10');
                element(by.id('sale_app/service/tender_ui/pt_txt/' + pt_lst_from_server[0].id)).sendKeys('20');
                element(by.id('sale_app/service/tender_ui/pt_txt/' + pt_lst_from_server[1].id)).sendKeys('30');
                Tender_dlg.ok();
            }
        )        

        //check receipt report
        Sale_page.menu_report_receipt();
        expect(Receipt_dlg.online.receipt.lst.count()).toEqual(1);
        expect(Receipt_dlg.online.receipt.get_col(0,'total')).toEqual('$16.68');
        Receipt_dlg.online.receipt.click_col(0,'info');
        expect(Receipt_dlg.online.receipt_ln.lst.count()).toEqual(6);

        //verify receipt ln
        // expect(Receipt_dlg.online.receipt_ln.get_col(0,'qty')).toEqual('1');
        // expect(Receipt_dlg.online.receipt_ln.get_col(0,'product')).toEqual(product_name_1);
        // expect(Receipt_dlg.online.receipt_ln.get_col(0,'price')).toEqual('$0.50');

        // expect(Receipt_dlg.online.receipt_ln.get_col(1,'qty')).toEqual('5');
        // expect(Receipt_dlg.online.receipt_ln.get_col(1,'product')).toEqual(product_name_2);
        // expect(Receipt_dlg.online.receipt_ln.get_col(1,'price')).toEqual('$1.00');

        // expect(Receipt_dlg.online.receipt_ln.get_col(2,'qty')).toEqual('3');
        // expect(Receipt_dlg.online.receipt_ln.get_col(2,'product')).toEqual(product_name_2);
        // expect(Receipt_dlg.online.receipt_ln.get_col(2,'price')).toEqual('$1.33');

        expect(Receipt_dlg.online.receipt_ln.get_col(3,'qty')).toEqual('1');
        expect(Receipt_dlg.online.receipt_ln.get_col(3,'product')).toEqual(product_name_2);
        expect(Receipt_dlg.online.receipt_ln.get_col(3,'price')).toEqual('$2.00');

        expect(Receipt_dlg.online.receipt_ln.get_col(4,'qty')).toEqual('1');
        expect(Receipt_dlg.online.receipt_ln.get_col(4,'product')).toEqual('none inventory');
        expect(Receipt_dlg.online.receipt_ln.get_col(4,'price')).toEqual(lib.currency(ni_price));

        expect(Receipt_dlg.online.receipt_ln.get_col(5,'qty')).toEqual('1');
        expect(Receipt_dlg.online.receipt_ln.get_col(5,'product')).toEqual(product_kit);
        expect(Receipt_dlg.online.receipt_ln.get_col(5,'price')).toEqual('$1.40');

        Receipt_dlg.exit();
        lib.auth.logout();
    });
});