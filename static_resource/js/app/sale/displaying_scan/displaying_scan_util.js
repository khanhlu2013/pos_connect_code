define(
[
	'lib/number/number'
]
,function
(
	number
)
{

	function get_line_total(ds_lst,tax_rate){
		var total = 0.0;

		for(var i = 0;i<ds_lst.length;i++){
			total += ds_lst[i].get_line_total(tax_rate);
		}

		return number.round_2_decimal(total);
	}

	return{
		get_line_total:get_line_total
	}
});