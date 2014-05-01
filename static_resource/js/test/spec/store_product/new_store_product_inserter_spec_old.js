define
(
    [
         'lib/test_lib/before_each'
        ,'lib/test_lib/after_each' 
        ,'lib/async'
        ,'app/store_product/new_store_product_inserter'
        ,'app/store_product/store_product_getter'
    ],
    function
    (
         before_each
        ,after_each 
        ,async
        ,new_sp_inserter
        ,sp_getter
    )
    {
        describe("new store product inserter ",function(){
            //DB SETUP
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
                waitsFor(function(){return(store_idb!==null!==null&&store_pdb!==null);},"local database to setup",time_out);

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

            it('can insert new product', function () {

                //SETUP TEST
                var name = 'Product name';var price = 1;var crv = 1;var is_taxable = true;var sku = '111';
                var product_inserted = false;
                runs(function () {
                    var new_sp_inserter_b = new_sp_inserter.bind(new_sp_inserter,name,price.toString(),crv.toString(),is_taxable,sku,store_pdb);
                    
                    async.series([new_sp_inserter_b],function(error,result){
                        product_inserted = (error == null);
                    });
                });
                waitsFor(function(){return (product_inserted === true);},"product to be inserted",time_out);

                //GET DATA
                var store_product_lst = null;
                runs(function () {
                    var search_nb = sp_getter.search_by_sku;
                    var search_b = search_nb.bind(search_nb,sku,store_idb);
                                        
                    async.waterfall([search_b]
                    ,function(error,result){
                        store_product_lst = result;
                    });
                });
                waitsFor(function() {return (store_product_lst !== null);}, "product to be retrieved", time_out);
                
                //-TEST RESULT--------------------------------------------------------
                runs(function () {
                    expect(store_product_lst.length).toBe(1);
                    var store_product = store_product_lst[0];
                    
                    expect(store_product.name).toBe(name);
                    expect(store_product.price).toBe(price);
                    expect(store_product.crv).toBe(crv);
                    expect(store_product.is_taxable).toBe(is_taxable);
                    expect(store_product.sku_lst.length).toBe(1);
                    expect(store_product.sku_lst[0]).toBe(sku);
                });                               
            });
        });
    }
);