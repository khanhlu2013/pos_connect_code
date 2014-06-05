define(
    [
         'app/store_product/Store_product'
        ,'lib/db/couch_db_util'
        ,'lib/object_store/get_os'
        ,'lib/async'
        ,'constance'
        ,'lib/error_lib'
    ]
    ,function(
         Store_product
        ,couch_db_util
        ,get_os
        ,async
        ,constance
        ,error_lib
    )
{
    function get_assoc_need_to_populate(store_product){
        if(store_product.breakdown_assoc_lst == undefined || store_product.breakdown_assoc_lst.length == 0){
            return null;
        }

        for(var i = 0;i<store_product.breakdown_assoc_lst.length;i++){
            var assoc = store_product.breakdown_assoc_lst[i];

            if(assoc.breakdown_id != undefined){
                return assoc;
            }else{
                var sub_assoc = get_assoc_need_to_populate(assoc.breakdown);
                if(sub_assoc != null){
                    return sub_assoc;
                }
            }
        }

        return null;
    }

    function populate_assoc(assoc,store_idb,callback){
        var by_product_id_b = by_product_id.bind(by_product_id,assoc.breakdown_id,store_idb);
        async.waterfall([by_product_id_b],function(error,result){
            assoc.breakdown = result;
            delete assoc.breakdown_id;
            callback(error)
        });
    }

    function populate_kit(sp,store_idb,callback){
        var assoc = get_assoc_need_to_populate(sp);
        if(assoc == null){
            callback(null);
        }else{
            var populate_assoc_b = populate_assoc.bind(populate_assoc,assoc,store_idb);
            async.waterfall([populate_assoc_b],function(error,result){
                if(error){
                    error_lib.alert_error(error);
                    return;
                }else{
                    var populate_kit_b = populate_kit.bind(populate_kit,sp,store_idb);
                    async.waterfall([populate_kit_b],function(error,result){
                        callback(error,result);
                    })
                }
            })
        }
    }

    function populate_kit_lst(kit_lst,store_idb,callback){
        var func_lst = [];
        for(var i = 0;i<kit_lst.length;i++){
            var func = populate_kit.bind(populate_kit,kit_lst[i],store_idb);
            func_lst.push(func);
        }
        async.series(func_lst,function(error,results){
            callback(error,results);
        });
    }

    function _create_store_product_from_cursor(cursor,store_idb){
        var store_product = new Store_product
        (
             cursor.value._id
            ,cursor.value._rev
            ,cursor.primaryKey
            ,cursor.value.store_id
            ,cursor.value.product_id
            ,cursor.value.name
            ,cursor.value.price
            ,cursor.value.value_customer_price
            ,cursor.value.crv
            ,cursor.value.is_taxable
            ,cursor.value.is_sale_report
            ,cursor.value.p_type
            ,cursor.value.p_tag
            ,cursor.value.sku_lst
            ,cursor.value.cost
            ,cursor.value.vendor
            ,cursor.value.buydown
            ,cursor.value.breakdown_assoc_lst
        );
        return store_product
    }

    function _generic_search(index_name,search_param,is_unique_result_expected,store_idb,callback){
        var store_os = get_os.get_main_os(true/*is_read_only*/,store_idb);
        var index = store_os.index(index_name);

        var product_lst = new Array();
        index.openCursor(IDBKeyRange.only(search_param)).onsuccess = function(event) {
            var cursor = event.target.result;
            if (cursor) {
                product_lst.push(_create_store_product_from_cursor(cursor,store_idb));
                cursor.continue();
            }else{
                var filtered_result_lst = couch_db_util.filter_old_rev(product_lst);
                var populate_b = populate_kit_lst.bind(populate_kit_lst,filtered_result_lst,store_idb);                    
                async.waterfall([populate_b],function(error,result){
                    if(error){
                        callback(error);
                        return;
                    }

                    if(is_unique_result_expected){
                        var len = filtered_result_lst.length;
                        if(len==1){
                            callback(null/*error*/,filtered_result_lst[0]);
                        }else if(len == 0){
                            callback(null/*error*/,null/*result*/);
                        }else{
                            callback('Bug: multiple result is found',null/*result*/)
                        }
                    }else{
                        callback(null/*error*/,filtered_result_lst);
                    } 
                })
            }
        };
    }

    function by_product_id(product_id,store_idb,callback){
        _generic_search(
             constance.PRODUCT_ID_INDEX_NAME//index_name
            ,product_id//search_param
            ,true//is_unique_result_expected
            ,store_idb
            ,callback
        );
    }

    function search_by_sku(sku,store_idb,callback){
        _generic_search(
             constance.SKU_INDEX_NAME//index_name
            ,sku//search_param
            ,false//is_unique_result_expected
            ,store_idb
            ,callback
        );
    }
    
    function search_by_doc_id(doc_id,store_idb,callback){
        _generic_search(
             constance.DOCUMENT_ID_INDEX_NAME//index_name
            ,doc_id//search_param
            ,true//is_unique_result_expected
            ,store_idb
            ,callback
        );
    }

    function search_by_doc_id_lst(doc_id_lst,store_idb,callback){
        var search_func_array = new Array();

        for(var i = 0;i<doc_id_lst.length;i++){
            var search_func_b = search_by_doc_id.bind(search_by_doc_id,doc_id_lst[i],store_idb);
            search_func_array.push(search_func_b);
        }

        async.series(search_func_array,function(error,results){
            callback(error,results);
        });
    }

    function search_by_pid_lst(pid_lst,store_idb,callback){
        var func_lst = []
        for(var i = 0;i<pid_lst.length;i++){
            var func = by_product_id.bind(by_product_id,pid_lst[i],store_idb);  
            func_lst.push(func); 
        }
        
        async.series(func_lst,function(error,results){
            callback(error,results)
        });
    }

    function by_product_id_is_null(store_idb,callback){
        var store_os = get_os.get_main_os(true/*is_read_only*/,store_idb)
        var index = store_os.index(constance.DOCUMENT_TYPE_INDEX);

        var product_lst = new Array();
            index.openCursor(IDBKeyRange.only(constance.STORE_PRODUCT_TYPE)).onsuccess = function(event) {
            var cursor = event.target.result;
            if (cursor) {
                if(cursor.value.product_id==null){
                    product_lst.push(_create_store_product_from_cursor(cursor,store_idb));
                }
                cursor.continue();
            }else{
                var filtered_result_lst = couch_db_util.filter_old_rev(product_lst);
                callback(null/*error*/,product_lst);
            }
        };       
    }


    return {
         search_by_sku:search_by_sku
        ,search_by_doc_id_lst:search_by_doc_id_lst
        ,by_product_id:by_product_id
        ,by_product_id_is_null:by_product_id_is_null
        ,_create_store_product_from_cursor:_create_store_product_from_cursor
        ,search_by_pid_lst:search_by_pid_lst//test purpose, don't need to publish this
    }
});


