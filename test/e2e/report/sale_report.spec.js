var base_path = './../'
var lib = require(base_path + 'lib');

describe('Sale report', function() {
    var Sale_page = require(base_path + 'page/sale/Sale_page');
    var Tender_dlg = require(base_path + 'page/sale/Tender_dlg.js');
    var Report_dlg = require(base_path + 'page/report/Sale_report_dlg.js');

    beforeEach(function(){
        lib.auth.login('1','1');
        lib.setup.init_data();
        lib.auth.logout();
    })

    it('can pull report for date range',function(){

        //-----------------
        // insert a product
        //-----------------
        lib.auth.login('1','1');
        var sku = '111';var price = 1;
        lib.api.insert_new(sku,'product name',price);

        //----------------------------------
        // making 3 receipt with qty = 1,2,3 
        //----------------------------------
        var _1_qty = 1; var _2_qty = 2; var _3_qty = 3;
        Sale_page.visit();

        Sale_page.scan(_1_qty + ' ' + sku);
        Sale_page.tender();
        Tender_dlg.ok();

        Sale_page.scan(_2_qty + ' ' + sku);
        Sale_page.tender();
        Tender_dlg.ok();

        Sale_page.scan(_3_qty + ' ' + sku);
        Sale_page.tender();
        Tender_dlg.ok();

        var adjust_date = false;
        lib.api_receipt.get_lst().then(
            function(lst){
                var promise_lst = [];
                for(var i = 0;i<lst.length;i++){
                    var cur_receipt = lst[i];
                    promise_lst.push(lib.api_receipt.edit_date(cur_receipt,(cur_receipt.receipt_ln_lst[0].qty-1)*-1) )
                }
                protractor.promise.all(promise_lst).then(
                    function(){
                        adjust_date = true;
                    }
                )
            }
        )
        browser.wait(function(){
            return adjust_date === true
        }).then(
            function(){
                //-----------------------
                // test today sale report
                //-----------------------               
                Sale_page.menu_report_sale();
                Report_dlg.refresh_today_report();
                expect(Report_dlg.type_tag_report_lst.count()).toEqual(2);
                expect(Report_dlg.type_tag_report_lst.get(0).all(by.tagName('td')).get(3).getText()).toEqual('$1.00');

                //------------------------------------------------
                // test yesterday and before yesterday sale report
                //------------------------------------------------
                Report_dlg.from_txt.clear();
                Report_dlg.to_txt.clear();
                
                var yesterday = new Date();yesterday.setDate(yesterday.getDate() -1);
                var before_yesterday = new Date();before_yesterday.setDate(before_yesterday.getDate()-2);         

                Report_dlg.from_txt.sendKeys((before_yesterday.getMonth()+1) + '-' + before_yesterday.getDate() + '-' + (before_yesterday.getYear() + 1900));
                Report_dlg.to_txt.sendKeys((yesterday.getMonth()+1) + '-' + yesterday.getDate() + '-' + (yesterday.getYear()+1900));

                Report_dlg.refresh_report();
                expect(Report_dlg.type_tag_report_lst.count()).toEqual(2);
                expect(Report_dlg.type_tag_report_lst.get(0).all(by.tagName('td')).get(3).getText()).toEqual('$5.00');                   
            }
        )
    })
});


