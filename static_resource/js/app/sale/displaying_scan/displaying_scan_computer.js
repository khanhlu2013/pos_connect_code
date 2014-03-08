define(
    [   
         'lib/async'
        ,'app/sale/pending_scan/pending_scan_util'
        ,'app/store_product/store_product_getter'
        ,'app/store_product/store_product_util'
        ,'app/sale/displaying_scan/Displaying_scan'
    ],function
    (
         async
        ,ps_util
        ,sp_getter
        ,sp_util
        ,Displaying_scan
    )
{
    function compute_displaying_scan(ps_lst,sp_lst,callback){
        var ds_lst = new Array();
        for(var i = 0;i<ps_lst.length;i++){
            var cur_ps = ps_lst[i];
            var associated_store_product = sp_util.get_item_based_on_doc_id(cur_ps.sp_doc_id,sp_lst)
            var ds = new Displaying_scan(cur_ps.qty,associated_store_product,cur_ps.price,cur_ps.discount,cur_ps.non_product_name);
            ds_lst.push(ds);
        }
        callback(null/*error*/,ds_lst);
    }

	function get_distinct_store_product_lst(store_idb,ps_lst,callback){
        /*
            PARAM:
                store_idb:
                ps_lst: pending scan list
                callback:
            POST:
                a distinct store product, calculated from ps_lst input, is returned to callback
        */
        if(ps_lst.length != 0){
            var distinct_doc_id_lst = ps_util.get_distinct_doc_id_lst(ps_lst);
            var search_by_doc_id_lst = sp_getter.search_by_doc_id_lst;
            var search_by_doc_id_lst_b = search_by_doc_id_lst.bind(search_by_doc_id_lst,distinct_doc_id_lst,store_idb);

            async.series([search_by_doc_id_lst_b],function(error,results){
                callback(error,results[0]);
            });
        }else{
            callback(null/*error*/,new Array()/*empty store product lst*/);
        }
    }

    return function(store_idb,ps_lst,callback){
        var get_distinct_store_product_lst_b = get_distinct_store_product_lst.bind(get_distinct_store_product_lst,store_idb,ps_lst);
        var computer = compute_displaying_scan;
        var compute_b = computer.bind(computer,ps_lst);
        
        async.waterfall
 		(
 			[
 				 get_distinct_store_product_lst_b
 				,compute_b
 			]
 			,function(error,compute_result){
 				callback(error,compute_result);
 			}
 		);
    }
});