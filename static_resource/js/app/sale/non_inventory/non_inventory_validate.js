define(
    [
        'lib/number/number'
    ]
    ,function
    (
        number
    )
{
    var ERROR_NON_INVENTORY_VALIDATION_PRICE = 'ERROR_NON_INVENTORY_VALIDATION_PRICE';

    function exe(price,description){
        var error_lst = new Array();

        if(price == null || price == undefined || !number.is_positive_double(price)){
            error_lst.push(ERROR_NON_INVENTORY_VALIDATION_PRICE);
        }
        return error_lst;
    }

    return{
         exe:exe
        ,ERROR_NON_INVENTORY_VALIDATION_PRICE:ERROR_NON_INVENTORY_VALIDATION_PRICE 
    }
});