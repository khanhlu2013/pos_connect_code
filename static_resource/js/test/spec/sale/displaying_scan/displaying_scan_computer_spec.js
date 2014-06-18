define(
[
    'lib/test_lib/before_each'
    ,'lib/test_lib/after_each'
    ,'lib/async'
    ,'lib/test_lib/sp_fixture_inserter'
    ,'lib/test_lib/scan_helper'
    ,'app/sale/displaying_scan/displaying_scan_computer'
    ,'app/sale/pending_scan/pending_scan_lst_getter'
    ,'app/sale/displaying_scan/displaying_scan_util'
]
,function
(
    before_each
    ,after_each
    ,async
    ,sp_fixture_inserter
    ,scan_helper
    ,ds_computer
    ,ps_lst_getter
    ,ds_util
)
{
    describe('displaying scan computer',function(){
        var tax_rate = 9.111;
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

        it('can compute mix match deal that include crv and tax',function(done){
            
            //SP FIXTURE
            var pid = 1;
            var product_name = 'product name'
            var sku_str = '111';
            var sp_price = 3;
            var sp_crv = 0.5;

            var fixture_inserter_b = sp_fixture_inserter.bind(sp_fixture_inserter
                ,pid
                ,product_name
                ,sp_price
                ,null//value customer price
                ,sp_crv
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
            var ln_1_scan_qty = 5;
            var ln_1_scan_str = ln_1_scan_qty + ' ' + sku_str;

            var scan_str_lst = [ln_1_scan_str]
            var scan_helper_b = scan_helper.bind(scan_helper,scan_str_lst,store_idb);

            //MIX MATCH FIXTURE
            var sp ={
                 crv:sp_crv
                ,is_sale_report:true
                ,is_taxable:true
                ,name:product_name
                ,p_type:null
                ,p_tag:null
                ,price:sp_price
                ,product_id:pid
                ,store_id:1
            }

            var mix_match = {
                 id:1
                ,name:'3 for $5'
                ,qty:3
                ,mm_price:2
                ,is_include_crv_tax:true
                ,mix_match_child_set:[{id:1,store_product:sp}] 
            }

            async.series(
                [
                     fixture_inserter_b
                    ,scan_helper_b
                ],function(error,results){
                    expect(error).toBe(null);

                    //GET PENDING SCAN
                    var ps_lst_getter_b = ps_lst_getter.bind(ps_lst_getter,store_idb);
                    async.waterfall([ps_lst_getter_b],function(error,result){
                        var mm_lst = [mix_match];
                        var ps_lst = result;
                        var ds_computer_b = ds_computer.bind(ds_computer,tax_rate,mm_lst,store_idb,ps_lst)
                        async.waterfall([ds_computer_b],function(error,result){
                            ds_lst = result;
                            expect(ds_lst.length).toBe(2);
                            expect(ds_util.get_line_total(ds_lst,tax_rate)).toBe(9.65);
                            done();
                        });
                    })
                }
            );
        });

        it('can compute mix match deal that not include crv and tax',function(done){
            
            //SP FIXTURE
            var pid = 1;
            var product_name = 'product name'
            var sku_str = '111';
            var sp_price = 3;
            var sp_crv = 0.5;

            var fixture_inserter_b = sp_fixture_inserter.bind(sp_fixture_inserter
                ,pid
                ,product_name
                ,sp_price
                ,null//value customer price
                ,sp_crv
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
            var ln_1_scan_qty = 5;
            var ln_1_scan_str = ln_1_scan_qty + ' ' + sku_str;

            var scan_str_lst = [ln_1_scan_str]
            var scan_helper_b = scan_helper.bind(scan_helper,scan_str_lst,store_idb);

            //MIX MATCH FIXTURE
            var sp ={
                 crv:sp_crv
                ,is_sale_report:true
                ,is_taxable:true
                ,name:product_name
                ,p_type:null
                ,p_tag:null
                ,price:sp_price
                ,product_id:pid
                ,store_id:1
            }

            var mix_match = {
                 id:1
                ,name:'3 for $5'
                ,qty:3
                ,mm_price:2
                ,is_include_crv_tax:false
                ,mix_match_child_set:[{id:1,store_product:sp}] 
            }

            async.series(
                [
                     fixture_inserter_b
                    ,scan_helper_b
                ],function(error,results){
                    expect(error).toBe(null);

                    //GET PENDING SCAN
                    var ps_lst_getter_b = ps_lst_getter.bind(ps_lst_getter,store_idb);
                    async.waterfall([ps_lst_getter_b],function(error,result){
                        var mm_lst = [mix_match];
                        var ps_lst = result;
                        var ds_computer_b = ds_computer.bind(ds_computer,tax_rate,mm_lst,store_idb,ps_lst)
                        async.waterfall([ds_computer_b],function(error,result){
                            ds_lst = result;
                            expect(ds_lst.length).toBe(2);
                            expect(ds_util.get_line_total(ds_lst,tax_rate)).toBe(11.48);
                            done();
                        });
                    })
                }
            );
        })
    });
});