define
(
    [
         'lib/test_lib/before_each'
        ,'lib/test_lib/after_each' 
        ,'lib/async'
        ,'app/approve_product/approve_product_inserter_for_test_purpose'
        ,'app/store_product/old_store_product_inserter'
        ,'app/store_product/store_product_getter'
    ],
    function
    (
         before_each
        ,after_each 
        ,async
        ,approve_product_inserter
        ,old_sp_inserter
        ,sp_getter
    )
    {
        describe("old store product inserter ",function(){
            //DB SETUP
            var test_db_name="test_store";var tax_rate = 9.125;
            var store_idb=null;var product_idb = null;
            var store_pdb=null;var product_pdb = null;
            var time_out = 500;
            
            //FIXTURE SETUP
            var fixture_is_setup = false;
            var approve_product_id = 1;
            var product_name = 'product name';
            var approve_sku_str_1 = '1234'
            var approve_sku_str_2 = '2345'
            var approve_sku_lst = new Array();
            approve_sku_lst.push(approve_sku_str_1);
            approve_sku_lst.push(approve_sku_str_2);


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

                //SETUP FIXTURE
                runs(function(){
                    var approve_product_inserter_b = approve_product_inserter.bind(approve_product_inserter
                        ,approve_product_id
                        ,product_name
                        ,approve_sku_lst
                        ,product_pdb
                    );
                    async.waterfall([approve_product_inserter_b],function(error,result){
                        fixture_is_setup = (result == null);
                    })
                });

                waitsFor(function(){return(fixture_is_setup);},"local database to setup",time_out);
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

                //RESET FIXTURE SETUP
                fixture_is_setup = false;
            });


            //-TEST START HERE -------------------------------------------------------------------------
            //-----------------------------------------------------------------------------------------

            it('can insert product', function () {
                //SETUP TEST
                var test_is_setup = false;
                var name = 'my product name'
                var price = 1;
                var crv = 1;
                var is_taxable = true;
                var assoc_sku_str = approve_sku_str_1

                runs(function(){
                    var old_sp_inserter_b = old_sp_inserter.exe.bind(
                         old_sp_inserter.exe
                        ,approve_product_id
                        ,name
                        ,price.toString()
                        ,crv.toString()
                        ,is_taxable
                        ,assoc_sku_str
                        ,store_idb
                        ,store_pdb
                        ,product_idb
                    );

                    async.waterfall([old_sp_inserter_b],function(error,result){
                        if(error){
                            alert('error should not be display2: ' + error);
                        }
                        test_is_setup = (error == null);
                    })
                });
                waitsFor(function(){return test_is_setup},"test to be setup",time_out);

                //GET TEST RESULT
                var store_product_result = null;
                runs(function(){
                    var search_b = sp_getter.by_product_id.bind(
                         sp_getter.by_product_id
                        ,approve_product_id
                        ,store_idb
                    );
                    async.waterfall([search_b],function(error,result){
                        if(error){
                            alert('error should not be display3: ' + error);
                        }else{
                            store_product_result = result;
                        }
                    });
                });
                waitsFor(function(){return store_product_result!=null},"test result to be retrieved",time_out);

                //ASSERT RESULT
                runs(function () {
                    expect(store_product_result.name).toBe(name);
                    expect(store_product_result.price).toBe(price);
                    expect(store_product_result.crv).toBe(crv);
                    expect(store_product_result.is_taxable).toBe(is_taxable);
                    expect(store_product_result.sku_lst.length).toBe(2);
                    expect(store_product_result.sku_lst.indexOf(approve_sku_str_1) != -1).toBe(true);
                    expect(store_product_result.sku_lst.indexOf(approve_sku_str_2) != -1).toBe(true);
                    expect(store_product_result.create_offline).toBe(true);                    
                    expect(store_product_result.create_offline_by_sku).toBe(assoc_sku_str);
                });
            });


            it('can detect pid not found in approve list', function () {
                //SETUP TEST
                var expected_error = null;
                var dummy_approve_pid = 2;
                var name = 'my product name'
                var price = 1;
                var crv = 1;
                var is_taxable = true;
                var assoc_sku_str = approve_sku_str_1

                runs(function(){
                    var old_sp_inserter_b = old_sp_inserter.exe.bind(
                         old_sp_inserter.exe
                        ,dummy_approve_pid
                        ,name
                        ,price.toString()
                        ,crv.toString()
                        ,is_taxable
                        ,assoc_sku_str
                        ,store_idb
                        ,store_pdb
                        ,product_idb
                    );

                    async.waterfall([old_sp_inserter_b],function(error,result){
                        expected_error = error;
                    })
                });
                waitsFor(function(){return expected_error!=null},"test to be setup",time_out);

                //ASSERT RESULT
                runs(function () {
                    expect(expected_error).toBe(old_sp_inserter.ERROR_APPROVE_PRODUCT_ID_NOT_EXIST);
                });
            });


            it('can detect pid is already exist in store_product list', function () {
                //SETUP TEST
                var test_is_setup = false;
                var name = 'my product name'
                var price = 1;
                var crv = 1;
                var is_taxable = true;
                var assoc_sku_str = approve_sku_str_1

                runs(function(){
                    var old_sp_inserter_b = old_sp_inserter.exe.bind(
                         old_sp_inserter.exe
                        ,approve_product_id
                        ,name
                        ,price.toString()
                        ,crv.toString()
                        ,is_taxable
                        ,assoc_sku_str
                        ,store_idb
                        ,store_pdb
                        ,product_idb
                    );

                    async.waterfall([old_sp_inserter_b],function(error,result){
                        if(error){
                            alert('error should not be display1: ' + error);
                        }
                        test_is_setup = (error == null);
                    })
                });
                waitsFor(function(){return test_is_setup},"test to be setup",time_out);

                //CONTINUE TEST SETUP
                var expected_error = null;
                runs(function(){
                    var old_sp_inserter_b = old_sp_inserter.exe.bind(
                         old_sp_inserter.exe
                        ,approve_product_id
                        ,name
                        ,price.toString()
                        ,crv.toString()
                        ,is_taxable
                        ,assoc_sku_str
                        ,store_idb
                        ,store_pdb
                        ,product_idb
                    );

                    async.waterfall([old_sp_inserter_b],function(error,result){
                        expected_error = error;
                    })
                });
                waitsFor(function(){return expected_error!=null},"test to be setup",time_out);

                //ASSERT RESULT
                runs(function () {
                    expect(expected_error).toBe(old_sp_inserter.ERROR_STORE_PRODUCT_ID_EXIST);
                });
            });


            it('can detect assoc sku str is not correct', function () {
                //SETUP TEST
                var expected_error = null;
                var dummy_approve_pid = 2;
                var name = 'my product name'
                var price = 1;
                var crv = 1;
                var is_taxable = true;
                var dummy_sku_str = '9999'
                var assoc_sku_str = dummy_sku_str

                runs(function(){
                    var old_sp_inserter_b = old_sp_inserter.exe.bind(
                         old_sp_inserter.exe
                        ,approve_product_id
                        ,name
                        ,price.toString()
                        ,crv.toString()
                        ,is_taxable
                        ,dummy_sku_str
                        ,store_idb 
                        ,store_pdb
                        ,product_idb
                    );

                    async.waterfall([old_sp_inserter_b],function(error,result){
                        expected_error = error;
                    })
                });
                waitsFor(function(){return expected_error!=null},"test to be setup",time_out);

                //ASSERT RESULT
                runs(function () {
                    expect(expected_error).toBe(old_sp_inserter.ERROR_ASSOC_SKU_STR_IS_NOT_CORRECT);
                });
            });
        });
    }
);