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
        describe("ds modifier's compressor (when update discount) ",function(){
            //INIT DB
            var test_db_name="test_store";var tax_rate = 9.125;
            var store_idb=null;
            var store_pdb=null;
            var time_out = 500;
            
            //INIT FIXTURE
            var setup_ps_lst = null;
            var top_index = 0;var sandwich_index = 1;var bottom_index = 2;
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
                    
                    async.series([new_sp_inserter_b],function(error,result){
                        fixture_inserted = (error == null);
                    });
                });
                waitsFor(function(){return (fixture_inserted === true);},"fixture to be inserted",time_out);

                //SETUP TEST
                runs(function () {
                    var top_price = 1;var sandwich_price = 2;var bottom_price = 3;
                    
                    var instruction_1 = new Instruction(false/*not_delete*/,1/*new_qty*/,price/*new_price*/,1/*new_discount*/);
                    var instruction_2 = new Instruction(false/*not_delete*/,1/*new_qty*/,price/*new_price*/,2/*new_discount*/);
                    var instruction_3 = new Instruction(false/*not_delete*/,1/*new_qty*/,price/*new_price*/,3/*new_discount*/);

                    var ds_modifier_1_b = ds_modifier.bind(ds_modifier,store_idb,top_index,instruction_1);
                    var ds_modifier_2_b = ds_modifier.bind(ds_modifier,store_idb,sandwich_index,instruction_2);
                    var ds_modifier_3_b = ds_modifier.bind(ds_modifier,store_idb,bottom_index,instruction_3);
                    
                    var scanner_b = scanner.exe.bind(scanner.exe,sku,store_idb);
                    var ps_lst_getter_b = ps_lst_getter.bind(ps_lst_getter,store_idb);

                    async.waterfall(
                    [
                         scanner_b,ds_modifier_1_b
                        ,scanner_b,ds_modifier_2_b
                        ,scanner_b,ds_modifier_3_b

                        ,ps_lst_getter_b
                    ]
                    ,function(error,result){
                        setup_ps_lst = result;
                    });
                });

                waitsFor(function(){return (setup_ps_lst !== null);},"test to be setup",time_out);
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

                //FIXTURE CLEAN UP
                setup_ps_lst = null;
            });


            //-TEST START HERE -------------------------------------------------------------------------
            //-----------------------------------------------------------------------------------------

            it('can update TOP and NOT compressed', function () {
                var final_ps_lst = null;
                runs(function () {
                    var modifiying_index = top_index;
                    var new_discount = 4;//NOT compressed

                    var ps_lst_getter_b = ps_lst_getter.bind(ps_lst_getter,store_idb);
                    var instruction = new Instruction(false/*not_delete*/,1/*new_qty*/,price,new_discount);
                    var ds_modifier_b = ds_modifier.bind(ds_modifier,store_idb,modifiying_index,instruction);

                    async.waterfall(
                    [
                         ds_modifier_b
                        ,ps_lst_getter_b
                    ]
                    ,function(error,result){final_ps_lst = result;});
                });

                waitsFor(function() {return (final_ps_lst !== null);}, "modification", time_out);

                //-TEST RESULT--------------------------------------------------------
                runs(function () {
                    expect(final_ps_lst).not.toBe(null);
                    expect(final_ps_lst.length).toBe(3);//NOT compressed
                });                               
            });


            it('can update TOP and DO compressed', function () {
                var final_ps_lst = null;
                runs(function () {
                    var modifiying_index = top_index;
                    var new_discount = 2;//DO compressed

                    var ps_lst_getter_b = ps_lst_getter.bind(ps_lst_getter,store_idb);
                    var instruction = new Instruction(false/*not_delete*/,1/*new_qty*/,price,new_discount);
                    var ds_modifier_b = ds_modifier.bind(ds_modifier,store_idb,modifiying_index,instruction);

                    async.waterfall(
                    [
                         ds_modifier_b
                        ,ps_lst_getter_b
                    ]
                    ,function(error,result){final_ps_lst = result;});
                });

                waitsFor(function() {return (final_ps_lst !== null);}, "modification", time_out);

                //-TEST RESULT--------------------------------------------------------
                runs(function () {
                    expect(final_ps_lst).not.toBe(null);
                    expect(final_ps_lst.length).toBe(2);//DO compressed
                });                               
            });


            it('can update BOTTOM and NOT compressed', function () {
                var final_ps_lst = null;
                runs(function () {
                    var modifiying_index = bottom_index;
                    var new_discount = 4;//NOT compressed

                    
                    var ps_lst_getter_b = ps_lst_getter.bind(ps_lst_getter,store_idb);
                    var instruction = new Instruction(false/*not_delete*/,1/*new_qty*/,price,new_discount);
                    var ds_modifier_b = ds_modifier.bind(ds_modifier,store_idb,modifiying_index,instruction);

                    async.waterfall(
                    [
                         
                         ds_modifier_b
                        ,ps_lst_getter_b
                    ]
                    ,function(error,result){final_ps_lst = result;});
                });

                waitsFor(function() {return (final_ps_lst !== null);}, "modification", time_out);

                //-TEST RESULT--------------------------------------------------------
                runs(function () {
                    expect(final_ps_lst).not.toBe(null);
                    expect(final_ps_lst.length).toBe(3);//NOT compressed
                });                               
            });


            it('can update BOTTOM and DO compressed', function () {
                var final_ps_lst = null;
                runs(function () {
                    var modifiying_index = bottom_index;
                    var new_discount = 2;//DO compressed

                    
                    var ps_lst_getter_b = ps_lst_getter.bind(ps_lst_getter,store_idb);
                    var instruction = new Instruction(false/*not_delete*/,1/*new_qty*/,price,new_discount);
                    var ds_modifier_b = ds_modifier.bind(ds_modifier,store_idb,modifiying_index,instruction);

                    async.waterfall(
                    [
                         
                         ds_modifier_b
                        ,ps_lst_getter_b
                    ]
                    ,function(error,result){final_ps_lst = result;});
                });

                waitsFor(function() {return (final_ps_lst !== null);}, "modification", time_out);

                //-TEST RESULT--------------------------------------------------------
                runs(function () {
                    expect(final_ps_lst).not.toBe(null);
                    expect(final_ps_lst.length).toBe(2);//DO compressed
                });                               
            });


            it('can update SANDWICH and NOT compressed', function () {
                var final_ps_lst = null;
                runs(function () {
                    var modifiying_index = sandwich_index;
                    var new_discount = 4;//NOT compressed

                    
                    var ps_lst_getter_b = ps_lst_getter.bind(ps_lst_getter,store_idb);
                    var instruction = new Instruction(false/*not_delete*/,1/*new_qty*/,price,new_discount);
                    var ds_modifier_b = ds_modifier.bind(ds_modifier,store_idb,modifiying_index,instruction);

                    async.waterfall(
                    [
                         
                         ds_modifier_b
                        ,ps_lst_getter_b
                    ]
                    ,function(error,result){final_ps_lst = result;});
                });

                waitsFor(function() {return (final_ps_lst !== null);}, "modification", time_out);

                //-TEST RESULT--------------------------------------------------------
                runs(function () {
                    expect(final_ps_lst).not.toBe(null);
                    expect(final_ps_lst.length).toBe(3);//NOT compressed
                });                               
            });


            it('can update SANDWICH and DO compressed ONLY TOP', function () {
                var final_ps_lst = null;
                runs(function () {
                    var modifiying_index = sandwich_index;
                    var new_discount = 1;//DO compressed ONLY TOP

                    
                    var ps_lst_getter_b = ps_lst_getter.bind(ps_lst_getter,store_idb);
                    var instruction = new Instruction(false/*not_delete*/,1/*new_qty*/,price,new_discount);
                    var ds_modifier_b = ds_modifier.bind(ds_modifier,store_idb,modifiying_index,instruction);

                    async.waterfall(
                    [
                         
                         ds_modifier_b
                        ,ps_lst_getter_b
                    ]
                    ,function(error,result){final_ps_lst = result;});
                });

                waitsFor(function() {return (final_ps_lst !== null);}, "modification", time_out);

                //-TEST RESULT--------------------------------------------------------
                runs(function () {
                    expect(final_ps_lst).not.toBe(null);
                    expect(final_ps_lst.length).toBe(2);//DO compressed ONLY TOP
                    expect(final_ps_lst[0].qty).toBe(2);//DO compressed ONLY TOP
                    expect(final_ps_lst[1].qty).toBe(1)//DO compressed ONLY TOP
                });                               
            });


            it('can update SANDWICH and DO compressed ONLY BOTTOM', function () {
                var final_ps_lst = null;
                runs(function () {
                    var modifiying_index = sandwich_index;
                    var new_discount = 3;//DO compressed ONLY BOTTOM

                    
                    var ps_lst_getter_b = ps_lst_getter.bind(ps_lst_getter,store_idb);
                    var instruction = new Instruction(false/*not_delete*/,1/*new_qty*/,price,new_discount);
                    var ds_modifier_b = ds_modifier.bind(ds_modifier,store_idb,modifiying_index,instruction);

                    async.waterfall(
                    [
                         
                         ds_modifier_b
                        ,ps_lst_getter_b
                    ]
                    ,function(error,result){final_ps_lst = result;});
                });

                waitsFor(function() {return (final_ps_lst !== null);}, "modification", time_out);

                //-TEST RESULT--------------------------------------------------------
                runs(function () {
                    expect(final_ps_lst).not.toBe(null);
                    expect(final_ps_lst.length).toBe(2);//DO compressed ONLY BOTTOM
                    expect(final_ps_lst[0].qty).toBe(1);//DO compressed ONLY BOTTOM
                    expect(final_ps_lst[1].qty).toBe(2)//DO compressed ONLY BOTTOM
                });                               
            });


            it('can update SANDWICH and DO compressed BOTH', function () {
                var final_ps_lst = null;
                runs(function () {
                    var modifiying_index = sandwich_index;
                    var new_discount = 1;//DO compressed BOTH

                    //this is a special case we need to make top and bottom item the same price for sandwich item to combine both

                    var test_setup_botom_discount = 1;
                    var test_setup_instruction = new Instruction(false/*not_delete*/,1/*new_qty*/,price,test_setup_botom_discount);
                    var test_setup_modify_index = 2;
                    var test_setup_ds_modifier = ds_modifier.bind(ds_modifier,store_idb,test_setup_modify_index,test_setup_instruction);

                    var ps_lst_getter_b = ps_lst_getter.bind(ps_lst_getter,store_idb);
                    var instruction = new Instruction(false/*not_delete*/,1/*new_qty*/,price,new_discount);
                    var ds_modifier_b = ds_modifier.bind(ds_modifier,store_idb,modifiying_index,instruction);

                    async.waterfall(
                    [
                         test_setup_ds_modifier
                        ,ds_modifier_b
                        ,ps_lst_getter_b
                    ]
                    ,function(error,result){final_ps_lst = result;});
                });

                waitsFor(function() {return (final_ps_lst !== null);}, "modification", time_out);

                //-TEST RESULT--------------------------------------------------------
                runs(function () {
                    expect(final_ps_lst).not.toBe(null);
                    expect(final_ps_lst.length).toBe(1);//DO compressed BOTH
                });
            });

        });
    }
);