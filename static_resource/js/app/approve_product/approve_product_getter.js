define(
	[
		 'lib/object_store/get_os'
 		,'app/approve_product/Approve_product'
 		,'constance'
        ,'lib/db/couch_db_util'

	]
	,function
	(
		 get_os
		,Approve_product
		,constance
        ,couch_db_util
	)
{
    var ERROR_APPROVE_PRODUCT_ID_NOT_EXIST = 'ERROR_APPROVE_PRODUCT_ID_NOT_EXIST'

	function create_approve_product_from_cursor(cursor){
		return new Approve_product
        (
             cursor.value._id
            ,cursor.value._doc_id_rev
            ,cursor.value.product_id
            ,cursor.value.name
            ,cursor.value.sku_lst
        );		
	}

    function by_product_id(product_id,product_idb,callback){
        var store_os = get_os.get_main_os(true/*is_read_only*/,product_idb)
        var pid_index = store_os.index(constance.PRODUCT_ID_INDEX_NAME);

        var product_lst = new Array();
        pid_index.openCursor(IDBKeyRange.only(product_id)).onsuccess = function(event) {
            var cursor = event.target.result;
            if (cursor) {
 				product_lst.push(create_approve_product_from_cursor(cursor));
                cursor.continue();
            }else{
                var error = null;
                product_lst = couch_db_util.filter_old_rev(product_lst);
                var len = product_lst.length;
                if(len>1){
					callback('error: multiple result found'/*error*/,null/*result*/);
                }else if(len == 1){
                	callback(null/*error*/,product_lst[0]);
                }else{
                	callback(ERROR_APPROVE_PRODUCT_ID_NOT_EXIST,null/*result*/)
                }
 			}
        };
    }

    function by_sku(sku,product_idb,callback){
        var store_os = get_os.get_main_os(true/*is_read_only*/,product_idb)
        var sku_index = store_os.index(constance.SKU_INDEX_NAME);

        var product_lst = new Array();
        sku_index.openCursor(IDBKeyRange.only(sku)).onsuccess = function(event) {
            var cursor = event.target.result;
            if (cursor) {
				product_lst.push(create_approve_product_from_cursor(cursor));
                cursor.continue();
            }else{
                var error = null;
                product_lst = couch_db_util.filter_old_rev(product_lst);
                callback(error,product_lst);
            }
        };
    }

    return {
    	 by_product_id:by_product_id
    	,by_sku:by_sku
        ,ERROR_APPROVE_PRODUCT_ID_NOT_EXIST : ERROR_APPROVE_PRODUCT_ID_NOT_EXIST
    }

});