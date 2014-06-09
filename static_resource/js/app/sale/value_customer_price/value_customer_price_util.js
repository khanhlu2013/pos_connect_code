define(
[
     'lib/error_lib'
    ,'lib/async'
    ,'lib/ajax_helper'
    ,'lib/ui/ui'
    ,'constance'
]
,function
(
     error_lib
    ,async
    ,ajax_helper
    ,ui
    ,constance
)
{
    function _helper_set_vcp(bool_val){
        localStorage.setItem(constance.IS_USE_VALUE_CUSTOMER_PRICE,bool_val)
    }

    function get_is_use_value_customer_price(){
        var result;

        var json_str = localStorage.getItem(constance.IS_USE_VALUE_CUSTOMER_PRICE);
        if(json_str == null){
            result = false;
            _helper_set_vcp(false);
        }else{
            result = JSON.parse(json_str);
        }
        return result;
    }

    function toogle_is_use_value_customer_price(){
        var bool = get_is_use_value_customer_price();
        _helper_set_vcp(!bool);
    }

    function reset_is_use_value_customer_price(){
        _helper_set_vcp(false);
    }

    return{
        get_is_use_value_customer_price:get_is_use_value_customer_price,
        toogle_is_use_value_customer_price:toogle_is_use_value_customer_price,
        reset_is_use_value_customer_price:reset_is_use_value_customer_price
    }
})