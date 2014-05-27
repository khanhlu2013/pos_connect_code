define(
[
	 'lib/async'
	,'constance'
	,'app/store_product/store_product_getter'
    ,'lib/db/index_db_util'
    ,'lib/db/db_util'
    ,'lib/object_store/get_os'    

]
,function
(
	 async
	,constance
	,sp_getter
	,index_db_util
    ,db_util
    ,get_os
)
{
    function sku_search_without_rev_filter(sku,store_idb,callback){
        var store_os = get_os.get_main_os(true/*is_read_only*/,store_idb);
        var index = store_os.index(constance.SKU_INDEX_NAME);

        var product_lst = new Array();
        index.openCursor(IDBKeyRange.only(sku)).onsuccess = function(event) {
            var cursor = event.target.result;
            if (cursor) {
                product_lst.push(sp_getter._create_store_product_from_cursor(cursor,store_idb));
                cursor.continue();
            }else{
                callback(null/*error*/,product_lst);
            }
        };
    }

    function exe(pid,sku){
        /* 
            couch db remove by creating another document with newer version having is_delete flag. Couch let the old doc untouch which mean indexdb still picking up old sku.
            we have to remove this old revision either by compact pouch (but it take too long). so i remove it manually here.
        */
        var is_store_idb_exist_b = db_util.is_store_idb_exist.bind(db_util.is_store_idb_exist,STORE_ID);
        async.waterfall([is_store_idb_exist_b],function(error,result){
            if(error){
                error_lib.alert_error(error);
                return;
            }

            var idb = result;
            if(idb == null){
                return;
            }

            var offline_sku_getter_b = sku_search_without_rev_filter.bind(sku_search_without_rev_filter,sku,idb);
            async.waterfall([offline_sku_getter_b],function(error,result){
                if(error){
                    error_lib.alert_error(error);
                    return;
                }

                all_sp_lst = result;
                if(all_sp_lst.length == 0){
                    alert('Bug: unexpected sku remove clean up result');
                    return;
                }

                //filter out all the sp with the specified pid
                sp_lst = [];
                for(var i = 0;i<all_sp_lst.length;i++){
                    if(all_sp_lst[i].product_id == pid){
                        sp_lst.push(all_sp_lst[i]);
                    }
                }

                var delete_func_lst = []
                for(var i = 0;i<sp_lst.length;i++){
                    var delete_sku_item_b = index_db_util.delete_item.bind(index_db_util.delete_item,idb,sp_lst[i].key);
                    delete_func_lst.push(delete_sku_item_b)
                }

                
                async.series(delete_func_lst,function(error,results){
                    if(error){
                        error_lib.alert_error(error);
                        return;
                    }                                
                });                
            });
        });
    }

	return {
		exe:exe
	}
});