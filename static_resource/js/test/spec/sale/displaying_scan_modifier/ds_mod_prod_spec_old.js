define
(
    [
         'lib/test_lib/before_each'
        ,'lib/test_lib/after_each'
        ,'lib/async'
        ,'app/store_product/new_store_product_inserter'
        ,'app/sale/scan/scanner'
        ,'app/sale/displaying_scan/displaying_scan_lst_getter'
        ,'app/sale/displaying_scan_modifier/displaying_scan_modifier'
        ,'app/sale/displaying_scan_modifier/Instruction'
        ,'app/sale/pending_scan/pending_scan_lst_getter'

    ],
    function
    (
         before_each
        ,after_each 
        ,async
        ,new_sp_inserter
        ,scanner
        ,ds_lst_getter
        ,ds_modifier
        ,Instruction
        ,ps_lst_getter
    )
    {
        describe("displaying scan modifier",function(){
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



            it("can change qty",function(){
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

                    //select the first line and change qty -> 3
                    var new_qty = 3;
                    var selected_index = 0;
                    var instruction = new Instruction(false/*is_delete*/,new_qty,price,0/*discount*/) 

                    //execute and check result
                    var scanner_b = scanner.exe.bind(scanner.exe,scan_str,store_idb);
                    var ps_lst_getter_b = ps_lst_getter.bind(ps_lst_getter,store_idb);
                    var ds_modifier_b = ds_modifier.bind(ds_modifier,store_idb,selected_index,instruction)
                    async.waterfall(
                    [
                         scanner_b
                        ,ds_modifier_b
                        ,ps_lst_getter_b
                    ]
                    ,function(error,result){
                        if(error){
                            alert(error);
                        }else{
                            ps_lst = result;
                        }
                    });
                });
                waitsFor(function() {
                    return (ps_lst !== null);
                }, "modify instruction to be performed", time_out);

                //-TEST RESULT--------------------------------------------------------
                runs(function () {
                    expect(ps_lst).not.toBe(null);
                    expect(ps_lst.length).toBe(1);
                    expect(ps_lst[0].qty).toBe(3);
                });
            });


            
            it("can remove an item and compress pending scan in the case of nessesary",function(){
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

                    //select the second line and remove item.
                    var selected_index = 1;
                    var instruction = new Instruction(true/*is_delete*/,null/*new_qty*/,null/*new_price*/,null/*new_discount*/) 

                    //execute and check result
                    var scanner_1_b = scanner.exe.bind(scanner.exe,scan_str_1,store_idb);
                    var scanner_2_b = scanner.exe.bind(scanner.exe,scan_str_2,store_idb);
                    var scanner_3_b = scanner.exe.bind(scanner.exe,scan_str_3,store_idb);

                    var ps_lst_getter_b = ps_lst_getter.bind(ps_lst_getter,store_idb);
                    var ds_modifier_b = ds_modifier.bind(ds_modifier,store_idb,selected_index,instruction);

                    async.waterfall(
                    [
                         scanner_1_b
                        ,scanner_2_b
                        ,scanner_3_b
                        ,ds_modifier_b
                        ,ps_lst_getter_b
                    ]
                    ,function(error,result){
                        if(error){
                            alert(error);
                        }else{
                            ps_lst = result;
                        }
                    });
                });
                waitsFor(function() {
                    return (ps_lst !== null);
                }, "modify instruction to be performed", time_out);

                //-TEST RESULT--------------------------------------------------------
                runs(function () {
                    expect(ps_lst).not.toBe(null);
                    expect(ps_lst.length).toBe(1);
                    expect(ps_lst[0].qty).toBe(5);//combine qty: 2+3=5
                });
            });
        });
    }
);