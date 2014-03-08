define(
    [
         'app/sale/sale_finalizer/Receipt'
        ,'lib/object_store/get_os'
        ,'constance'
        ,'lib/db/couch_db_util'
    ]
    ,function
    (
         Receipt
        ,get_os
        ,constance
        ,couch_db_util
    )
{
	return function(store_idb,callback){
        var receipt_lst = new Array();
        var store_os = get_os.get_main_os(true/*is_read_only*/,store_idb);
        var doc_type_index = store_os.index(constance.DOCUMENT_TYPE_INDEX);

        doc_type_index.openCursor(IDBKeyRange.only(constance.RECEIPT_TYPE)).onsuccess = function(event) {
            var cursor = event.target.result;
            if (cursor) {
                var receipt = new Receipt
                (
                     cursor.value._id
                    ,cursor.value._rev 
                    ,cursor.value._doc_id_rev 
                    ,cursor.primaryKey//key
                    ,cursor.value.time_stamp
                    ,cursor.value.tax_rate
                    ,cursor.value.ds_lst
                    ,cursor.value.collected_amount
                );

                receipt_lst.push(receipt);
                cursor.continue();
            }else{
                receipt_lst = couch_db_util.filter_old_rev(receipt_lst);
                callback(null/*error*/,receipt_lst);
            }
        };
    };
});