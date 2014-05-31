define(
[
     'lib/error_lib'
    ,'lib/async'
    ,'lib/ajax_helper'

]
,function
(
     error_lib
    ,async
    ,ajax_helper
)
{
    function compute_amount(sp,field){

        //NOT A KIT
        if(sp.breakdown_assoc_lst == undefined || sp.breakdown_assoc_lst.length == 0){
            var amount_str = sp[field];
            return (amount_str == null ? 0.0 : parseFloat(amount_str))
        }

        //A KIT
        var result = 0.0;
        for(var i = 0;i<sp.breakdown_assoc_lst.length;i++){
            var assoc = sp.breakdown_assoc_lst[i];
            result += (compute_amount(assoc.breakdown,field) * assoc.qty);
        }

        return result;
    }

    function get_recursive_pid_lst(cur_sp,is_bd_or_kit){
        /*
            PARAM: 
                cur_sp: a json received from server
                is_bd_or_kit: true: we look for children, otherwise, we look for parent

            RETURN:  a list of all pid that are children or parent of cur_sp
        */
        var result = [];
        var assoc_lst = is_bd_or_kit ? cur_sp.breakdown_assoc_lst : cur_sp.kit_assoc_lst;

        for(var i = 0;i<assoc_lst.length;i++){
            sp = is_bd_or_kit ? assoc_lst[i].breakdown : assoc_lst[i].kit;
            result.push(sp.product_id);
            result.push.apply(result,get_recursive_pid_lst(sp,is_bd_or_kit));
        }
        return result
    }

    return{
        get_recursive_pid_lst:get_recursive_pid_lst,
        compute_amount:compute_amount
    }
})