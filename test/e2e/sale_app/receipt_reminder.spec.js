var base_path = './../';
var lib = require(base_path + 'lib');

describe('sale page\'s receipt reminder', function() {
    
    var Sale_page = require(base_path + 'page/sale/Sale_page.js');
    var _3_option_dlg = require(base_path + 'page/ui/_3_option_dlg.js');
    var Tender_dlg = require(base_path + 'page/sale/Tender_dlg.js');
    var Alert_dlg = require(base_path + 'page/ui/Alert_dlg.js');

    beforeEach(function(){
        lib.auth.login('1','1');
        lib.setup.init_data();
        lib.auth.logout();
    })

    it('can remind, snooze, push receipt',function(){
        lib.auth.login('1','1');
        var sku='1'; var name = 'product'; var price = 1;
        lib.api.insert_new(sku,name,price);

        Sale_page.visit();
        //-----------------------------------------------------
        //reduce global setting of max_receipt to speed up test
        //-----------------------------------------------------
        browser.executeAsyncScript(function(callback) {
            angular.element(document).scope().GLOBAL_SETTING.MAX_RECEIPT = 3;
            angular.element(document).scope().next_receipt_count_reminder = 3;
            angular.element(document).scope().GLOBAL_SETTING.MAX_RECEIPT_SNOOZE_1 = 1;
            angular.element(document).scope().GLOBAL_SETTING.MAX_RECEIPT_SNOOZE_2 = 2;

            callback();
        })

        /*
            test max_receipt reminder
            test snooze1
            test snooze2
            test push
            test max_receipt
            test cancel as snooze_2
        */

        //-----------------------
        //test max receipt remind
        //-----------------------
        Sale_page.scan(sku);Sale_page.tender();Tender_dlg.ok();
        Sale_page.scan(sku);Sale_page.tender();Tender_dlg.ok();
        Sale_page.scan(sku);Sale_page.tender();Tender_dlg.ok();
        expect(_3_option_dlg.self.isPresent()).toEqual(true);        

        //-------------
        //test snooze 1
        //-------------        
        lib.click(_3_option_dlg._1_btn);
        Sale_page.scan(sku);Sale_page.tender();Tender_dlg.ok();
        expect(_3_option_dlg.self.isPresent()).toEqual(true);    

        //-------------
        //test snooze 2
        //-------------        
        lib.click(_3_option_dlg._2_btn);
        Sale_page.scan(sku);Sale_page.tender();Tender_dlg.ok();
        Sale_page.scan(sku);Sale_page.tender();Tender_dlg.ok();        
        expect(_3_option_dlg.self.isPresent()).toEqual(true);       

        //----------------------------------------
        //test push - back to max_receipt reminder
        //----------------------------------------          
        lib.click(_3_option_dlg._3_btn); 
        Alert_dlg.ok();

        Sale_page.scan(sku);Sale_page.tender();Tender_dlg.ok();
        Sale_page.scan(sku);Sale_page.tender();Tender_dlg.ok();
        Sale_page.scan(sku);Sale_page.tender();Tender_dlg.ok();
        expect(_3_option_dlg.self.isPresent()).toEqual(true);      

        //-----------------------
        //test cancel as snooze_2
        //-----------------------        
        browser.actions().sendKeys(protractor.Key.ESCAPE).perform();
        Sale_page.scan(sku);Sale_page.tender();Tender_dlg.ok();
        Sale_page.scan(sku);Sale_page.tender();Tender_dlg.ok();        
        expect(_3_option_dlg.self.isPresent()).toEqual(true);                
    })
});