define(
	[
		'app/approve_product/Approve_product'
	],
	function
	(
		Approve_product
	)
{
 	return function (product_id,name,sku_lst,product_pdb,callback){

		var approve_product = new Approve_product
 		(
	         null//_id: handle by pouch
	        ,null//_rev: handle by pouch
 			,product_id
	        ,name
	        ,sku_lst
	    );
 
 		product_pdb.post(approve_product, function(err, response) {
			callback(err);
		});
	}
});
