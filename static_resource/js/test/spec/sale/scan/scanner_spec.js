define
(
    [
         'lib/test_lib/before_each'
        ,'lib/test_lib/after_each'
        ,'lib/async'
        ,'app/store_product/new_store_product_inserter'
        ,'app/sale/scan/scanner'
        ,'app/sale/pending_scan/pending_scan_lst_getter'
    ],
    function
    (
         before_each
        ,after_each 
        ,async
        ,new_sp_inserter
        ,scanner
        ,ps_lst_getter
    )
    {
        describe("scanner",function(){
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
                        store_pdb=result[1];
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

            
            it("can scan an item",function(){
                //INSERT FIXTURE---------------------------------------------------------
                var fixture_inserted = false;
                var name = 'Jack Honney';
                var price = 9.99;
                var crv = 1.3;
                var is_taxable = true;
                var sku_str = '111';

                runs(function () {
                    var new_sp_inserter_b = new_sp_inserter.bind(new_sp_inserter,name,price.toString(),crv.toString(),is_taxable,sku_str,store_pdb)
                    async.series([new_sp_inserter_b],function(error,result){
                        fixture_inserted = (error == null);
                    });
                });
                waitsFor(
                    function(){return (fixture_inserted === true);}
                    ,"fixture to be inserted"
                    ,time_out);


                //-PERFORM ACTION--------------------------------------------------------
                var ps_lst = null;
                runs(function () {
                    //scan two product
                    var scan_qty = 2;
                    var scan_str = scan_qty + ' ' + sku_str;

                    //execute 
                    var scanner_b = scanner.exe.bind(scanner.exe,scan_str,store_idb);
                    var ps_lst_getter_b = ps_lst_getter.bind(ps_lst_getter,store_idb);
                    async.waterfall([scanner_b,ps_lst_getter_b],function(error,result){
                        if(error){
                            alert(error);
                        }else{
                            ps_lst = result;
                        }
                    });
                });
                waitsFor(function() {
                    return (ps_lst !== null);
                }, "action to be performed", time_out);

                //-TEST RESULT--------------------------------------------------------
                runs(function () {
                    expect(ps_lst).not.toBe(null);
                    expect(ps_lst.length).toBe(1);
                    var ps = ps_lst[0];
                    expect(ps.qty).toBe(2);
                    expect(ps.sp_doc_id != null || ps.non_product_name != null).toBe(true);
                });
            });


            it("can compress similar subsequence scan",function(){
                //INSERT FIXTURE---------------------------------------------------------
                var fixture_inserted = false;
                var name = 'Jack Honney';
                var price = 9.99;
                var crv = 1.3;
                var is_taxable = true;
                var sku_str = '111';
                
                var qty_1 = 2;
                var scan_str_1 = qty_1 + ' ' + sku_str;
                var qty_2 = 5;
                var scan_str_2 = qty_2 + ' ' + sku_str;

                runs(function () {
                    var new_sp_inserter_b = new_sp_inserter.bind(new_sp_inserter,name,price.toString(),crv.toString(),is_taxable,sku_str,store_pdb)
                    async.series([new_sp_inserter_b],function(error,result){
                        fixture_inserted = (error == null);
                    });
                });
                waitsFor(function(){return (fixture_inserted === true);} ,"fixture to be inserted",time_out);


                //-PERFORM ACTION--------------------------------------------------------
                var ps_lst = null;
                runs(function () {
                    
                    //execute 
                    var scanner_b_1 = scanner.exe.bind(scanner.exe,scan_str_1,store_idb);
                    var scanner_b_2 = scanner.exe.bind(scanner.exe,scan_str_2,store_idb);
                    var ps_lst_getter_b = ps_lst_getter.bind(ps_lst_getter,store_idb);
                    async.waterfall([scanner_b_1,scanner_b_2,ps_lst_getter_b],function(error,result){
                        ps_lst = result;
                    });
                });
                waitsFor(function() {
                    return (ps_lst !== null);
                }, "action to be performed", time_out);

                //-TEST RESULT--------------------------------------------------------
                runs(function () {
                    expect(ps_lst).not.toBe(null);
                    expect(ps_lst.length).toBe(1);//2 scan but got combined into 1 line
                    expect(ps_lst[0].qty).toBe(qty_1+qty_2);
                    
                });
            });


            it("can return error: sp not found",function(){
                
                //SETUP TEST: SCAN DUMMY STRING
                var expected_error = null;
                runs(function(){
                    var dummy_scan_str = '111';
                    var scanner_b = scanner.exe.bind(scanner.exe,dummy_scan_str,store_idb);
                    async.waterfall([scanner_b],function(error,result){
                        expected_error = error;
                        
                    });
                });
                waitsFor(function(){return expected_error != null},"setup test: scan a dummy string",time_out);


                //-ASSERT RESULT--------------------------------------------------------
                runs(function () {
                    expect(expected_error).toBe(scanner.ERROR_STORE_PRODUCT_NOT_FOUND);
                });
            });
        });
    }
);