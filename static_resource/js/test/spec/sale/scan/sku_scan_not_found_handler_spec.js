define(
[
     'lib/test_lib/before_each'
    ,'lib/test_lib/after_each'
    ,'lib/error_lib'
    ,'lib/async'
    ,'constance'
    ,'app/sale/scan/sku_scan_not_found_handler'
    ,'app/store_product/sp_online_searcher'
    ,'app/store_product/sp_prompt'
    ,'app/store_product/store_product_getter'
]
,function
(
     before_each
    ,after_each
    ,error_lib    
    ,async	
    ,constance
    ,sku_scan_not_found_handler
    ,sp_online_searcher
    ,sp_prompt
    ,sp_getter
)
{
	describe('sku scan not found handler',function(){
        var tax_rate = 9.125;
        var store_idb = null;
        var store_pdb = null;

        beforeEach(function (done) {
            jasmine.Ajax.install();
            var before_each_b = before_each.bind(before_each,tax_rate);
            async.waterfall([before_each_b],function(error,result){
                store_idb = result.store_idb;
                store_pdb = result.store_pdb;
                done();
            });
        });

        afterEach(function (done) {
            jasmine.Ajax.uninstall();
            var after_each_b = after_each.bind(after_each,store_idb);
            async.waterfall([after_each_b],function(error,result){
                done();
            });
        });

		it('can create sp when intenet is down',function(done){
			//sku_scan_not_found_handler will search online for that sku for more info in the network. 
			//This test verify that if internet is down, we can simply create this sp. 
			//Therefore, we will spy on the online sku search and callfake to simulate offline condition
            spyOn(sp_online_searcher,'sku_search').and.callFake(function(sku_str ,callback){
				var offline_error = error_lib.create_offline_error_for_test_purpose();              
                callback(offline_error);
            });

 			spyOn(window, 'confirm').and.returnValue(true)
			
			var name = 'product name';
			var price = 1.1;
			var is_taxable = true;
			var is_sale_report = true;
			var p_type = 'type';
			var p_tag = 'tag';
			var crv = 1.2;
			var sku_str = '111';
			var cost = 1.3;
			var vendor = 'pitco';
			var buydown = 1.4;

	        var result = {
	             "name"             : name
	            ,"price"            : price
	            ,"is_taxable"       : is_taxable
	            ,"is_sale_report"   : is_sale_report
	            ,"p_type"           : p_type
	            ,"p_tag"            : p_tag           
	            ,"crv"              : crv
	            ,"sku_str"          : sku_str
	            ,"cost"             : cost
	            ,"vendor"           : vendor
	            ,"buydown"          : buydown
	        }			
            spyOn(sp_prompt,'show_prompt').and.callFake(function(
		         name_prefill
		        ,price_prefill
		        ,crv_prefill
		        ,is_taxable_prefill
		        ,is_sale_report_prefill
		        ,p_type_prefill
		        ,p_tag_prefill        
		        ,sku_prefill
		        ,is_prompt_sku
		        ,cost
		        ,vendor     
		        ,buydown   
		        ,lookup_type_tag
		        ,is_sku_management
		        ,is_group_management
		        ,suggest_product
		        ,callback
            ){
 				callback(null,result);
            });			

			var sku_str = '111';
			var store_id = null; // this is needed to compare the sku search data within the network. we need to know what store we are to see other store in the network
			var couch_server_url = null;//this is use to create online and sync if nessesary
			var sku_scan_not_found_handler_b = sku_scan_not_found_handler.exe.bind(sku_scan_not_found_handler.exe,sku_str,store_id,couch_server_url,store_pdb)
			async.waterfall([sku_scan_not_found_handler_b],function(error,result){
				var sp_getter_by_sku_b = sp_getter.search_by_sku.bind(sp_getter.search_by_sku,sku_str,store_idb);
				async.waterfall([sp_getter_by_sku_b],function(error,result){
					var sp_lst = result;
					expect(sp_lst.length).toBe(1)

					var sp=sp_lst[0];
					expect(sp.product_id).toBe(null);
					expect(sp.name).toBe(name);
					expect(sp.price).toBe(price);
					expect(sp.crv).toBe(crv);
					expect(sp.is_taxable).toBe(is_taxable);
					expect(sp.is_sale_report).toBe(is_sale_report);
					expect(sp.p_type).toBe(p_type);
					expect(sp.p_tag).toBe(p_tag);
					expect(sp.sku_lst.length).toBe(1);
					expect(sp.sku_lst[0]).toBe(sku_str);
					expect(sp.d_type).toBe(constance.STORE_PRODUCT_TYPE);
					expect(sp.cost).toBe(cost);
					expect(sp.vendor).toBe(vendor);
					expect(sp.buydown).toBe(buydown);					
					done();
				})

			})
		});
	});
});