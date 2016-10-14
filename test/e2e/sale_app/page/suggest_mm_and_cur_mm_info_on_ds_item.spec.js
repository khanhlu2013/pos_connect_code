var base_path = './../../';
var lib = require(base_path + 'lib');

describe('sale page', function() {
    var Sale_page = require(base_path + 'page/sale/Sale_page')
    var Tender_dlg = require(base_path + 'page/sale/Tender_dlg');

    beforeEach(function(){
        lib.auth.login('1','1');
        lib.setup.init_data();
        lib.auth.logout();
    })
    
    it('can display suggest mm deal and current formed mm deal on ds item',function(){
        lib.auth.login('1','1');

        //insert sp
        var product_name = 'deal product';
        var product_sku = '111';
        var product_price = 1.8;
        var product_crv = 0.2
        var sp = null;
        lib.api.insert_new(product_sku,product_name,product_price,null/*val_cus_price*/,product_crv).then(
            function(created_sp){
                sp = created_sp
            }
        )

        //insert deal
        var _3_deal_name = "3 items deal";var _3_deal_price = 4; var _3_deal_is_include = false; _3_deal_qty = 3;
        browser.wait(function(){
            return sp !== null;
        }).then(function(){
            lib.api.insert_mm(_3_deal_name,_3_deal_price,_3_deal_is_include,_3_deal_qty,[sp],false);
        });

        Sale_page.visit();

        Sale_page.scan('4 ' + product_sku);lib.wait_for_block_ui();
        expect(Sale_page.lst.count()).toEqual(2);
        expect(Sale_page.get_col_html(0,'name')).toEqual('deal product (3$4)<mark class="ng-binding"></mark>');
        expect(Sale_page.get_col_html(1,'name')).toEqual('deal product <mark class="ng-binding">(3$4)</mark>');

        //clean up
        Sale_page.void();
    });
});