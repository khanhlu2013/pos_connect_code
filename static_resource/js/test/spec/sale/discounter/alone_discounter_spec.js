define
(
    [
         'lib/test_lib/before_each'
        ,'lib/test_lib/after_each' 
        ,'lib/async'
        ,'app/store_product/new_store_product_inserter'
        ,'app/sale/scan/scanner'
        ,'app/sale/pending_scan/pending_scan_lst_getter'
        ,'app/sale/discounter/alone_discounter'

    ],
    function
    (
         before_each
        ,after_each 
        ,async
        ,new_sp_inserter
        ,scanner
        ,ps_lst_getter
        ,alone_discounter
    )
    {
        describe("alone discounter ",function(){
            //DB SETUP
            var test_db_name="test_store";var tax_rate = 9.125;
            var store_idb=null;
            var store_pdb=null;
            var time_out = 500;
            
            //TEST SETUP
            var name = 'Product name';var price = 1;var crv = 1;var is_taxable = true;var sku = '111';

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

                //INSERT FIXTURE
                var fixture_inserted = false;
                runs(function () {
                    
                    var new_sp_inserter_b = new_sp_inserter.bind(new_sp_inserter,name,price.toString(),crv.toString(),is_taxable,sku,store_pdb);
                    async.waterfall([new_sp_inserter_b],function(error,result){
                        fixture_inserted = (error == null);
                    });
                });
                waitsFor(function(){return (fixture_inserted === true);},"fixture to be inserted",time_out);
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


            //-TEST START HERE -------------------------------------------------------------------------
            //-----------------------------------------------------------------------------------------
            it('can insert discount', function () {
                //SETUP: FIRST SCAN
                var temp_ps_lst = null;
                runs(function () {
                    var scanner_b = scanner.exe.bind(scanner.exe,sku,store_idb);
                    var ps_lst_getter_b = ps_lst_getter.bind(ps_lst_getter,store_idb);
                    
                    async.waterfall([scanner_b ,ps_lst_getter_b]
                    ,function(error,result){
                        if(error){alert(error);}
                        temp_ps_lst = result;
                    });
                });
                waitsFor(function(){return (temp_ps_lst !== null && temp_ps_lst !== undefined);},"test to be setup",time_out);

                //SETUP: INSERT DISCOUNT
                var setup_ps_lst = null;
                runs(function () {
                    var discount_input_str = "50 % "
                    var ps_lst_getter_b = ps_lst_getter.bind(ps_lst_getter,store_idb);
                    var alone_discounter_b = alone_discounter.bind(alone_discounter,store_idb,discount_input_str);
                    async.waterfall(
                    [
                         alone_discounter_b
                        ,ps_lst_getter_b
                    ]
                    ,function(error,result){
                        if(error){alert(error);}
                        setup_ps_lst = result;
                    });
                });
                waitsFor(function() {return (setup_ps_lst !== null && setup_ps_lst !== undefined );}, "discount to be inserted", time_out);

                //-TEST RESULT--------------------------------------------------------
                runs(function () {
                    expect(setup_ps_lst).not.toBe(null);
                    expect(setup_ps_lst.length).toBe(2);
                    expect(setup_ps_lst[1].non_product_name).toBe('discount');
                    expect(setup_ps_lst[1].price).toBe(0.5);
                });                               
            });
        });
    }
);