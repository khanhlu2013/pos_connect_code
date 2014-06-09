define(
[
     'lib/error_lib'
    ,'lib/async'
    ,'lib/ajax_helper'
    ,'app/sale/displaying_scan/displaying_scan_lst_getter'
    ,'app/sale/scan/pid_scanner'
    ,'constance'
    ,'app/sale/scan/non_inventory_scanner'
    ,'app/sale/hold/hold_select_ui'
]
,function
(
     error_lib
    ,async
    ,ajax_helper
    ,ds_lst_getter
    ,pid_scanner
    ,constance
    ,non_inventory_scanner
    ,hold_select_ui
)
{
    var STORE_IDB = null;
    var TAX_RATE = null;
    var MM_LST = null;
    var ERROR_ds_lst_is_not_empty = 'ERROR_ds_lst_is_not_empty';
    var ERROR_hold_lst_is_empty = 'ERROR_hold_lst_is_empty';

    function load_hold(hold_lst,index,callback){
        var func_lst = [];
        var hold_item = hold_lst[index];

        for(var i = 0;i<hold_item.data.length;i++){
            var ds = hold_item.data[i];
            if(ds.store_product == null){
                var non_inventory_scanner_b = non_inventory_scanner.exe.bind(non_inventory_scanner.exe,ds.price,ds.non_product_name,STORE_IDB);
                func_lst.push(non_inventory_scanner_b);
            }else{
                var pid_scanner_b = pid_scanner.exe.bind(pid_scanner.exe,ds.store_product.product_id,ds.qty,STORE_IDB);
                func_lst.push(pid_scanner_b);                
            }

        }

        async.series(func_lst,function(error,results){
            if(error){
                callback(error);
                return;
            }

            hold_lst.splice(index,1);
            localStorage.setItem(constance.HOLD_LST,JSON.stringify(hold_lst));
            callback(null);
        });
    }

    function get_hold_index(hold,hold_lst){
        var result = null;

        for(var i = 0;i<hold_lst.length;i++){
            if(hold_lst[i].date === hold.date){
                result = i;
                break;
            }
        }
        return result;
    }

    function exe(tax_rate,mm_lst,store_idb,callback){
        STORE_IDB = store_idb;
        TAX_RATE = tax_rate;
        MM_LST = mm_lst;

        var ds_getter_b = ds_lst_getter.bind(ds_lst_getter,TAX_RATE,MM_LST,STORE_IDB);
        async.waterfall([ds_getter_b],function(error,result){
            if(error){
                callback(error);
                return;
            }
            
            //GET CURRENT HOLD LIST
            var json_str = localStorage.getItem(constance.HOLD_LST);
            if(json_str == null){
                callback(ERROR_hold_lst_is_empty);
                return;
            }
            var hold_lst = JSON.parse(json_str);
            if(hold_lst.length == 0){
                callback(ERROR_hold_lst_is_empty);
                return;                
            }
            var ds_lst = result;
            if(ds_lst.length != 0){
                callback(ERROR_ds_lst_is_not_empty);
                return;
            }
            var hold_select_ui_b = hold_select_ui.exe.bind(hold_select_ui.exe,hold_lst);
            async.waterfall([hold_select_ui_b],function(error,result){
                if(error){
                    callback(error);
                    return;
                }

                load_hold(hold_lst,get_hold_index(result,hold_lst),callback)
            })
        });
    }

    return{
        exe:exe,
        ERROR_ds_lst_is_not_empty:ERROR_ds_lst_is_not_empty,
        ERROR_hold_lst_is_empty:ERROR_hold_lst_is_empty
    }
})