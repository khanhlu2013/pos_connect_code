var base_path = './../'
var lib = require(base_path + 'lib');

describe('receipt_app\'s Report dialog', function() {

    var Sale_page = require(base_path + 'page/sale/Sale_page');
    var Tender_ui = require(base_path + 'page/sale/Tender_dlg');

    beforeEach(function(){
        lib.auth.login('1','1');
        lib.setup.init_data();
        lib.auth.logout();
    })
    
    it('display offline receipt when internet is disconnected',function(){
        /*
            . 2 out of wack
            . 2 in range
                . -price -> member less price, but his volumn beat you
                . +price -> member less volumn, but his price is more and beat you.        
            . 1 you
        */
        var sku = '111';
        var pid = undefined;

        //my store
        lib.auth.login('1','1');
        var my_price = 3;my_cost = 2;
        lib.api.insert_new(sku,'Coke 12oz',my_price,null/*value_customer_price*/,null/*crv*/,true/*is_taxable*/,false/*is_sale_report*/,null/*p_type*/,null/*p_tag*/,my_cost,null/*vendor*/,null/*buydown*/).then(
            function(product){
                pid = product.product_id;
            }
        )
        /*my sale*/Sale_page.visit(); Sale_page.scan('2 ' + sku);Sale_page.tender();Tender_ui.ok();Sale_page.menu_report_receipt();

        browser.wait(function(){
            return pid !== undefined;
        }).then(
            function(){
                //less store -> store that suggest price should be LESS and he make more profit, so we should TAKE this guy advice
                lib.auth.login('2','2');
                var less_take_name = 'Coke 12oz can'; var less_take_price = 2.90; var less_take_cost = 1.95;
                lib.api.insert_old(pid,sku,less_take_name,less_take_price,null/*val_cus_price*/,0.05/*crv*/,true/*is_taxable*/,false/*is_sale_report*/,null/*p_type*/,null/*p_tag*/,less_take_cost,null/*vendor*/,null/*buydown*/);
                /*more sale*/Sale_page.visit(); Sale_page.scan('3 ' + sku);Sale_page.tender();Tender_ui.ok();Sale_page.menu_report_receipt();

                //more store -> store that suggest price should be more but profit turn out to be low so we not worry about this guy
                lib.auth.login('3','3');
                var more_noTake_name = 'Coke 12oz can'; var more_noTake_price = 3.15; var more_noTake_cost = 2.10;
                lib.api.insert_old(pid,sku,more_noTake_name,more_noTake_price,null/*val_cus_price*/,0.05/*crv*/,true/*is_taxable*/,false/*is_sale_report*/,null/*p_type*/,null/*p_tag*/,more_noTake_cost,null/*vendor*/,null/*buydown*/);
                /*less sale*/Sale_page.visit(); Sale_page.scan('1 ' + sku);Sale_page.tender();Tender_ui.ok();Sale_page.menu_report_receipt();

                //more store -> store that suggest price should be more and the profit turn out more so we should take his advice
                lib.auth.login('4','4');
                var more_name_take = 'Coke 12oz can'; var more_take_price = 4.44; var more_take_cost = 2.05;
                lib.api.insert_old(pid,sku,more_name_take,more_take_price,null/*val_cus_price*/,0.05/*crv*/,true/*is_taxable*/,false/*is_sale_report*/,null/*p_type*/,null/*p_tag*/,more_take_cost,null/*vendor*/,null/*buydown*/);
                /*less sale*/Sale_page.visit(); Sale_page.scan('2 ' + sku);Sale_page.tender();Tender_ui.ok();Sale_page.menu_report_receipt();

                //out of wack store
                lib.auth.login('5','5');        
                lib.api.insert_old(pid,sku,'Coke 12oz',0.99/*price*/,null/*val_cus_price*/,0.10/*crv*/,true/*is_taxable*/,false/*is_sale_report*/,null/*p_type*/,null/*p_tag*/,0.90/*cost*/,null/*vendor*/,null/*buydown*/);
                /*less sale*/Sale_page.visit(); Sale_page.scan('25 ' + sku);Sale_page.tender();Tender_ui.ok();Sale_page.menu_report_receipt();

                //out of wack store
                lib.auth.login('6','6');          
                lib.api.insert_old(pid,sku,'COKE CAN',4.94/*price*/,null/*val_cus_price*/,0.05/*crv*/,false/*is_taxable*/,false/*is_sale_report*/,null/*p_type*/,null/*p_tag*/,4.79/*cost*/,null/*vendor*/,null/*buydown*/);

                //irrelevant product with same sku
                lib.auth.login('7','7');   
                lib.api.insert_new(sku,'T shirt',4.99,null/*value_customer_price*/,null/*crv*/,true/*is_taxable*/,false/*is_sale_report*/,null/*p_type*/,null/*p_tag*/,3.00/*cost*/,null/*vendor*/,null/*buydown*/)
            }
        )
    },90000)
});
