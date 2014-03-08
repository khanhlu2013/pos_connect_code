define(
    [
         'lib/object_store/get_os'
        ,'lib/db/couch_db_util'
        ,'constance'
    ]
    ,function(
         get_os
        ,couch_db_util
        ,constance
    )
{
    return function(store_idb,callback){
        var store_os = get_os.get_main_os(true/*is_read_only*/,store_idb);
        var doc_id_index = store_os.index(constance.DOCUMENT_ID_INDEX_NAME);

        var result_lst = new Array();
        doc_id_index.openCursor(IDBKeyRange.only(constance.TAX_DOCUMENT_ID)).onsuccess = function(event) {
            var cursor = event.target.result;
            if (cursor) {
                result_lst.push(cursor.value);
                cursor.continue();
            }else{
                var error = null;
                var filtered_result_lst = couch_db_util.filter_old_rev(result_lst);
                var len = filtered_result_lst.length;
                var error = null;
                var result = null;
                if(len > 1){
                    error = 'Error: multiple result found';
                }else if(len == 1){
                    result = filtered_result_lst[0].tax_rate;
                }

                callback(error,result);
            }
        };
    }
});