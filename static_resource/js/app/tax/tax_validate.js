define(
[
    'lib/number/number'
]
,function
(
	number
)
{
	var ERROR_TAX_RATE_VALIDATION_TAX_RATE = 'ERROR_TAX_RATE_VALIDATION_TAX_RATE';

    function exe(tax_rate){
        var error_lst = new Array();

        if(tax_rate == null || tax_rate == undefined || !number.is_positive_double(tax_rate)){
            error_lst.push(ERROR_TAX_RATE_VALIDATION_TAX_RATE);
        }
        return error_lst;
    }	

    return{
    	 exe:exe
    	,ERROR_TAX_RATE_VALIDATION_TAX_RATE:ERROR_TAX_RATE_VALIDATION_TAX_RATE
    }
});