define(
[
	'app/mix_match/mix_match_validator'
]
,function
(
	mix_match_validator
)
{
	function calculate_total_price(result,tax_rate){
        var error_lst = mix_match_validator.validate(result);    
        if(
               error_lst.indexOf(mix_match_validator.ERROR_MIX_MATCH_VALIDATION_QTY) != -1
            || error_lst.indexOf(mix_match_validator.ERROR_MIX_MATCH_VALIDATION_UNIT_DISCOUNT) != -1
            || error_lst.indexOf(mix_match_validator.ERROR_MIX_MATCH_VALIDATION_CHILD_EMPTY) != -1
            || error_lst.indexOf(mix_match_validator.ERROR_MIX_MATCH_VALIDATION_CHILD_UNIFORM) != -1
        ){
            return null;
        }   

        var reg_price = Number(result.mix_match_child_sp_lst[0].price);
        var crv = Number(result.mix_match_child_sp_lst[0].crv);
        var is_taxable = result.mix_match_child_sp_lst[0].is_taxable;
        var unit_discount = Number(result.unit_discount);
        var qty = Number(result.qty);

        var price_without_tax = reg_price + crv - unit_discount
        var tax_amount = (is_taxable ? (price_without_tax * tax_rate / 100) : 0.0);

        return (price_without_tax + tax_amount) * qty;
	}

 	return {
 		calculate_total_price:calculate_total_price
 	}
});