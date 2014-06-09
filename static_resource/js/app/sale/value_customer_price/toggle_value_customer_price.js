define(
[
     'lib/error_lib'
    ,'lib/async'
    ,'lib/ajax_helper'
    ,'lib/ui/ui'
    ,'app/sale/displaying_scan/displaying_scan_lst_getter'
    ,'app/sale/displaying_scan_modifier/displaying_scan_modifier'
    ,'app/sale/displaying_scan_modifier/Instruction'
    ,'app/sale/value_customer_price/value_customer_price_util'
]
,function
(
     error_lib
    ,async
    ,ajax_helper
    ,ui
    ,ds_lst_getter
    ,ds_modifier
    ,Instruction
    ,vcp_util
)
{
    var TAX_RATE = null;
    var MM_LST = null;
    var STORE_IDB = null;
    var ERROR_ds_lst_is_empty = 'ERROR_ds_lst_is_empty';

    function get_current_is_use_value_customer_price(){
        var json_str = localStorage.getItem()
    }

    function exe(tax_rate,mm_lst,store_idb,callback){
        TAX_RATE = tax_rate;
        MM_LST = mm_lst;
        STORE_IDB = store_idb;

        var ds_lst_getter_b = ds_lst_getter.bind(ds_lst_getter,TAX_RATE,MM_LST,STORE_IDB);
        async.waterfall([ds_lst_getter_b],function(error,result){
            if(error){
                callback(error);
                return;
            }

            var ds_lst = result;
            if(ds_lst.length == 0){
                callback(ERROR_ds_lst_is_empty);
                return;
            }

            var cur_vcp = vcp_util.get_is_use_value_customer_price();
            var func_lst = [];
            for(var i = 0;i<ds_lst.length;i++){
                var ds = ds_lst[i];

                if(ds.store_product != null && ds.store_product.value_customer_price != null){
                    var new_price = cur_vcp ? ds.store_product.price : ds.store_product.value_customer_price;
                    var instruction = new Instruction(false/*not delete*/,ds.qty,new_price,ds.discount)
                    var ds_modifier_b = ds_modifier.bind(ds_modifier,TAX_RATE,MM_LST,STORE_IDB,i,instruction);
                    func_lst.push(ds_modifier_b);
                }
            }
            vcp_util.toogle_is_use_value_customer_price();
            
            if(func_lst.length != 0){
                async.series(func_lst,function(error,result){
                    callback(error);
                });
            }else{
                callback(null);
            }
        })
    }

    return{
        exe:exe,
        ERROR_ds_lst_is_empty:ERROR_ds_lst_is_empty
    }
})