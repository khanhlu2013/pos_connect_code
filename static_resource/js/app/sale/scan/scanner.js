define(function(require){

    var sp_getter = require('app/store_product/store_product_getter');
    var inserter = require('app/sale/pending_scan/pending_scan_inserter');
    var async = require('lib/async');
    var Pending_scan = require('app/sale/pending_scan/Pending_scan');
    var ERROR_STORE_PRODUCT_NOT_FOUND = 'ERROR_STORE_PRODUCT_NOT_FOUND'
    var ERROR_CANCEL_SHARE_SKU_BREAKER = 'ERROR_CANCEL_SHARE_SKU_BREAKER';

    function get_sku_from_scan_str(scan_str){
        /*
            PRE
                One of the two following condition must be true
                    .scan_str contain one token
                    .scan_str contain 2 token, and first token is an integer
            PARAM
                scan_str: whatever user is entering into the scan textbox
            RETURN
                if scan_str contain 1 token, return scan_str
                if scan_str contain 2 token, return the second token
        */
        var lst = scan_str.trim().split(' ');
        var len = lst.length;
        if(len == 0){
            return null;
        }else if(len == 1){
            return lst[0];
        }else if(len == 2){
            var qty_str = lst[0];
            if (isNaN(qty_str)){
                alert('first token must be a number')
                return null;
            }else{
                return lst[1];
            }
        }else{
            alert('scan can not be more than 2 tokens')
            return null;
        }
    }

    function get_qty_from_scan_str(scan_str){
        /*
            PRE
                One of the two following condition must be true
                    .scan_str contain one token
                    .scan_str contain 2 token, and first token is an integer
            PARAM
                scan_str: whatever user is entering into the scan textbox
            RETURN
                if scan_str contain 1 token, return 1
                if scan_str contain 2 token, return the first integer token
        */
        var lst = scan_str.trim().split(' ');
        var len = lst.length;
        if(len == 0){
            return null;
        }else if(len == 1){
            return 1;
        }else if(len == 2){
            var qty_str = lst[0];
            if (isNaN(qty_str)){
                alert('first token must be a number')
                return null;
            }else{
                return Number(qty_str);
            }
        }else{
            alert('scan can not be more than 2 tokens')
            return null;
        }
    }   
     
    function one_product_selector(sp_lst,callback){
        /*
            DESC: take a list of store product. If this list contain 1 item, return that item. 
                  If it is has multiple items, prompt user to select one item
            PRE: ps_lst is not empty.
            PARAM
                sp_lst: a list of Store_product
                callback:
            POST:
                1 product_id is return to the callback
        */
        var len = sp_lst.length
        var product = null;
        
        if(len === 0){
            callback('Error: unexpected empty list',null/*result*/);
        }
        else if(len === 1){
            product = sp_lst[0];
            callback(null/*error*/,product/*result*/)
        }else{
            var msg = '';
            for(var i = 0;i<len;i++){
                msg += 'select ' + (i+1) + ' for: ' + sp_lst[i].name + '\n';
            }
            var selection = prompt(msg);
            if(selection == null){
                callback(ERROR_CANCEL_SHARE_SKU_BREAKER/*error*/,null/*result*/)
            }else if(selection > len){
                callback('wrong selection. scan again'/*error*/,null/*result*/)
            }else{
                product = sp_lst[selection -1];
                callback(null/*error*/,product/*result*/)
            }
        }
    }

    function inserting_ps_constructor(qty,store_product,callback){
        var inserting_ps = new Pending_scan(null/*key*/,qty,store_product.price,null/*discount*/,store_product._id,null/*non_product_name*/);
        callback(null/*error*/,inserting_ps);
    }

    function exe(scan_str,store_idb,callback){

        var qty = get_qty_from_scan_str(scan_str);
        var sku = get_sku_from_scan_str(scan_str);
        if(qty == null || sku ==null){
            var error = 'invalid scan string';
            callback(error,null/*result*/);
        }

        var sp_search_result_lst = null;
        var searcher_b = sp_getter.search_by_sku.bind(sp_getter.search_by_sku,sku,store_idb);
        async.waterfall([searcher_b],function(error,result){
            if(error){
                callback(error);
                return;
            }

            if(result == null || result == undefined){
                callback("Error: cant search for product");
                return;
            }

            if(result.length == 0){
                callback(ERROR_STORE_PRODUCT_NOT_FOUND);
                return;                        
            }

            var one_product_selector_b = one_product_selector.bind(one_product_selector,result);
            var inserting_ps_constructor_b = inserting_ps_constructor.bind(inserting_ps_constructor,qty);
            var inserter_b = inserter.bind(inserter,store_idb);
                    
            async.waterfall
            (
                [
                     one_product_selector_b
                    ,inserting_ps_constructor_b
                    ,inserter_b
                ],
                function(error,result){
                    callback(error);
                }
            );
        });
    }

    return{
         exe:exe
        ,get_sku_from_scan_str:get_sku_from_scan_str 
        ,get_qty_from_scan_str:get_qty_from_scan_str
        ,ERROR_STORE_PRODUCT_NOT_FOUND:ERROR_STORE_PRODUCT_NOT_FOUND
        ,ERROR_CANCEL_SHARE_SKU_BREAKER:ERROR_CANCEL_SHARE_SKU_BREAKER
    }

});