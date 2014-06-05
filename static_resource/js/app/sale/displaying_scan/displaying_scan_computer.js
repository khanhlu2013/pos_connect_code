define(
    [   
         'lib/async'
        ,'app/sale/pending_scan/pending_scan_util'
        ,'app/store_product/store_product_getter'
        ,'app/store_product/store_product_util'
        ,'app/sale/displaying_scan/Displaying_scan'
        ,'app/sale/displaying_scan/displaying_scan_util'
        ,'lib/number/number'
    ],function
    (
         async
        ,ps_util
        ,sp_getter
        ,sp_util
        ,Displaying_scan
        ,ds_util
        ,number
    )
{
    function is_deal_contain_pid(mm,pid){
        var result = false;

        for(var i = 0;i<mm.mix_match_child_set.length;i++){
            if(mm.mix_match_child_set[i].store_product.product_id == pid){
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

    function get_posible_deal_from_lst(sp_distinct_lst,mm_lst){
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

            for(j=0;j<cur_ps.qty;j++){
                var ds = new Displaying_scan(1/*qty*/,associated_store_product,cur_ps.price,cur_ps.discount,cur_ps.non_product_name);
                result.push(ds);                
            }
        }
        return result;
    }

    function is_ds_available_for_deal(ds,mm_deal){
        var pid = (ds.store_product == null ? null : ds.store_product.product_id);
        if(pid != null && ds.mm_deal_info == null && is_deal_contain_pid(mm_deal,pid)){
            return true;
        }else{
            return false;
        }        
    }

    function get_total_deal_can_be_form(ds_extract_lst,mm_deal){
        /*
            RETURN the total of deal we can form. lets say the deal.qty = 3 and we have 7 item to for this deal. its mean that we can form 2 deals.        
        */

        var avail_qty = 0;//this is the total available item in this ds_lst that we can use to form this deal. An available item is an item that curentlly have no deal assigned to, and this item have to belong to this deal's chilren

        for(var i = 0;i<ds_extract_lst.length;i++){
            if(is_ds_available_for_deal(ds_extract_lst[i],mm_deal))
            {
                avail_qty = avail_qty + 1;
            }
        }

        return Math.floor(avail_qty / mm_deal.qty); 
    }


    function form_deal(ds_extract_lst,mm_deal,tax_rate){
        var num_deal = get_total_deal_can_be_form(ds_extract_lst,mm_deal);
        if(num_deal == 0){ return ;}


        /*
            When we record sale record, it is convenient to record the $ discount amount for each item. To calculate what is the unit discount for EACH item from mm deal,
                we need to calculate the regular price of the WHOLE deal which depend on what is the mix_match formation and its corresponding regular price. My point here
                is that each item in a mix_match deal have to be aware and contain the whole deal formation for calculation. For that reason, we will form a convenient list of
                item X containing a list of all ds that is available to form a deal. 
        */
        var x_lst = [];//a list of item X. Each X containing a list of available ds to form a deal
        var cur_x = null;
        var cur_qty_for_cur_deal = 0;//a temporary var to help forming x_lst
        
        for(var i = 0;i<ds_extract_lst.length;i++){
            
            //init cur_x if nessesary
            if(cur_qty_for_cur_deal == 0){
                cur_x = new Array();
            }

            //forming cur_x
            var cur_ds = ds_extract_lst[i];
            if(is_ds_available_for_deal(cur_ds,mm_deal)){
                cur_x.push(cur_ds);
                cur_qty_for_cur_deal +=1;
            }

            //finalize cur_x
            if(cur_qty_for_cur_deal == mm_deal.qty){
                cur_qty_for_cur_deal = 0;
                x_lst.push(cur_x);
            }
        }

        /*
            After that, we will go through each available ds and assign item X to it so that each available ds will be aware of the whole deal.
        */
        for(var i = 0;i<x_lst.length;i++){
            var cur_x = x_lst[i];

            for(var j=0;j<cur_x.length;j++){
                var cur_ds = cur_x[j];
                var unit_discount = get_unit_discount(cur_x,parseFloat(mm_deal.otd_price),mm_deal.qty,tax_rate);
                cur_ds.mm_deal_info = {deal:mm_deal,/*data:cur_x,*/unit_discount:unit_discount} 
            }
        }        
    }

    function get_unit_discount(ds_lst,otd_price,qty,tax_rate){
        //CALCULATE IS_TAXABLE
        var is_taxable = false;
        for(var i = 0;i<ds_lst.length;i++){
            if(ds_lst[i].store_product.is_taxable){
                is_taxable = true;
                break;
            }
        }
        if(is_taxable == false){
            tax_rate = 0.0;
        }

        //CALCULATE TOTAL REGULAR PRICE
        var total_reg_price = 0.0;
        for(var i = 0;i<ds_lst.length;i++){
            var ds = ds_lst[i];
            total_reg_price += (ds.store_product.price + ds.store_product.crv)
        }
        result = 
            (total_reg_price / qty)
            -
            (100.0 * otd_price) / ((100.0 + tax_rate) * qty)
        ;
        return number.round_2_decimal(result);
    }

    function compress(ds_lst){
        var result = [];

        for(var i = 0;i<ds_lst.length;i++){
            if(i == 0){
                result.push(ds_lst[0]);
                continue;
            }

            var last_item = result[result.length-1];
            var cur_item = ds_lst[i];

            if(last_item.store_product == null || cur_item.store_product == null){
                result.push(cur_item);
                continue;
            }            

            if(
                   last_item.store_product.product_id === cur_item.store_product.product_id
                && last_item.price === cur_item.price
                && last_item.discount === cur_item.discount
                && 
                    (
                           (last_item.mm_deal_info !== null && cur_item.mm_deal_info !== null && last_item.mm_deal_info.deal === cur_item.mm_deal_info.deal)
                        || (last_item.mm_deal_info === null && cur_item.mm_deal_info === null)
                    )
                    
            ){
                last_item.qty += 1;
            }else{
                result.push(cur_item);
            }
        }

        return result;
    }

    function compute_ds(tax_rate,mm_lst,ps_lst,sp_distinct_lst,callback){
        var possible_mm_lst = get_posible_deal_from_lst(sp_distinct_lst,mm_lst);
        var ds_extract_lst = get_ds_extract(ps_lst,sp_distinct_lst);

        for(var i = 0;i<possible_mm_lst.length;i++){
            form_deal(ds_extract_lst,possible_mm_lst[i],tax_rate);
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

    return function(tax_rate,mm_lst,store_idb,ps_lst,callback){
        var get_distinct_store_product_lst_b = get_distinct_store_product_lst.bind(get_distinct_store_product_lst,store_idb,ps_lst);
        var compute_ds_b = compute_ds.bind(compute_ds,tax_rate,mm_lst,ps_lst);
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