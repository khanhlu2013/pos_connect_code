define
(
    [
         'lib/test_lib/before_each'
        ,'lib/test_lib/after_each'
        ,'lib/async'
        ,'app/store_product/new_store_product_inserter'
        ,'app/sale/scan/scanner'
        ,'app/sale/pending_scan/pending_scan_lst_getter'
        ,'app/sale/sale_finalizer/sale_finalizer'
        ,'app/sale/sale_finalizer/receipt_lst_getter'

    ],
    function
    (
         before_each
        ,after_each 
        ,async
        ,new_sp_inserter
        ,scanner
        ,ps_lst_getter
        ,sale_finalizer
        ,receipt_lst_getter
    )
    {
        describe("sale finalizer",function(){
            var test_db_name="test_store";var tax_rate = 9.125;
            var store_idb=null;var product_idb = null;
            var store_pdb=null;var product_pdb = null;
            var time_out = 500;
            
            beforeEach(function () {
                //INIT DB
                runs(function(){
                    var before_each_b=before_each.bind(before_each,test_db_name,tax_rate);
                    async.waterfall([before_each_b],function(error,result){
                        store_idb=result[0];
                        product_idb = result[1];
                        store_pdb=result[2];
                        product_pdb = result[3];
                    });
                });
                waitsFor(function(){return(store_idb!==null&&product_idb!==null&&store_pdb!==null&&product_pdb!=null);},"local database to setup",time_out);
            });

            afterEach(function () {
                //DELETE DB
                var success = false;
                runs(function(){
                    var after_each_b = after_each.bind(after_each,store_idb,product_idb,test_db_name);
                    async.waterfall([after_each_b],function(error,result){
                        success=result;
                        store_pdb = null;
                        product_pdb = null;
                    })
                });
                waitsFor(function(){return success === true},"test db to be destroyed",time_out);

                //FIXTURE CLEAN UP
                /*
                    fixture clean up code
                */
            });

            it("can record sale and clear pending scan object store",function(){
                //INSERT FIXTURE---------------------------------------------------------
                var fixture_inserted = false;
                var name_1 = 'Jack Regular';
                var price_1 = 9.99;
                var crv_1 = 1.3;
                var is_taxable_1 = true;
                var sku_str_1 = '111';

                var name_2 = 'Jack Honney';
                var price_2 = 9.99;
                var crv_2 = 1.3;
                var is_taxable_2 = true;
                var sku_str_2 = '222';

                var collected_amount = 100;

                runs(function () {
                    var insert_sp_1_b = new_sp_inserter.bind(new_sp_inserter,name_1,price_1.toString(),crv_1.toString(),is_taxable_1,sku_str_1,store_pdb);
                    var insert_sp_2_b = new_sp_inserter.bind(new_sp_inserter,name_2,price_2.toString(),crv_2.toString(),is_taxable_2,sku_str_2,store_pdb);
                    async.series([insert_sp_1_b,insert_sp_2_b],function(error,result){
                        fixture_inserted = (error == null);
                    });
                });
                waitsFor(
                    function(){return (fixture_inserted === true);}
                    ,"fixture to be inserted"
                    ,time_out);


                //-PERFORM ACTION--------------------------------------------------------
                var ps_lst = null;
                var receipt_lst = null;
                runs(function () {
                    //scan 2 product 1
                    var scan_qty_1 = 2;
                    var scan_str_1 = scan_qty_1 + ' ' + sku_str_1;

                    //scan 1 product 2
                    var scan_qty_2 = 1;
                    var scan_str_2 = scan_qty_2 + ' ' + sku_str_2;

                    //scan 3 product 1
                    var scan_qty_3 = 3;
                    var scan_str_3 = scan_qty_3 + ' ' + sku_str_1;
                    
                    //execute and check result
                    var scanner_1_b = scanner.exe.bind(scanner.exe,scan_str_1,store_idb,product_idb);
                    var scanner_2_b = scanner.exe.bind(scanner.exe,scan_str_2,store_idb,product_idb);
                    var scanner_3_b = scanner.exe.bind(scanner.exe,scan_str_3,store_idb,product_idb);

                    var sale_finalizer_b = sale_finalizer.bind(sale_finalizer,store_pdb,store_idb,collected_amount);    

                    async.waterfall(
                    [
                         scanner_1_b
                        ,scanner_2_b
                        ,scanner_3_b
                        ,sale_finalizer_b
                    ]
                    ,function(error,result){
                        var ps_lst_getter_b = ps_lst_getter.bind(ps_lst_getter,store_idb);
                        async.waterfall([ps_lst_getter_b],function(error,result){
                            ps_lst = result;
                            var receipt_lst_getter_b = receipt_lst_getter.bind(receipt_lst_getter,store_idb);
                            async.waterfall([receipt_lst_getter_b],function(error,result){
                                receipt_lst = result;
                            });
                        });
                    });
                });

                waitsFor(function() {
                    return (ps_lst !== null , receipt_lst !== null);
                }, "finalizing sale", time_out);

                //-TEST RESULT--------------------------------------------------------
                runs(function () {
                    expect(ps_lst).not.toBe(null);
                    expect(ps_lst.length).toBe(0);
                    expect(receipt_lst).not.toBe(null);
                    expect(receipt_lst.length).toBe(1);
                    var receipt = receipt_lst[0];
                    expect(receipt.collected_amount).toBe(collected_amount);
                });
            });
        });
    }
);