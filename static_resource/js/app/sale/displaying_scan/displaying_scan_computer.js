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
    function is_deal_contain_pid(mm,pid){
        var result = false;

        for(var i = 0;i<mm.mix_match_child_sp_lst.length;i++){
            if(mm.mix_match_child_sp_lst.product_id == pid){
                result = true;
                break;
            }
        }

        return result;
    }

    function get_posible_deal_from_pid(pid,mm_lst){
        var result = [];

        for(var i = 0;i<mm_lst.length;i++){
            if(is_deal_contain_pid(mm_lst[i],pid)){
                result.push(mm_lst[i]);
            }
        }

        return result;
    }

    function is_deal_in_lst(deal,deal_lst){
        var result = false;

        for(var i = 0;i<deal_lst.length;i++){
            if(deal_lst[i].id == deal.id){
                result = true;
                break;
            }
        }
        return result;
    }

    function merge_a_to_b(a_lst,b_lst){
        for(var i = 0;i<a_lst.length;i++){
            if(!is_deal_in_lst(a_lst[i],b_lst)){
                b_lst.push(a_lst[i]);
            }
        }

        return b_lst;
    }

    function get_posible_deal_from_lst(sp_distict_lst,mm_lst){
        var result = [];

        for(var i = 0;i<sp_distinct_lst.length;i++){
            var temp_deal_lst = get_posible_deal_from_pid(sp_distinct_lst[i].product_id,mm_lst);
            merge_a_to_b(temp_deal_lst,result);
        }

        return result
    }

    function get_ds_extract(ps_lst,sp_distinct_lst){
        var result = [];

        for(var i = 0;i<ps_lst.length;i++){
            var cur_ps = ps_lst[i];
            var associated_store_product = sp_util.get_item_based_on_doc_id(cur_ps.sp_doc_id,sp_distinct_lst);

            for(j=0;j<cur_ps.qt;j++){
                var ds = new Displaying_scan(1/*qty*/,associated_store_product,cur_ps.price,cur_ps.discount,cur_ps.non_product_name);
                result.push(ds);                
            }
        }
        return result;
    }


    function form_deal(ds_extract_lst,mm_deal){
        var qty = 0;

        for(var i = 0;i<ds_extract_lst.length;i++){
            var cur_ds = ds_extract_lst[i];
            var cur_pid = (cur_ds.store_product == null ? null : cur_ds.store_product.product_id);
            if(cur_pid != null && cur_ds.mix_match_deal_id == null && is_deal_contain_pid(mm_deal,cur_pid)){
                qty = qty + 1;
            }
        }

        if(qty < mm_deal.qty){
            return;
        }

        for(var i = 0;i<ds_extract_lst.length;i++){
            var cur_ds = ds_extract_lst[i];
            var cur_pid = (cur_ds.store_product == null ? null : cur_ds.store_product.product_id);
            if(cur_pid != null && cur_ds.mix_match_deal_id == null && is_deal_contain_pid(mm_deal,cur_pid)){
                cur_ds.mix_match_deal_id = mm_deal.id;
            }
        }
    }

    function compute_ds(mm_lst,ps_lst,sp_distinct_lst,callback){

        var possible_mm_lst = get_posible_deal_from_lst(sp_distinct_lst,mm_lst);
        var ds_extract_lst = get_ds_extract(ps_lst,sp_distinct_lst);

        for(var i = 0;i<possible_mm_lst.length;i++){
            form_deal(ds_extract_lst,possible_mm_lst[i]);
        }

        var compress_ds_lst = compress(ds_extract_lst);
        callback(null,compress_ds_lst);
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

    return function(mm_lst,store_idb,ps_lst,callback){
        var get_distinct_store_product_lst_b = get_distinct_store_product_lst.bind(get_distinct_store_product_lst,store_idb,ps_lst);
        var compute_ds_b = compute_ds.bind(compute_ds,mm_lst,ps_lst);
        async.waterfall
 		(
 			[
 				 get_distinct_store_product_lst_b
 				,compute_ds_b
 			]
 			,function(error,result){
 				callback(error,result);
 			}
 		);
    }
});