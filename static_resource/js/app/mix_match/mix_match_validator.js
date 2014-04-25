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
    var ERROR_MIX_MATCH_VALIDATION_UNIT_DISCOUNT = 'ERROR_MIX_MATCH_VALIDATION_UNIT_DISCOUNT';
    var ERROR_MIX_MATCH_VALIDATION_CHILD_EMPTY = 'ERROR_MIX_MATCH_VALIDATION_CHILD_EMPTY';
    var ERROR_MIX_MATCH_VALIDATION_CHILD_UNIFORM = 'ERROR_MIX_MATCH_VALIDATION_CHILD_UNIFORM';


    function validate(result){

        var error_lst = new Array();
        var name = result.name;
        var qty = result.qty;
        var unit_discount = result.unit_discount;
        var mix_match_child_sp_lst = result.mix_match_child_sp_lst;

        if(!name){
            error_lst.push(ERROR_MIX_MATCH_VALIDATION_NAME);
        }

        if(!qty || !number.is_positive_integer(qty)){
            error_lst.push(ERROR_MIX_MATCH_VALIDATION_QTY);
        }

        if(!unit_discount || !number.is_positive_double(unit_discount)){
            error_lst.push(ERROR_MIX_MATCH_VALIDATION_UNIT_DISCOUNT);
        }

        if(mix_match_child_sp_lst.length == 0){
            error_lst.push(ERROR_MIX_MATCH_VALIDATION_CHILD_EMPTY);
        }else if(mix_match_child_sp_lst.length > 1){
            var base = mix_match_child_sp_lst[0];
            for(var i = 1;i<mix_match_child_sp_lst.length;i++){
                if(
                       mix_match_child_sp_lst[i].price != base.price
                    || mix_match_child_sp_lst[i].crv != base.crv
                    || mix_match_child_sp_lst[i].is_taxable != base.is_taxable
                )
                {
                    error_lst.push(ERROR_MIX_MATCH_VALIDATION_CHILD_UNIFORM);
                    break;
                }
            }
        }
        return error_lst;
    }

    return{
         validate:validate
        ,ERROR_MIX_MATCH_VALIDATION_NAME:ERROR_MIX_MATCH_VALIDATION_NAME 
        ,ERROR_MIX_MATCH_VALIDATION_QTY:ERROR_MIX_MATCH_VALIDATION_QTY
        ,ERROR_MIX_MATCH_VALIDATION_UNIT_DISCOUNT:ERROR_MIX_MATCH_VALIDATION_UNIT_DISCOUNT
        ,ERROR_MIX_MATCH_VALIDATION_CHILD_EMPTY:ERROR_MIX_MATCH_VALIDATION_CHILD_EMPTY
        ,ERROR_MIX_MATCH_VALIDATION_CHILD_UNIFORM:ERROR_MIX_MATCH_VALIDATION_CHILD_UNIFORM
    }
});