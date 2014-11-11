var base_path = './../../';
var lib = require(base_path + 'lib');


describe('sale_app/displaying_scan/non_inventory', function() {
    //prompt service
    var Non_inventory_prompt_dlg = require(base_path + 'page/sp/Non_inventory_prompt_dlg.js');
    var Sale_page = require(base_path + 'page/sale/Sale_page.js');

    beforeEach(function(){
        lib.auth.login('1','1');
        lib.setup.init_data();
        lib.auth.logout();
    })

    it('can scan,edit price, edit name,remove non inventory',function(){
        lib.auth.login('1','1');
        Sale_page.visit();

        //can scan non inventory
        var price = 1.23;
        var crv = 0.12;
        var is_taxable = true;
        var cost = 1.51;
        Sale_page.non_inventory();
        expect(Non_inventory_prompt_dlg.get_name()).toEqual('none inventory');
        Non_inventory_prompt_dlg.set_price(price);
        Non_inventory_prompt_dlg.set_crv(crv);
        Non_inventory_prompt_dlg.set_is_taxable(is_taxable);
        Non_inventory_prompt_dlg.set_cost(cost);
        Non_inventory_prompt_dlg.ok();
        expect(Sale_page.lst.count()).toEqual(1);
        expect(Sale_page.tender_btn.getText()).toEqual('$1.47');

        //can combine
        Sale_page.non_inventory();
        Non_inventory_prompt_dlg.set_price(price);
        Non_inventory_prompt_dlg.set_crv(crv);
        Non_inventory_prompt_dlg.set_is_taxable(is_taxable);
        Non_inventory_prompt_dlg.set_cost(cost);
        Non_inventory_prompt_dlg.ok();
        expect(Sale_page.lst.count()).toEqual(1);
        expect(Sale_page.tender_btn.getText()).toEqual('$2.94');        
        expect(Sale_page.get_col(0,'qty')).toEqual('2');

        //can separate 
        Sale_page.non_inventory();
        Non_inventory_prompt_dlg.set_price(1);
        Non_inventory_prompt_dlg.set_crv(2);
        Non_inventory_prompt_dlg.set_is_taxable(false);
        Non_inventory_prompt_dlg.set_cost(cost);
        Non_inventory_prompt_dlg.ok();
        expect(Sale_page.lst.count()).toEqual(2);
        expect(Sale_page.tender_btn.getText()).toEqual('$5.94');        
        expect(Sale_page.get_col(1,'qty')).toEqual('1');

        //can remove 
        Sale_page.click_col(1,'delete');
        expect(Sale_page.lst.count()).toEqual(1);
        expect(Sale_page.tender_btn.getText()).toEqual('$2.94');          
        
        //can change name,price,crv,is_taxable,cost
        var new_name = 'new non product name';
        var new_price = 1.1;
        var new_crv = 2.2;
        var new_cost = 3.3;
        var new_is_taxable = false;
        Sale_page.click_col(0,'name');
        Non_inventory_prompt_dlg.set_name(new_name);
        Non_inventory_prompt_dlg.set_price(new_price);
        Non_inventory_prompt_dlg.set_crv(new_crv);
        Non_inventory_prompt_dlg.set_is_taxable(new_is_taxable);
        Non_inventory_prompt_dlg.set_cost(new_cost);
        Non_inventory_prompt_dlg.ok();
        expect(Sale_page.get_col(0,'name')).toEqual(new_name);
        expect(Sale_page.get_col(0,'crv')).toEqual(lib.currency(new_crv));
        expect(Sale_page.get_col(0,'price')).toEqual(lib.currency(new_price));
        expect(Sale_page.tender_btn.getText()).toEqual('$6.60');  
        Sale_page.click_col(0,'name');
        expect(Non_inventory_prompt_dlg.get_cost()).toEqual('3.3');
        Non_inventory_prompt_dlg.cancel();

        //clean up
        Sale_page.void();
    });
});