define(
    [
         'app/sale/pending_scan/Pending_scan'
        ,'lib/object_store/get_os'
    ]
    ,function
    (
         Pending_scan
        ,get_os
    )
{
	return function(store_idb,callback){
        var pending_lst = new Array();
        var ps_os = get_os.get_pending_scan_os(true/*is_read_only*/,store_idb);
        ps_os.openCursor().onsuccess = function(event) {
            var cursor = event.target.result;
            if (cursor) {
                pending_lst.push(new Pending_scan(cursor.key,cursor.value.qty,cursor.value.price,cursor.value.discount,cursor.value.sp_doc_id,cursor.value.non_product_name));
                cursor.continue();
            }
            else {
                callback(null/*error*/,pending_lst/*result*/);
            }
        };
    };
});




