define
(
    [
         'lib/test_lib/before_each'
        ,'lib/test_lib/after_each'
        ,'lib/async'
        ,'app/store_product/new_store_product_inserter'
        ,'app/sale/scan/scanner'
        ,'app/sale/displaying_scan_modifier/displaying_scan_modifier'
        ,'app/sale/displaying_scan_modifier/Instruction'
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
        ,ds_modifier
        ,Instruction
        ,ps_lst_getter
        ,alone_discounter
    )
    {
        describe("displaying scan modifier - non product",function(){
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
            });

            it("can remove",function(){
                //INSERT FIXTURE
                var name = 'Product name';var price = 0.5;var crv = 1;var is_taxable = true;var sku = '111';
                var fixture_inserted = false;
                runs(function () {
                    var new_sp_inserter_b = new_sp_inserter.bind(new_sp_inserter,name,price.toString(),crv.toString(),is_taxable,sku,store_pdb);
                    async.series([new_sp_inserter_b],function(error,result){
                        fixture_inserted = (error == null);
                    });
                });
                waitsFor(function(){return (fixture_inserted === true);},"fixture to be inserted",time_out);    

                //SETUP TEST
                var ps_lst = null;

                runs(function(){
                    var discount_input_str = '50';
                    var scan_str = sku;
                    var modifying_ds_index = 0;
                    var instruction = new Instruction(true/*delete*/,null/*new_qty*/,null/*new_price*/,null/*new_discount*/);
                    
                    var alone_discounter_b = alone_discounter.bind(alone_discounter,store_idb,discount_input_str);
                    var scanner_b = scanner.exe.bind(scanner.exe,scan_str,store_idb,product_idb);
                    var ds_modifier_b = ds_modifier.bind(ds_modifier,store_idb,modifying_ds_index,instruction);
                    var ps_lst_getter_b = ps_lst_getter.bind(ps_lst_getter,store_idb);

                    async.waterfall(
                    [
                         alone_discounter_b
                        ,scanner_b 
                        ,ds_modifier_b
                        ,ps_lst_getter_b
                    ]
                    ,function(error,result){
                        if(error){alert(error);}
                        ps_lst = result;
                    });
                });

                waitsFor(function(){
                    return ps_lst != null;
                },"test to be setup",time_out);

                //-TEST RESULT--------------------------------------------------------
                runs(function () {
                    expect(ps_lst.length).toBe(1);
                });
            });
        });
    }
);