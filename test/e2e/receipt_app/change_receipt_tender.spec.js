var base_path = './../'
var lib = require(base_path + 'lib');

describe('sale app when change past receipt tender', function() {
    var Sale_page = require(base_path + 'page/sale/Sale_page');
    var Report_dlg = require(base_path + 'page/receipt/Report_dlg.js');
    var Tender_dlg = require(base_path + 'page/sale/Tender_dlg.js');
    var Pt_manage_dlg = require(base_path + 'page/payment_type/Manage_dlg.js');
    var Pt_prompt_dlg = require(base_path + 'page/payment_type/Prompt_dlg.js');
    var Alert_dlg = require(base_path + 'page/ui/Alert_dlg.js');
    var Prompt_dlg = require(base_path + 'page/ui/Prompt_dlg.js');

    beforeEach(function(){
        lib.auth.login('1','1');
        lib.setup.init_data();
        lib.auth.logout();
    })

    it('can disable previous receipt feature in sale page after comming out of receipt report dialog',function(){
        lib.auth.login('1','1');

        //setup product
        var product_name = 'product name 1';
        var sku = '111';var price = 1;
        lib.api.insert_new(sku,product_name,price);

        //initial scan
        Sale_page.visit();
        Sale_page.scan(sku);
        Sale_page.tender();   
        Tender_dlg.ok();

        //---------------------------------------------------------------------------------------------
        //VISIT REPORT DIALOG: so we can exit it and cause previous_receipt in sale page to be disabled
        //---------------------------------------------------------------------------------------------        
        Sale_page.menu_report_receipt();
        Report_dlg.exit();
        expect(Sale_page.change_btn.isDisplayed()).toEqual(false);
    });

    // it('can use past tax_rate of that receipt to recalculate amount',function(){
    //     lib.auth.login('1','1');

    //     //setup product
    //     var product_name = 'product name 1';
    //     var sku = '111';var price = 1;
    //     lib.api.insert_new(sku,product_name,price,null/*value customer price*/,null/*crv*/,true/*is_taxable*/);

    //     //initial scan
    //     Sale_page.visit();
    //     Sale_page.scan(sku);
    //     Sale_page.tender();      
    //     expect(Tender_dlg.due_lbl.getText()).toEqual('due: $1.09');         
    //     Tender_dlg.ok();

    //     //---------------
    //     //CHANGE TAX RATE
    //     //---------------
    //     var new_tax_rate = 20;
    //     Sale_page.menu_setting_tax();
    //     Prompt_dlg.set_prompt(20);
    //     Prompt_dlg.ok();

    //     lib.click(Sale_page.change_btn);
    //     expect(Tender_dlg.due_lbl.getText()).toEqual('due: $1.09');

    // })

    // it('can enable inactive pt for past receipt tender',function(){
    //     lib.auth.login('1','1');

    //     /*
    //         when finalize a receipt with a pt, then later deactivate it. we can still change this pt for this past receipt
    //     */

    //     //setup product
    //     var product_name = 'product name 1';
    //     var sku = '111';var price = 1;
    //     lib.api.insert_new(sku,product_name,price);

    //     //setup pt list
    //     var pt = 'pt'
    //     var pt_lst_from_server = null;
    //     lib.api_pt.insert_lst([pt])
    //     .then(
    //          function(pt_lst){ pt_lst_from_server = pt_lst; expect(pt_lst_from_server.length).toEqual(1);} 
    //         ,function(reason){ expect(true).toEqual(false); }
    //     );
    //     //initial scan
    //     Sale_page.visit();
    //     Sale_page.scan(sku);
    //     Sale_page.tender();
    //     var _1_cash_amount = '1.1';
    //     var _1_pt_amount = '2.2';

    //     browser.wait(function(){ return pt_lst_from_server !== null;/* when it is true, quit waiting */}).then(
    //         function(){
    //             Tender_dlg.cash_txt.sendKeys(_1_cash_amount);
    //             Tender_dlg.set_pt_value(pt_lst_from_server[0].id,_1_pt_amount);
    //             Tender_dlg.ok();
    //         }
    //     )          
    //     //----------
    //     //DISABLE PT
    //     //----------
    //     Sale_page.menu_setting_payment_type(); 
    //     expect(Pt_manage_dlg.lst.count()).toEqual(1);
    //     Pt_manage_dlg.click_col(0,'edit');
    //     Pt_prompt_dlg.set_is_active(false);
    //     Pt_prompt_dlg.ok();
    //     Pt_manage_dlg.exit();     

    //     //------------------------------
    //     //VERIFY THAT PT IS STILL ACTIVE
    //     //------------------------------
    //     lib.click(Sale_page.change_btn);
    //     var _2_cash_amount = '11.11';//change
    //     var _2_pt_amount = '22.22';   
    //     browser.wait(function(){ return pt_lst_from_server !== null;/* when it is true, quit waiting */}).then(
    //         function(){

    //             //verify label display
    //             expect(Tender_dlg.get_pt_label(null)).toEqual('cash:');
    //             expect(Tender_dlg.get_pt_label(pt_lst_from_server[0].id)).toEqual(pt_lst_from_server[0].name + ':');

    //             //verify prefill amount
    //             expect(Tender_dlg.get_pt_value(null)).toEqual(_1_cash_amount);
    //             expect(Tender_dlg.get_pt_value(pt_lst_from_server[0].id)).toEqual(_1_pt_amount);

    //             //adjust prefill
    //             Tender_dlg.set_pt_value(null,_2_cash_amount);
    //             Tender_dlg.set_pt_value(pt_lst_from_server[0].id,_2_pt_amount);
    //             Tender_dlg.ok();

    //             //verify adjust
    //             lib.click(Sale_page.change_btn);
    //             expect(Tender_dlg.get_pt_value(null)).toEqual(_2_cash_amount);
    //             expect(Tender_dlg.get_pt_value(pt_lst_from_server[0].id)).toEqual(_2_pt_amount);
    //             Tender_dlg.cancel();
    //         }
    //     )              
    // });

    // it('can add,remove,adjust receipt tender online/offline and sale_page/receipt_dialog_page',function(){
    //     lib.auth.login('1','1');

    //     /*
    //         We want to test adjust receipt OFFLINE and ONLINE. There are two place: pos page and report dialog. This combination create 4 scenario.
    //     */

    //     //setup product
    //     var product_name = 'product name 1';
    //     var sku = '111';var price = 1;
    //     lib.api.insert_new(sku,product_name,price);

    //     //setup pt list
    //     var pt_a = 'a';
    //     var pt_b = 'b';
    //     var pt_c = 'c';
    //     var pt_lst_from_server = null;
    //     lib.api_pt.insert_lst([pt_a,pt_b,pt_c])
    //     .then(
    //          function(pt_lst){ pt_lst_from_server = pt_lst; expect(pt_lst_from_server.length).toEqual(3);} 
    //         ,function(reason){ expect(true).toEqual(false); }
    //     );

    //     //initial scan
    //     Sale_page.visit();
    //     Sale_page.scan(sku);
    //     Sale_page.tender();
    //     var _1_cash_amount = '1.1';
    //     var _1_a_amount = '2.2';
    //     var _1_b_amount = '3.3';
    //     var _1_c_amount = '';
    //     browser.wait(function(){ return pt_lst_from_server !== null;/* when it is true, quit waiting */}).then(
    //         function(){
    //             Tender_dlg.cash_txt.sendKeys(_1_cash_amount);
    //             Tender_dlg.set_pt_value(pt_lst_from_server[0].id,_1_a_amount);
    //             Tender_dlg.set_pt_value(pt_lst_from_server[1].id,_1_b_amount);
    //             Tender_dlg.set_pt_value(pt_lst_from_server[2].id,_1_c_amount);
    //             Tender_dlg.ok();
    //         }
    //     )   
    //     //-------------------------------------------
    //     //change receipt tender on POS PAGE - OFFLINE
    //     //-------------------------------------------
    //     lib.click(Sale_page.change_btn);
    //     var _2_cash_amount = '11.11';//change
    //     var _2_a_amount = ''//remove
    //     var _2_b_amount = '33.33';//change
    //     var _2_c_amount = '44.44';//add     
    //     browser.wait(function(){ return pt_lst_from_server !== null;/* when it is true, quit waiting */}).then(
    //         function(){

    //             //verify label display
    //             expect(Tender_dlg.get_pt_label(null)).toEqual('cash:');
    //             expect(Tender_dlg.get_pt_label(pt_lst_from_server[0].id)).toEqual(pt_lst_from_server[0].name + ':');
    //             expect(Tender_dlg.get_pt_label(pt_lst_from_server[1].id)).toEqual(pt_lst_from_server[1].name + ':');
    //             expect(Tender_dlg.get_pt_label(pt_lst_from_server[2].id)).toEqual(pt_lst_from_server[2].name + ':');

    //             //verify prefill amount
    //             expect(Tender_dlg.get_pt_value(null)).toEqual(_1_cash_amount);
    //             expect(Tender_dlg.get_pt_value(pt_lst_from_server[0].id)).toEqual(_1_a_amount);
    //             expect(Tender_dlg.get_pt_value(pt_lst_from_server[1].id)).toEqual(_1_b_amount);
    //             expect(Tender_dlg.get_pt_value(pt_lst_from_server[2].id)).toEqual(_1_c_amount);

    //             //adjust prefill
    //             Tender_dlg.set_pt_value(null,_2_cash_amount);
    //             Tender_dlg.set_pt_value(pt_lst_from_server[0].id,_2_a_amount);
    //             Tender_dlg.set_pt_value(pt_lst_from_server[1].id,_2_b_amount);
    //             Tender_dlg.set_pt_value(pt_lst_from_server[2].id,_2_c_amount);
    //             Tender_dlg.ok();

    //             //verify adjust
    //             lib.click(Sale_page.change_btn);
    //             expect(Tender_dlg.get_pt_value(null)).toEqual(_2_cash_amount);
    //             expect(Tender_dlg.get_pt_value(pt_lst_from_server[0].id)).toEqual(_2_a_amount);
    //             expect(Tender_dlg.get_pt_value(pt_lst_from_server[1].id)).toEqual(_2_b_amount);
    //             expect(Tender_dlg.get_pt_value(pt_lst_from_server[2].id)).toEqual(_2_c_amount);
    //             Tender_dlg.cancel();
    //         }
    //     )   

    //     //------------------------------------------------
    //     //change receipt tender on REPORT DIALOG - OFFLINE
    //     //------------------------------------------------
    //     Sale_page.visit(true);Alert_dlg.ok()//alert offline
    //     Sale_page.menu_report_receipt();Alert_dlg.ok();//alert offline 

    //     Report_dlg.receipt.click_col(0,'info');
    //     lib.click(Report_dlg.receipt.summary.change_receipt_tender_btn);
    //     var _3_cash_amount = '111.111';//change
    //     var _3_a_amount = '222.222'//add
    //     var _3_b_amount = '';//remove
    //     var _3_c_amount = '444.444';//change         
    //     browser.wait(function(){ return pt_lst_from_server !== null;/* when it is true, quit waiting */}).then(
    //         function(){
    //             //verify label display
    //             expect(Tender_dlg.get_pt_label(null)).toEqual('cash:');
    //             expect(Tender_dlg.get_pt_label(pt_lst_from_server[0].id)).toEqual(pt_lst_from_server[0].name + ':');
    //             expect(Tender_dlg.get_pt_label(pt_lst_from_server[1].id)).toEqual(pt_lst_from_server[1].name + ':');
    //             expect(Tender_dlg.get_pt_label(pt_lst_from_server[2].id)).toEqual(pt_lst_from_server[2].name + ':');

    //             //verify prefill amount
    //             expect(Tender_dlg.get_pt_value(null)).toEqual(_2_cash_amount);
    //             expect(Tender_dlg.get_pt_value(pt_lst_from_server[0].id)).toEqual(_2_a_amount);
    //             expect(Tender_dlg.get_pt_value(pt_lst_from_server[1].id)).toEqual(_2_b_amount);
    //             expect(Tender_dlg.get_pt_value(pt_lst_from_server[2].id)).toEqual(_2_c_amount);

    //             //adjust prefill
    //             Tender_dlg.set_pt_value(null,_3_cash_amount);
    //             Tender_dlg.set_pt_value(pt_lst_from_server[0].id,_3_a_amount);
    //             Tender_dlg.set_pt_value(pt_lst_from_server[1].id,_3_b_amount);
    //             Tender_dlg.set_pt_value(pt_lst_from_server[2].id,_3_c_amount);
    //             Tender_dlg.ok();

    //             //verify adjust
    //             lib.click(Report_dlg.receipt.summary.change_receipt_tender_btn);
    //             expect(Tender_dlg.get_pt_value(null)).toEqual(_3_cash_amount);
    //             expect(Tender_dlg.get_pt_value(pt_lst_from_server[0].id)).toEqual(_3_a_amount);
    //             expect(Tender_dlg.get_pt_value(pt_lst_from_server[1].id)).toEqual(_3_b_amount);
    //             expect(Tender_dlg.get_pt_value(pt_lst_from_server[2].id)).toEqual(_3_c_amount);
    //             Tender_dlg.cancel();
    //         }
    //     );

    //     //------------------------------------------
    //     //change receipt tender on POS PAGE - ONLINE
    //     //------------------------------------------
    //     Sale_page.visit();
    //     Sale_page.scan(sku);
    //     Sale_page.tender();   
    //     browser.wait(function(){ return pt_lst_from_server !== null;/* when it is true, quit waiting */}).then(
    //         function(){
    //             Tender_dlg.set_pt_value(null,_3_cash_amount)
    //             Tender_dlg.set_pt_value(pt_lst_from_server[0].id,_3_a_amount)
    //             Tender_dlg.set_pt_value(pt_lst_from_server[1].id,_3_b_amount)
    //             Tender_dlg.set_pt_value(pt_lst_from_server[2].id,_3_c_amount)
    //             Tender_dlg.ok();   
    //         }
    //     )            
 
    //     Sale_page.menu_action_sync();
    //     Alert_dlg.ok();//acknoledge the sync info
    //     lib.click(Sale_page.change_btn);
    //     var _4_cash_amount = '32.23';//change
    //     var _4_a_amount = '';//leave alone
    //     var _4_b_amount = '';//leave alone
    //     var _4_c_amount = '';//leave alone    
    //     browser.wait(function(){ return pt_lst_from_server !== null;/* when it is true, quit waiting */}).then(
    //         function(){
    //             //verify label display
    //             expect(Tender_dlg.get_pt_label(null)).toEqual('cash:');
    //             expect(Tender_dlg.get_pt_label(pt_lst_from_server[0].id)).toEqual(pt_lst_from_server[0].name + ':');
    //             expect(Tender_dlg.get_pt_label(pt_lst_from_server[1].id)).toEqual(pt_lst_from_server[1].name + ':');
    //             expect(Tender_dlg.get_pt_label(pt_lst_from_server[2].id)).toEqual(pt_lst_from_server[2].name + ':');

    //             //verify prefill amount
    //             expect(Tender_dlg.get_pt_value(null)).toEqual(_3_cash_amount);
    //             expect(Tender_dlg.get_pt_value(pt_lst_from_server[0].id)).toEqual(_3_a_amount);
    //             expect(Tender_dlg.get_pt_value(pt_lst_from_server[1].id)).toEqual(_3_b_amount);
    //             expect(Tender_dlg.get_pt_value(pt_lst_from_server[2].id)).toEqual(_3_c_amount);

    //             //adjust prefill
    //             Tender_dlg.set_pt_value(null,_4_cash_amount);
    //             Tender_dlg.set_pt_value(pt_lst_from_server[0].id,_4_a_amount);
    //             Tender_dlg.set_pt_value(pt_lst_from_server[1].id,_4_b_amount);
    //             Tender_dlg.set_pt_value(pt_lst_from_server[2].id,_4_c_amount);
    //             Tender_dlg.ok();

    //             //verify adjust
    //             lib.click(Sale_page.change_btn);
    //             expect(Tender_dlg.get_pt_value(null)).toEqual(_4_cash_amount);
    //             expect(Tender_dlg.get_pt_value(pt_lst_from_server[0].id)).toEqual(_4_a_amount);
    //             expect(Tender_dlg.get_pt_value(pt_lst_from_server[1].id)).toEqual(_4_b_amount);
    //             expect(Tender_dlg.get_pt_value(pt_lst_from_server[2].id)).toEqual(_4_c_amount);
    //             Tender_dlg.cancel();
    //         }
    //     );        
    //     //------------------------------------------------
    //     //change receipt tender on RECEIPT DIALOG - ONLINE
    //     //------------------------------------------------
    //     Sale_page.menu_report_receipt();
    //     Report_dlg.receipt.click_col(0,'info');
    //     lib.click(Report_dlg.receipt.summary.change_receipt_tender_btn);
    //     var _5_cash_amount = '43.34';//change
    //     var _5_a_amount = '';//leave alone
    //     var _5_b_amount = '';//leave alone
    //     var _5_c_amount = '';//leave alone         
    //     browser.wait(function(){ return pt_lst_from_server !== null;/* when it is true, quit waiting */}).then(
    //         function(){
    //             //verify label display
    //             expect(Tender_dlg.get_pt_label(null)).toEqual('cash:');
    //             expect(Tender_dlg.get_pt_label(pt_lst_from_server[0].id)).toEqual(pt_lst_from_server[0].name + ':');
    //             expect(Tender_dlg.get_pt_label(pt_lst_from_server[1].id)).toEqual(pt_lst_from_server[1].name + ':');
    //             expect(Tender_dlg.get_pt_label(pt_lst_from_server[2].id)).toEqual(pt_lst_from_server[2].name + ':');

    //             //verify prefill amount
    //             expect(Tender_dlg.get_pt_value(null)).toEqual(_4_cash_amount);
    //             expect(Tender_dlg.get_pt_value(pt_lst_from_server[0].id)).toEqual(_4_a_amount);
    //             expect(Tender_dlg.get_pt_value(pt_lst_from_server[1].id)).toEqual(_4_b_amount);
    //             expect(Tender_dlg.get_pt_value(pt_lst_from_server[2].id)).toEqual(_4_c_amount);

    //             //adjust prefill
    //             Tender_dlg.set_pt_value(null,_5_cash_amount);
    //             Tender_dlg.set_pt_value(pt_lst_from_server[0].id,_5_a_amount);
    //             Tender_dlg.set_pt_value(pt_lst_from_server[1].id,_5_b_amount);
    //             Tender_dlg.set_pt_value(pt_lst_from_server[2].id,_5_c_amount);
    //             Tender_dlg.ok();

    //             //verify adjust
    //             lib.click(Report_dlg.receipt.summary.change_receipt_tender_btn);
    //             expect(Tender_dlg.get_pt_value(null)).toEqual(_5_cash_amount);
    //             expect(Tender_dlg.get_pt_value(pt_lst_from_server[0].id)).toEqual(_5_a_amount);
    //             expect(Tender_dlg.get_pt_value(pt_lst_from_server[1].id)).toEqual(_5_b_amount);
    //             expect(Tender_dlg.get_pt_value(pt_lst_from_server[2].id)).toEqual(_5_c_amount);
    //             Tender_dlg.cancel();
    //         }
    //     );
    // },60000)
});
