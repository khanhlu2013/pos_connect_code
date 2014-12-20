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
        // //-----------------
        // // insert a product
        // //-----------------
        // lib.auth.login('1','1');
        // var sku = '111';var price = 1;
        // lib.api.insert_new(sku,'product name',price);

        // //-----------------
        // // making 3 receipt
        // //-----------------
        // var _1_qty = 1; var _2_qty = 2; var _3_qty = 3;
        // Sale_page.visit();

        // Sale_page.scan(_1_qty + ' ' + sku);
        // Sale_page.tender();
        // Tender_dlg.ok();

        // Sale_page.scan(_2_qty + ' ' + sku);
        // Sale_page.tender();
        // Tender_dlg.ok();

        // Sale_page.scan(_3_qty + ' ' + sku);
        // Sale_page.tender();
        // Tender_dlg.ok();

        //----------------------------------
        // subtract date from these receipts
        //----------------------------------
        // var is_subtract_date = false;
        // browser.executeAsyncScript(function(callback) {
        //     var global_setting_service = angular.injector(['ng','service/global_setting']).get('service/global_setting');
        //     var receipt_api_offline = angular.injector(['ng','receipt/api_offline']).get('receipt/api_offline');
        //     var $q = angular.injector(['ng']).get('$q');
        //     global_setting_service.refresh().then(
        //         function(global_setting){
        //             receipt_api_offline.get_receipt_lst_xxx().then(
        //                 function(receipt_lst){
        //                     var promise_lst = []
        //                     for(var i = 0;i<receipt_lst.length;i++){
        //                         promise_lst.push(subtract_date_base_on_qty(receipt_lst[i],$q));
        //                     }
        //                     $q.all(promise_lst).then(
        //                          function(){
        //                             callback();
        //                         }
        //                     )
        //                 },function(reason){
        //                     callback(reason);
        //                 }
        //             )
        //         }
        //     )
        // }).then(
        //     function(debug_data){
        //         console.log('------------------------------------------------------------------------------------------');
        //         console.log(debug_data[0]);
        //         console.log(debug_data[1]);
        //         console.log('------------------------------------------------------------------------------------------');
        //         is_subtract_date = true;
        //     }
        // )         

        // browser.wait(function(){
        //     return is_subtract_date;
        // }).then(
        //     function(){
        //         var date = new Date();
        //         expect(date.toString()).toEqual('xxx');
        //     }
        // )
    })
});
