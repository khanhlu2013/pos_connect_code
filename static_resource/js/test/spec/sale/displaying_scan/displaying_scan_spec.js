define
(
    [
         'lib/test_lib/before_each'
        ,'lib/test_lib/after_each'
        ,'lib/async'
        ,'app/store_product/new_store_product_inserter'
        ,'app/sale/scan/scanner'
        ,'app/sale/displaying_scan/displaying_scan_lst_getter'
    ],
    function
    (
         before_each
        ,after_each 
        ,async
        ,new_sp_inserter
        ,scanner
        ,ds_lst_getter
        
    )
    {
        describe("displaying scan object",function(){
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



            it("can calculate computed tax and computed due",function(){
                //INSERT FIXTURE---------------------------------------------------------
                var fixture_inserted = false;
                var name = 'Jack Honney';
                var price = 9.99;
                var crv = 1.32;
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
                    ,3000);


                //-PERFORM ACTION--------------------------------------------------------
                var ds_lst = null;
                runs(function () {
                    //scan two product
                    var scan_qty = 1;
                    var scan_str = scan_qty + ' ' + sku_str;

                    //execute
                    var scanner_b = scanner.exe.bind(scanner.exe,scan_str,store_idb,product_idb);
                    var ds_lst_getter_b = ds_lst_getter.bind(ds_lst_getter,store_idb);
                    async.waterfall(
                    [
                         scanner_b
                        ,ds_lst_getter_b
                    ]
                    ,function(error,result){
                        if(error){
                            alert(error);
                        }else{
                            ds_lst = result;
                        }
                    });
                });
                waitsFor(function() {
                    return (ds_lst !== null);
                }, "scan orchestrator to execute scan str", 3000);

                //-TEST RESULT--------------------------------------------------------
                runs(function () {
                    var price = 9.99;
                    var crv = 1.32;

                    expect(ds_lst).not.toBe(null);
                    expect(ds_lst.length).toBe(1);
                    var ds_item = ds_lst[0];
                    ds_item.discount = 1.47;
                    var tax_rate = 9.725;
                    var tax = ds_item.get_tax(tax_rate);
                    var line_total = ds_item.get_line_total(tax_rate);
                    
                    expect(tax).toBe(0.96);
                    expect(line_total).toBe(10.80);
                });
            });
        });
    }
);