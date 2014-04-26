define(
[
    'lib/test_lib/before_each'
    ,'lib/test_lib/after_each'
    ,'lib/async'
    ,'lib/test_lib/sp_fixture_inserter'
    ,'lib/test_lib/scan_helper'
    ,'app/sale/displaying_scan/displaying_scan_computer'
    ,'app/sale/pending_scan/pending_scan_lst_getter'
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
)
{
    describe('displaying scan computer',function(){
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

        it('can compute mix match deal',function(done){
            
            //SP FIXTURE
            var pid = 1;
            var name = 'product name';
            var price = 3;
            var crv = 1;
            var is_taxable = true;
            var is_sale_report = false;
            var p_type = 'type'
            var p_tag = 'tag'
            var sku_str = '111';

            var fixture_inserter_b = sp_fixture_inserter.bind(sp_fixture_inserter
                ,pid
                ,name
                ,price
                ,crv
                ,is_taxable
                ,is_sale_report
                ,p_type
                ,p_tag
                ,sku_str
                ,store_pdb
            );            

            //SCAN
            var ln_1_scan_qty = 5;
            var ln_1_sku_str = sku_str;
            var ln_1_scan_str = ln_1_scan_qty + ' ' + ln_1_sku_str;

            var scan_str_lst = [ln_1_scan_str]
            var scan_helper_b = scan_helper.bind(scan_helper,scan_str_lst,store_idb);

            //MIX MATCH FIXTURE
            var sp ={
                 crv:crv
                ,is_sale_report:true
                ,is_taxable:true
                ,name:name
                ,p_type:p_type
                ,p_tag:p_tag
                ,price:price
                ,product_id:pid
                ,store_id:1
            }

            var mix_match = {
                 id:1
                ,name:'3 for $5'
                ,qty:3
                ,unit_discount:0.5
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
                        var ds_computer_b = ds_computer.bind(ds_computer,mm_lst,store_idb,ps_lst)
                        async.waterfall([ds_computer_b],function(error,result){
                            ds_lst = result;
                            expect(ds_lst.length==2);
                            done();
                        });
                    })
                }
            );
        })
    });
});