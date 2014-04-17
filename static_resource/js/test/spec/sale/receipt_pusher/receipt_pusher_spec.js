define
(
    [
         'lib/test_lib/before_each'
        ,'lib/test_lib/after_each'
        ,'lib/async'
        ,'app/store_product/new_store_product_inserter'
        ,'app/sale/scan/scanner'
        ,'app/receipt/receipt_pusher'
        ,'app/sale/sale_finalizer/sale_finalizer'
        ,'app/receipt/receipt_lst_getter'
        ,'app/store_product/store_product_getter'
    ],
    function
    (
         before_each
        ,after_each 
        ,async
        ,new_sp_inserter
        ,scanner
        ,receipt_pusher
        ,sale_finalizer
        ,receipt_lst_getter
        ,sp_getter
    )
    {
        describe("receipt pusher",function(){
            var test_db_name="test_store";var tax_rate = 9.125;
            var store_idb=null;
            var store_pdb=null;
            var time_out = 500;
            
            beforeEach(function () {
                //INIT DB
                runs(function(){
                    var before_each_b=before_each.bind(before_each,test_db_name,tax_rate);
                    async.waterfall([before_each_b],function(error,result){
                        store_idb=result[0];
                        store_pdb=result[2];
                    });
                });
                waitsFor(function(){return(store_idb!==null&&store_pdb!==null);},"local database to setup",time_out);
            });

            afterEach(function () {
                //DELETE DB
                var success = false;
                runs(function(){
                    var after_each_b = after_each.bind(after_each,store_idb,test_db_name);
                    async.waterfall([after_each_b],function(error,result){
                        success=result;
                        store_pdb = null;
                    })
                });
                waitsFor(function(){return success === true},"test db to be destroyed",time_out);
            });

            it("can push receipt online",function(){
                //-INSERT FIXTURE
                var fixture_inserted = false;
                var name_1 = 'Jack Regular';
                var price_1 = 9.99;
                var crv_1 = 1.3;
                var is_taxable_1 = true;
                var sku_str_1 = '987';     

                runs(function () {
                    var insert_sp_1_b = new_sp_inserter.bind(new_sp_inserter,name_1,price_1.toString(),crv_1.toString(),is_taxable_1,sku_str_1,store_pdb);
                    
                    async.series([insert_sp_1_b],function(error,result){
                        fixture_inserted = (error == null);
                    });
                });
                waitsFor(function(){return (fixture_inserted === true);} ,"fixture to be inserted",time_out);

                //-TEST SETUP: FINALIZE SALE, CREATE RECEIPT
                var receipt_lst = null;
                runs(function () {
                    //scan 2 product 1
                    var scan_qty_1 = 2;
                    var scan_str_1 = scan_qty_1 + ' ' + sku_str_1;
                    var collect_amount = 100;
                    //execute and check result
                    var scanner_1_b = scanner.exe.bind(scanner.exe,scan_str_1,store_idb);
                    var sale_finalizer_b = sale_finalizer.bind(sale_finalizer,store_pdb,store_idb,collect_amount);    
                    var receipt_lst_getter_b = receipt_lst_getter.bind(receipt_lst_getter,store_idb);
                    async.waterfall(
                    [
                         scanner_1_b
                        ,sale_finalizer_b
                        ,receipt_lst_getter_b
                    ]
                    ,function(error,result){
                        receipt_lst = result;
                    });
                });
                waitsFor(function() {return (receipt_lst !== null); }, "test to setup: sale to finalize", time_out); 

                //-TEST SETUP: PUSH RECEIPT
                var receipt_is_push = false;
                var store_db_name = test_db_name;
                var couch_server_url = 'master_server';
                runs(function(){
                    var receipt_pusher_nb = receipt_pusher.push_receipt;
                    var receipt_pusher_b = receipt_pusher_nb.bind(receipt_pusher_nb,store_idb,store_pdb,store_db_name,couch_server_url);
                    async.waterfall([receipt_pusher_b],function(error,result){
                        receipt_is_push = (error == null);
                    })
                });
                waitsFor(function() {return (receipt_is_push); }, "test to setup: receipt is push", time_out); 
                
                //-TEST RESULT
                var final_receipt_lst = null;
                var create_offline_sp_lst = null;
                runs(function(){
                    var receipt_lst_getter_b = receipt_lst_getter.bind(receipt_lst_getter,store_idb);
                    var create_offline_sp_lst_nb = sp_getter.by_product_id;
                    var create_offline_sp_lst_b = create_offline_sp_lst_nb.bind(create_offline_sp_lst_nb,null/*create offline pid = null*/store_idb);
                    async.series([receipt_lst_getter_b,create_offline_sp_lst_b],function(error,results){
                        if(error){
                            alert(error);
                        }else{
                            final_receipt_lst = results[0];
                            create_offline_sp_lst = results[1];
                        }
                    });
                });
                waitsFor(function() {return (final_receipt_lst!=null && create_offline_sp_lst!=null); }, "test result to be retrieved", time_out); 

                //-ASSERT
                runs(function(){
                    expect(final_receipt_lst.length).toBe(0);
                    expect(create_offline_sp_lst.length).toBe(0);
                });
            });
        });
    }
);