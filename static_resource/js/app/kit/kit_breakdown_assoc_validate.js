define(
    [
        'lib/number/number'
    ]
    ,function
    (
        number
    )
{
    var ERROR_KIT_BREAKDOWN_ASSOC_VALIDATION_SP = 'ERROR_KIT_BREAKDOWN_ASSOC_VALIDATION_SP';
    var ERROR_KIT_BREAKDOWN_ASSOC_VALIDATION_QTY = 'ERROR_KIT_BREAKDOWN_ASSOC_VALIDATION_QTY';


    function exe(sp,qty){
        var error_lst = new Array();

        if(!sp){
            error_lst.push(ERROR_KIT_BREAKDOWN_ASSOC_VALIDATION_SP);
        }

        if(!number.is_positive_integer(qty)){
            error_lst.push(ERROR_KIT_BREAKDOWN_ASSOC_VALIDATION_QTY);
        }
        return error_lst;
    }

    return{
         exe:exe
        ,ERROR_KIT_BREAKDOWN_ASSOC_VALIDATION_SP:ERROR_KIT_BREAKDOWN_ASSOC_VALIDATION_SP 
        ,ERROR_KIT_BREAKDOWN_ASSOC_VALIDATION_QTY:ERROR_KIT_BREAKDOWN_ASSOC_VALIDATION_QTY
    }
});