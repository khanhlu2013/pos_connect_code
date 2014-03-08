define(
	[

		 'app/local_db_initializer/customize_db'
		,'lib/async'
		,'lib/db/pouch_db_util'
		,'lib/object_store/get_os'
		,'constance'
	]
	,function
	(
		 customize_db
		,async
		,pouch_db_util
		,get_os
		,constance
	)
{
	function insert_tax_rate(store_pdb,tax_rate,callback){
 		var tax_doc = {_id:constance.TAX_DOCUMENT_ID,tax_rate:tax_rate};
		store_pdb.put(tax_doc,function(error,response){
			callback(error);
		});
	}

	return function(test_db_name,tax_rate,callback){

 		function create_dbs(db_name,inner_callback){
	        pouch_db_util.get_db(db_name);
	        pouch_db_util.get_db(constance.APPROVE_PRODUCT_DB_NAME)
	        inner_callback(null/*error*/);
	    }

	    var delete_store_db_b = pouch_db_util.delete_db.bind(pouch_db_util.delete_db,test_db_name);
	    var delete_product_db_b = pouch_db_util.delete_db.bind(pouch_db_util.delete_db,constance.APPROVE_PRODUCT_DB_NAME);
	    var create_dbs_b = create_dbs.bind(create_dbs,test_db_name);
	    var customize_db_b = customize_db.bind(customize_db,test_db_name);

        async.waterfall
        (
            [
                 delete_store_db_b
                ,delete_product_db_b
                ,create_dbs_b
                ,customize_db_b
            ]
            ,function(error,result){
				var store_idb = result[0];
            	var product_idb = result[1];
				var store_pdb = pouch_db_util.get_db(test_db_name);
				var product_pdb = pouch_db_util.get_db(constance.APPROVE_PRODUCT_DB_NAME);
            	
            	var end_result = new Array();
            	end_result.push(store_idb);
            	end_result.push(product_idb);
            	end_result.push(store_pdb);
 				end_result.push(product_pdb);

            	var insert_tax_rate_b = insert_tax_rate.bind(insert_tax_rate,store_pdb,tax_rate);
            	async.waterfall([insert_tax_rate_b],function(error,result){
            		callback(error,end_result);
            	});
            }
        );
 	}
});

