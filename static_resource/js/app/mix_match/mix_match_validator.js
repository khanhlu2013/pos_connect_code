define(
    [
        'lib/number/number'
    ]
    ,function
    (
        number
    )
{

    var ERROR_MIX_MATCH_VALIDATION_NAME = 'ERROR_MIX_MATCH_VALIDATION_NAME';
    var ERROR_MIX_MATCH_VALIDATION_QTY = 'ERROR_MIX_MATCH_VALIDATION_QTY';
    var ERROR_MIX_MATCH_VALIDATION_OTD_PRICE = 'ERROR_MIX_MATCH_VALIDATION_OTD_PRICE';
    var ERROR_MIX_MATCH_VALIDATION_CHILD_EMPTY = 'ERROR_MIX_MATCH_VALIDATION_CHILD_EMPTY';

    function validate(result){

        var error_lst = new Array();
        var name = result.name;
        var qty = result.qty;
        var otd_price = result.otd_price;
        var mix_match_child_sp_lst = result.mix_match_child_sp_lst;

        if(!name || name.trim().length == 0){
            error_lst.push(ERROR_MIX_MATCH_VALIDATION_NAME);
        }

        if(!qty || !number.is_positive_integer(qty)){
            error_lst.push(ERROR_MIX_MATCH_VALIDATION_QTY);
        }

        if(!otd_price || !number.is_positive_double(otd_price)){
            error_lst.push(ERROR_MIX_MATCH_VALIDATION_OTD_PRICE);
        }

        if(mix_match_child_sp_lst.length == 0){
            error_lst.push(ERROR_MIX_MATCH_VALIDATION_CHILD_EMPTY);
        }
        return error_lst;
    }

    return{
         validate:validate
        ,ERROR_MIX_MATCH_VALIDATION_NAME:ERROR_MIX_MATCH_VALIDATION_NAME 
        ,ERROR_MIX_MATCH_VALIDATION_QTY:ERROR_MIX_MATCH_VALIDATION_QTY
        ,ERROR_MIX_MATCH_VALIDATION_OTD_PRICE:ERROR_MIX_MATCH_VALIDATION_OTD_PRICE
        ,ERROR_MIX_MATCH_VALIDATION_CHILD_EMPTY:ERROR_MIX_MATCH_VALIDATION_CHILD_EMPTY
    }
});