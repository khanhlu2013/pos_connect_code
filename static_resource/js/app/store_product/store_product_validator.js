define(
	[
		'lib/number/number'
	]
	,function
	(
		number
	)
{

	var ERROR_STORE_PRODUCT_VALIDATION_NAME = 'ERROR_STORE_PRODUCT_VALIDATION_NAME';
	var ERROR_STORE_PRODUCT_VALIDATION_PRICE = 'ERROR_STORE_PRODUCT_VALIDATION_PRICE';
	var ERROR_STORE_PRODUCT_VALIDATION_CRV = 'ERROR_STORE_PRODUCT_VALIDATION_CRV';
	var ERROR_STORE_PRODUCT_VALIDATION_TAXABLE = 'ERROR_STORE_PRODUCT_VALIDATION_TAXABLE';
	var ERROR_STORE_PRODUCT_VALIDATION_SKU = 'ERROR_STORE_PRODUCT_VALIDATION_SKU';


	function validate(name,price,crv,is_taxable,sku_str,is_prompt_sku){
		var error_lst = new Array();

		if(name == null || name == undefined || name.trim().length == 0){
			error_lst.push(ERROR_STORE_PRODUCT_VALIDATION_NAME);
		}

		if(price == null || price == undefined || !number.is_positive_double(price)){
			error_lst.push(ERROR_STORE_PRODUCT_VALIDATION_PRICE);
		}

		if(crv != null && crv != undefined && typeof(crv) == 'string' && crv.trim().length != 0 && !number.is_positive_double(crv)){
			error_lst.push(ERROR_STORE_PRODUCT_VALIDATION_CRV);
		}

		if(is_taxable == null || is_taxable == undefined || typeof(is_taxable) !='boolean'){
			error_lst.push(ERROR_STORE_PRODUCT_VALIDATION_TAXABLE);
		}

		if(is_prompt_sku){
			if(sku_str == null || sku_str == undefined || sku_str.trim().length == 0){
				error_lst.push(ERROR_STORE_PRODUCT_VALIDATION_SKU);
			}			
		}


		return error_lst;
	}

	return{
		 validate:validate
		,ERROR_STORE_PRODUCT_VALIDATION_NAME:ERROR_STORE_PRODUCT_VALIDATION_NAME 
		,ERROR_STORE_PRODUCT_VALIDATION_PRICE:ERROR_STORE_PRODUCT_VALIDATION_PRICE
		,ERROR_STORE_PRODUCT_VALIDATION_CRV:ERROR_STORE_PRODUCT_VALIDATION_CRV
		,ERROR_STORE_PRODUCT_VALIDATION_TAXABLE:ERROR_STORE_PRODUCT_VALIDATION_TAXABLE
		,ERROR_STORE_PRODUCT_VALIDATION_SKU:ERROR_STORE_PRODUCT_VALIDATION_SKU
	}
});