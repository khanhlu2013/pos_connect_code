define(function(){

	function trim(number){
		return +number.toFixed(5);
	}

	function round_2_decimal(number){
		return +number.toFixed(2);
	}

	function prompt_integer(message,prefill,error_message){
		var str = prompt(message,prefill);
		if(is_integer(str)){
			return parseInt(str);
		}else{
			return null;
		}
	}

	function is_integer(str) {
	    return parseInt(str) % 1 == 0;
	}

	function prompt_positive_integer(message,prefill,error_message){
		var str = prompt(message,prefill);
		if(str == null){
			return null;
		}else if(is_positive_integer(str)){
			return parseInt(str);
		}else{
			if(error_message){
				alert(error_message);
			}
			return null;
		}
	}
	
	function prompt_positive_double(message,prefill,error_message){
		var str = prompt(message,prefill);
		if(str == null){
			return null;
		}else{
 			if(is_positive_double(str)){
				return parseFloat(str);
			}else if(error_message){
				alert(error_message);
				return null;
 			}
		}
	}

	function is_positive_double(str){
		if(str == null){
			return false;
		}else{
			if(isNaN(str)){
				return false;
			}else{
				var number = parseFloat(str);
				if(number >= 0){
					return true;
				}else{
					return false;
				}
			}
		}
	}

	function is_positive_integer(str){
		var intRegex = /^\d+$/;
		return intRegex.test(str)
	}

    function get_mode(array)
    {
        if(array.length == 0)
            return null;
        var modeMap = {};
        var maxEl = array[0], maxCount = 1;
        for(var i = 0; i < array.length; i++)
        {
            var el = array[i];
            if(modeMap[el] == null)
                modeMap[el] = 1;
            else
                modeMap[el]++;  
            if(modeMap[el] > maxCount)
            {
                maxEl = el;
                maxCount = modeMap[el];
            }
        }
        return maxEl;
    }

    function get_median(values) {

        if(values.length == 0){
            return 0;
        }

        values.sort( function(a,b) {return a - b;} );
        var half = Math.floor(values.length/2); 
        if (values.length % 2) { return values[half]; } 
        else { return (values[half-1] + values[half]) / 2.0; } 
    } 

	return {
		 prompt_positive_integer:prompt_positive_integer
		,is_positive_integer:is_positive_integer
		,prompt_positive_double:prompt_positive_double
		,is_positive_double:is_positive_double
		,round_2_decimal:round_2_decimal
		,trim:trim
		,prompt_integer:prompt_integer
		,get_mode:get_mode
		,get_median:get_median
	}
})
