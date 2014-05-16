define(
[
     'lib/test_lib/before_each'
    ,'lib/test_lib/after_each'
    ,'lib/async'
    ,'app/group/group_inserter'
    ,'app/group/group_prompt'
    // ,'constance'
    // ,'lib/test_lib/sp_fixture_inserter'
    // ,'lib/test_lib/scan_helper'
    // ,'app/sale/sale_finalizer/sale_finalizer'
    // ,'app/receipt/receipt_lst_getter'
    // ,'app/store_product/store_product_getter'
]
,function
(
     before_each
    ,after_each
    ,async
    ,group_inserter
    ,group_prompt
    // ,constance
    // ,sp_fixture_inserter
    // ,scan_helper
    // ,sale_finalizer
    // ,receipt_lst_getter
    // ,sp_getter
)
{
    describe('group inserter',function(){
        var tax_rate = 9.125;
        var store_idb = null;
        var store_pdb = null;

        beforeEach(function (done) {
            jasmine.Ajax.install();
            var before_each_b = before_each.bind(before_each,tax_rate);
            async.waterfall([before_each_b],function(error,result){
                store_idb = result.store_idb;
                store_pdb = result.store_pdb;
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

        it('can insert group',function(done){
            spyOn(group_prompt,'exe').and.callFake(function(name ,group_sp_lst ,callback){
                
                var sp_lst = [{product_id:1}];
                var result = {
                     name             : 'Marboro group'
                    ,group_sp_lst     : sp_lst
                }                
                calback(null,result);
            });

            async.waterfall([group_inserter],function(error,result){
                
            });
            
            // var store_id = constance.TEST_STORE_ID;
            // var couch_server_url = null;// this param is needed to sync receipt to server. we will spy and call fake sync method
            // var receipt_pusher_b = receipt_pusher.exe.bind(receipt_pusher.exe,store_idb,store_pdb,store_id,couch_server_url)


            // async.series(
            //     [
            //          new_sp_fixture_inserter_b
            //         ,old_sp_fixture_inserter_b
            //         ,scan_helper_b
            //         ,sale_finalizer_b
            //         ,receipt_pusher_b
            //     ],function(error,result){

            //         expect(error).toBe(null);

            //         var receipt_lst_getter_b = receipt_lst_getter.bind(receipt_lst_getter,store_idb);
            //         var new_sp_lst_getter_b = sp_getter.by_product_id_is_null.bind(sp_getter.by_product_id_is_null,store_idb);
            //         async.series([receipt_lst_getter_b,new_sp_lst_getter_b],function(error,results){
            //             var receipt_lst = results[0];
            //             var new_sp_lst = results[1];

            //             expect(receipt_lst.length==0);
            //             expect(new_sp_lst.length==0);
            //             done();
            //         });
            //     }
            // );
        })
    });
});