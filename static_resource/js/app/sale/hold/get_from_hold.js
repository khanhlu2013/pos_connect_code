define(
[
     'lib/error_lib'
    ,'lib/async'
    ,'lib/ajax_helper'
    ,'app/sale/displaying_scan/displaying_scan_lst_getter'
    ,'app/sale/scan/pid_scanner'
    ,'constance'
]
,function
(
     error_lib
    ,async
    ,ajax_helper
    ,ds_lst_getter
    ,pid_scanner
    ,constance
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
                continue;
            }
            var pid_scanner_b = pid_scanner.exe.bind(pid_scanner.exe,ds.store_product.product_id,ds.qty,STORE_IDB);
            func_lst.push(pid_scanner_b);
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

            if(hold_lst.length == 1){
                load_hold(hold_lst,0/*index*/,callback);
            }else{
                callback('tobe implemented');
            }
        });
    }

    return{
        exe:exe,
        ERROR_ds_lst_is_not_empty:ERROR_ds_lst_is_not_empty,
        ERROR_hold_lst_is_empty:ERROR_hold_lst_is_empty
    }
})