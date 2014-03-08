define
(
    [
         'lib/test_lib/before_each'
        ,'lib/test_lib/after_each'
        ,'lib/async'
        ,'app/sale/displaying_scan/displaying_scan_lst_getter'
        ,'app/sale/discounter/alone_discounter'

    ],
    function
    (
         before_each
        ,after_each 
        ,async
        ,ds_lst_getter
        ,alone_discounter

    )
    {
        describe("displaying scan computer",function(){
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



            it("can compute non product pending scan",function(){
                //-INSERT DISCOUNT
                var ds_lst = null;
                runs(function () {
                    var discount_input_str = '20';
                    var alone_discounter_b = alone_discounter.bind(alone_discounter,store_idb,discount_input_str);
                    var ds_lst_getter_b = ds_lst_getter.bind(ds_lst_getter,store_idb);
                    async.waterfall([alone_discounter_b,ds_lst_getter_b],function(error,result){
                        ds_lst = result;
                    })
                });
                waitsFor(function() {
                    return (ds_lst != null);
                }, "discount to be inserted", time_out);

                //-TEST RESULT--------------------------------------------------------
                runs(function () {
                    expect(ds_lst.length).toBe(1);
                    expect(ds_lst[0].get_name()).toBe("discount");
                });
            });
        });
    }
);