define(
[
	 'app/sale/displaying_scan/displaying_scan_2_ui'
	,'lib/async'
    ,'lib/test_lib/before_each'
    ,'lib/test_lib/after_each'
    ,'lib/test_lib/sp_fixture_inserter'
    ,'lib/test_lib/scan_helper'
]
,function
(
	 ds_2_ui
	,async
    ,before_each
    ,after_each
    ,sp_fixture_inserter
    ,scan_helper
)
{
	describe('displaying scan 2 ui module',function(){
        var tax_rate = 9.125;
        var store_idb = null;
        var store_pdb = null;
        var store_id = null;

        beforeEach(function (done) {
            jasmine.Ajax.install();
            var before_each_b = before_each.bind(before_each,tax_rate);
            async.waterfall([before_each_b],function(error,result){
                store_idb = result.store_idb;
                store_pdb = result.store_pdb;
                store_id = result.store_id;
                done();
            });
        });

        afterEach(function (done) {
            jasmine.Ajax.uninstall();
            var after_each_b = after_each.bind(after_each,store_idb);
            async.waterfall([after_each_b],function(error,result){
                done();
            });
        });

		it('can get and displaying scan and display them on sale table and display total amount on total button',function(done){
            
            var tbl = document.createElement('table');
            var btn = document.createElement('button');

            //INSERT SP FIXTURE
            var pid = 1;
            var product_name = 'product name'
            var sku_str = '111';
            var fixture_inserter_b = sp_fixture_inserter.bind(sp_fixture_inserter
                ,pid
                ,product_name
                ,3//price
                ,null//crv
                ,true//is_taxable
                ,true//is_sale_report
                ,null//p_type
                ,null//p_tag
                ,sku_str
                ,null//cost
                ,null//vendor
                ,null//buydown
                ,store_pdb
            );            

            //SCAN
            var scan_qty = 5;
            var scan_str = scan_qty + ' ' + sku_str;
            var scan_str_lst = [scan_str,]
            var scan_helper_b = scan_helper.bind(scan_helper,scan_str_lst,store_idb);

            //DS_2_UI
			var ds_2_ui_b = ds_2_ui.exe.bind(ds_2_ui.exe,[]/*mm_lst*/,store_idb,store_pdb,store_id,null/*couch_server_url*/,tax_rate,tbl,btn)
 			

            //EXE
            async.series([fixture_inserter_b,scan_helper_b,ds_2_ui_b],function(error,results){
                var tbl = results[2].sale_table;
                var btn = results[2].total_button;

                expect(btn.innerHTML).toBe('16.35');//i don't care what is the value but i care about a number is display on this button
                expect(tbl.rows.length).toBe(2);

 				done();
 			})
		});
	});
});