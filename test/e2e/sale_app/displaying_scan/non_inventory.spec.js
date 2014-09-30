var base_path = './../../';
var lib = require(base_path + 'lib');


describe('sale_app/displaying_scan/non_inventory', function() {
    //prompt service
    var Ui_prompt_dlg = require(base_path + 'page/ui/Prompt_dlg.js');
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
        Sale_page.non_inventory();
        Ui_prompt_dlg.set_prompt('1.23')
        Ui_prompt_dlg.ok();
        expect(Sale_page.lst.count()).toEqual(1);
        expect(Sale_page.tender_btn.getText()).toEqual('$1.23');

        //can combine
        Sale_page.non_inventory();
        Ui_prompt_dlg.set_prompt('1.23');
        Ui_prompt_dlg.ok();
        expect(Sale_page.lst.count()).toEqual(1);
        expect(Sale_page.tender_btn.getText()).toEqual('$2.46');        
        expect(Sale_page.get_col(0,'qty')).toEqual('2');

        //can separate 
        Sale_page.non_inventory();
        Ui_prompt_dlg.set_prompt('1.11');
        Ui_prompt_dlg.ok();
        expect(Sale_page.lst.count()).toEqual(2);
        expect(Sale_page.tender_btn.getText()).toEqual('$3.57');        
        expect(Sale_page.get_col(1,'qty')).toEqual('1');

        //can remove 
        Sale_page.click_col(1,'delete');
        expect(Sale_page.lst.count()).toEqual(1);
        expect(Sale_page.tender_btn.getText()).toEqual('$2.46');          
        
        //can change name   
        var new_name = 'new non product name';
        Sale_page.click_col(0,'name');
        Ui_prompt_dlg.set_prompt(new_name);
        Ui_prompt_dlg.ok();
        expect(Sale_page.get_col(0,'name')).toEqual(new_name);

        //can change price
        var new_price = 1.11;
        Sale_page.click_col(0,'price');
        Ui_prompt_dlg.set_prompt(new_price);
        Ui_prompt_dlg.ok();
        expect(Sale_page.get_col(0,'price')).toEqual('$1.11');
        expect(Sale_page.tender_btn.getText()).toEqual('$2.22');    

        //clean up
        Sale_page.void();
        lib.auth.logout();
    });
});