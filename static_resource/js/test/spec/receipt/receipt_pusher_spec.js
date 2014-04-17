define(
[
     'app/receipt/receipt_pusher'
    ,'lib/test_lib/before_each'
    ,'lib/test_lib/after_each'
    ,'lib/async'
    ,'constance'
    ,'lib/test_lib/sp_fixture_inserter'
    ,'lib/test_lib/scan_helper'
    ,'app/sale/sale_finalizer/sale_finalizer'
    ,'app/receipt/receipt_lst_getter'
    ,'app/store_product/store_product_getter'
]
,function
(
     receipt_pusher
    ,before_each
    ,after_each
    ,async
    ,constance
    ,sp_fixture_inserter
    ,scan_helper
    ,sale_finalizer
    ,receipt_lst_getter
    ,sp_getter
)
{
    describe('receipt pusher',function(){
        var tax_rate = 9.125;
        var store_idb = null;
        var store_pdb = null;

        beforeEach(function (done) {
            var before_each_b = before_each.bind(before_each,tax_rate);
            async.waterfall([before_each_b],function(error,result){
                store_idb = result.store_idb;
                store_pdb = result.store_pdb;
                done();
            });
        });

        afterEach(function (done) {
            var after_each_b = after_each.bind(after_each,store_idb);
            async.waterfall([after_each_b],function(error,result){
                done();
            });
        });

        it('can push receipt',function(done){
            //INSERT NEW SP, expect this to be clean up later
            var new_sp_pid = null;
            var new_sp_name = 'new product name';
            var new_sp_price = 1;
            var new_sp_crv = 1;
            var new_sp_is_taxable = true;
            var new_sp_is_sale_report = false;
            var new_sp_p_type = 'new type'
            var new_sp_p_tag = 'new tag'
            var new_sp_sku_str = '111';

            var new_sp_fixture_inserter_b = sp_fixture_inserter.bind(sp_fixture_inserter
                ,new_sp_pid
                ,new_sp_name
                ,new_sp_price
                ,new_sp_crv
                ,new_sp_is_taxable
                ,new_sp_is_sale_report
                ,new_sp_p_type
                ,new_sp_p_tag
                ,new_sp_sku_str
                ,store_pdb
            );
            

            //INSERT OLD SP, expect this to be clean up later
            var old_sp_pid = 1;
            var old_sp_name = 'product name';
            var old_sp_price = 1;
            var old_sp_crv = 1;
            var old_sp_is_taxable = true;
            var old_sp_is_sale_report = false;
            var old_sp_p_type = 'type'
            var old_sp_p_tag = 'tag'
            var old_sp_sku_str = '222';

            var old_sp_fixture_inserter_b = sp_fixture_inserter.bind(sp_fixture_inserter
                ,old_sp_pid
                ,old_sp_name
                ,old_sp_price
                ,old_sp_crv
                ,old_sp_is_taxable
                ,old_sp_is_sale_report
                ,old_sp_p_type
                ,old_sp_p_tag
                ,old_sp_sku_str
                ,store_pdb
            );            

            //SCAN
            var ln_1_scan_qty = 1;
            var ln_1_sku_str = new_sp_sku_str;
            var ln_1_scan_str = ln_1_scan_qty + ' ' + ln_1_sku_str;

            var ln_2_scan_qty = 1;
            var ln_2_sku_str = old_sp_sku_str;
            var ln_2_scan_str = ln_2_scan_qty + ' ' + ln_2_sku_str;

            var scan_str_lst = [ln_1_scan_str,ln_2_scan_str]
            var scan_helper_b = scan_helper.bind(scan_helper,scan_str_lst,store_idb);

            //FINALIZE SALE
            var collect_amount = 100;
            var sale_finalizer_b = sale_finalizer.bind(sale_finalizer,store_pdb,store_idb,collect_amount);


            //FINAL RUN EVERYTHING
            //SPY ON SYNC RECEIPT WHEN PUSHING RECEIPT UP
            var store_id = constance.TEST_STORE_ID;
            var couch_server_url = null;// this param is needed to sync receipt to server. we will spy and call fake sync method
            var receipt_pusher_b = receipt_pusher.exe.bind(receipt_pusher.exe,store_idb,store_pdb,store_id,couch_server_url)
            spyOn(receipt_pusher,'sync_receipt').and.callFake(function(store_id,couch_server_url,callback){
                calback(null);//pretent syncing receipt correctly
            })

            async.series(
                [
                     new_sp_fixture_inserter_b
                    ,old_sp_fixture_inserter_b
                    ,scan_helper_b
                    ,sale_finalizer_b
                    ,receipt_pusher_b
                ],function(error,result){

                    expect(error).toBe(null);

                    var receipt_lst_getter_b = receipt_lst_getter.bind(receipt_lst_getter,store_idb);
                    var new_sp_lst_getter_b = sp_getter.by_product_id_is_null.bind(sp_getter.by_product_id_is_null,store_idb);
                    async.series([receipt_lst_getter_b,new_sp_lst_getter_b],function(error,results){
                        var receipt_lst = results[0];
                        var new_sp_lst = results[1];

                        expect(receipt_lst.length==0);
                        expect(new_sp_lst.length==0);
                        done();
                    });
                }
            );
        })
    });
});