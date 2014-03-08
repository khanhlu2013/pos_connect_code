define
(
    [
         'lib/test_lib/before_each'
        ,'lib/test_lib/after_each' 
        ,'lib/async'
        ,'app/approve_product/approve_product_getter'
        ,'app/approve_product/approve_product_inserter_for_test_purpose'
        ,'app/store_product/store_product_util'
    ],
    function
    (
         before_each
        ,after_each 
        ,async
        ,ap_getter
        ,ap_inserter
        ,sp_util
    )
    {
        describe("approve product getter",function(){
            //DB SETUP
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


            //-TEST START HERE -------------------------------------------------------------------------
            //-----------------------------------------------------------------------------------------

            it('can get product by sku', function () {
                //INSERT FIXTURE: 2 approve product sharing a same sku_1
                var fixture_is_setup = false;
                var product_id_1 = 1;
                var name_1 = 'product 1';
                var sku_1 = '1'
                var sku_2 = '2'
                var approve_sku_lst_1 = new Array();
                approve_sku_lst_1.push(sku_1);
                approve_sku_lst_1.push(sku_2);

                var product_id_2 = 2;
                var name_2 = 'product 2';
                var approve_sku_lst_2 = new Array();
                approve_sku_lst_2.push(sku_1);

                runs(function(){
                    var ap_inserter_b_1 = ap_inserter.bind(ap_inserter
                        ,product_id_1
                        ,name_1
                        ,approve_sku_lst_1
                        ,product_pdb
                    );
                    var ap_inserter_b_2 = ap_inserter.bind(ap_inserter
                        ,product_id_2
                        ,name_2
                        ,approve_sku_lst_2
                        ,product_pdb
                    );                    
                    async.waterfall([ap_inserter_b_1,ap_inserter_b_2],function(error,result){
                        fixture_is_setup = (result == null);
                    })
                });
                waitsFor(function(){return(fixture_is_setup);},"insert fixture: insert 2 approve products that share a same sku",time_out);
                
                //TEST RESULT
                runs(function(){
                    var ap_getter_b = ap_getter.by_sku.bind(ap_getter.by_sku,sku_1,product_idb);
                    async.waterfall([ap_getter_b],function(error,result){
                        var ap_lst = result;
                        if(error){
                            alert(error);
                        }
                        expect(error).toBe(null);
                        expect(ap_lst).toNotBe(null);
                        expect(ap_lst.length).toBe(2);

                        var ap_1 = sp_util.get_item_based_on_product_id(product_id_1,ap_lst);
                        expect(ap_1).toNotBe(null);
                        expect(ap_1.product_id).toBe(product_id_1);
                        expect(ap_1.name).toBe(name_1);
                        expect(ap_1.sku_lst.length).toBe(2);
                        expect(ap_1.sku_lst[0]).toBe(sku_1);
                        expect(ap_1.sku_lst[1]).toBe(sku_2);
                        
                        var ap_2 = sp_util.get_item_based_on_product_id(product_id_2,ap_lst);
                        expect(ap_2).toNotBe(null);
                        expect(ap_2.product_id).toBe(product_id_2);
                        expect(ap_2.name).toBe(name_2);
                        expect(ap_2.sku_lst.length).toBe(1);
                        expect(ap_2.sku_lst[0]).toBe(sku_1);
                    });
                });

            });

            it('can get product by id', function () {
                //INSERT FIXTURE: 2 approve product sharing a same sku_1
                var fixture_is_setup = false;
                var product_id_1 = 1;
                var name_1 = 'product 1';
                var sku_1 = '1'
                var sku_2 = '2'
                var approve_sku_lst_1 = new Array();
                approve_sku_lst_1.push(sku_1);
                approve_sku_lst_1.push(sku_2);

                runs(function(){
                    var ap_inserter_b_1 = ap_inserter.bind(ap_inserter
                        ,product_id_1
                        ,name_1
                        ,approve_sku_lst_1
                        ,product_pdb
                    );
                    async.waterfall([ap_inserter_b_1],function(error,result){
                        fixture_is_setup = (result == null);
                    })
                });
                waitsFor(function(){return(fixture_is_setup);},"insert fixture: insert 2 approve products that share a same sku",time_out);
                
                //TEST RESULT
                runs(function(){
                    var ap_getter_b = ap_getter.by_product_id.bind(ap_getter.by_produc_id,product_id_1,product_idb);
                    async.waterfall([ap_getter_b],function(error,result){
                        var ap_1 = result;
                        if(error){
                            alert(error);
                        }
                        expect(error).toBe(null);
                        expect(ap_1).toNotBe(null);
                        expect(ap_1.product_id).toBe(product_id_1);
                        expect(ap_1.name).toBe(name_1);
                        expect(ap_1.sku_lst.length).toBe(2);
                        expect(ap_1.sku_lst[0]).toBe(sku_1);
                        expect(ap_1.sku_lst[1]).toBe(sku_2);
                    });
                });

            });
        });
    }
);