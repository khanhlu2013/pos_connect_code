define(
[
    'lib/number/number'
]
,function
(
    number
)
{
    function get_suggest_info(type,prod){
        lst = []

        for(var i = 0;i<prod.store_product_set.length;i++){

            if(type == 'price'){lst.push(prod.store_product_set[i].price);}
            else if(type == 'cost'){lst.push(prod.store_product_set[i].cost);}
            else if(type == 'crv'){lst.push(prod.store_product_set[i].crv);}
            else if(type == 'is_taxable'){lst.push(prod.store_product_set[i].is_taxable);}
            else{
                return null;
            }
        }

        if(type == 'price' || type == 'cost'){
            return number.get_median(lst);
        }else if(type == 'crv' || type == 'is_taxable'){
            return number.get_mode(lst);
        }
    }

    function get_sp_from_sp_lst(pid,sp_lst){
        var result = null;
        for(var i = 0;i<sp_lst.length;i++){
            if(sp_lst[i].product_id == pid){
                result = sp_lst[i];
                break;
            }
        }
        return result;
    }

    function get_p_from_lst(product_id,prod_lst){
        var result = null;
        for(var i = 0;i<prod_lst.length;i++){
            if(prod_lst[i].product_id == product_id){
                result = prod_lst[i];
                break;
            }
        }
        return result;
    }

    function get_sp_from_p(product,store_id){
        var sp = null;
        if(store_id == null){
            sp = product.store_product_set[0]
        }else{
            for(var i = 0;i<product.store_product_set.length;i++){
                var cur_sp = product.store_product_set[i]
                if(cur_sp.store_id == store_id){
                    sp = cur_sp;
                    break;
                }
            }            
        }
        return sp;
    }

    function get_prod_sku_assoc_set(product){
        prod_sku_assoc_set = product.prodskuassoc_set
        if (prod_sku_assoc_set == null){
            prod_sku_assoc_set = [];
        }

        return prod_sku_assoc_set;
    }

    function _helper_isStoreIn_storeProductLst(store_id,storeProduct_lst){
        var result = false;

        for(var i = 0;i<storeProduct_lst.length;i++){
            if(storeProduct_lst[i].store_id == store_id){
                result = true;
                break;
            }
        }
        return result;
    }

    function _helper_isStoreIn_prodSkuAssoc(store_id,prodSkuAssoc_lst,sku_str){
        var result = false;

        var prod_sku_assoc = null;
        for(var i = 0;i<prodSkuAssoc_lst.length;i++){
            if(prodSkuAssoc_lst[i].sku_str == sku_str){
                prod_sku_assoc = prodSkuAssoc_lst[i];
                break;
            }
        }


        for(var i = 0;i<prod_sku_assoc.store_set.length;i++){
            if(prod_sku_assoc.store_set.indexOf(store_id) != -1){
                result = true;
                break;
            }
        }
        return result;
    }

    function extract_prod_store__prod_sku(prod_lst,store_id,is_prod_store,is_prod_sku,sku_str){
        /*
            PARAM: 
                . is_prod_store : a not null boolean to indicate that we are extracting product that store_id : carry or not
                . is_prod_sku   : a not null boolean to indicate that we are extracting product that store_id : use sku assoc or not
                . sku_str       : nullable string, if null, we don't care is_prod_sku extracting criteria
        */
        var result = new Array();

        for(var i = 0;i<prod_lst.length;i++){
            var cur_prod = prod_lst[i];
            var prod_store_condition;
            var prod_sku_condition;

            prod_store_condition = _helper_isStoreIn_storeProductLst(store_id,prod_lst[i].store_product_set) == is_prod_store;

            if(sku_str == null){
                prod_sku_condition = true;
            }else{
                prod_sku_condition = _helper_isStoreIn_prodSkuAssoc(store_id,prod_lst[i].prodskuassoc_set,sku_str) == is_prod_sku;
            }


            if(prod_store_condition && prod_sku_condition){
                result.push(cur_prod);
            }
        }
        return result;
    }

    function remove_sp_from_sp_lst(sp,sp_lst){
        for(var i = 0;i<sp_lst.length;i++){
            if(sp_lst[i].product_id == sp.product_id){
                sp_lst.splice(i,1);
                break;
            }
        }
    }

    function compute_kit_amount(sp,field){
        if(sp.kit_child_set == undefined || sp.kit_child_set.length == 0){
            return 0.0;
        }

        var result = 0.0;
        for(var i = 0;i<sp.kit_child_set.length;i++){

            var child = sp.kit_child_set[i];
            if(field == 'crv'){
                result += (child.crv == null ? 0.0 : parseFloat(child.crv));
            }else if(field == 'buydown'){
                result += (child.buydown == null ? 0.0 : parseFloat(child.buydown));
            }else if(field == 'cost'){
                result += (child.cost == null ? 0.0 : parseFloat(child.cost));
            }else{
                result = NaN;
            }
        }

        return result;
    }

    return{
         get_prod_sku_assoc_set: get_prod_sku_assoc_set
        ,get_sp_from_p:get_sp_from_p
        ,extract_prod_store__prod_sku:extract_prod_store__prod_sku
        ,get_p_from_lst:get_p_from_lst
        ,get_sp_from_sp_lst:get_sp_from_sp_lst
        ,get_suggest_info:get_suggest_info
        ,remove_sp_from_sp_lst:remove_sp_from_sp_lst
        ,compute_kit_amount:compute_kit_amount
    };
});