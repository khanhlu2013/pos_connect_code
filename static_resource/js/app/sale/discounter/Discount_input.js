define(
    [
         'lib/number/number'
        ,'app/sale/displaying_scan/displaying_scan_util'
    ]
    ,function
    (
         number
        ,ds_util
    )
{

	function Input(input_str){
        this.number = null;
        this.is_percentage = null;

        var dictionary = input_str_2_dictionary(input_str);
        if(dictionary!=null){
            this.number = dictionary.number;
            this.is_percentage = dictionary.is_percentage;
        }
	};
    
	Input.prototype = {
    	 constructor: Input

    	,is_valid: function () {
            return this.number !=null && this.is_percentage!=null;
        }
        ,is_percentage: function () {
            if(!this.is_valid()){
                return null;  
            }

            return this.is_percentage;
        }
    	,get_discount: function (ds_lst) {
            if(!this.is_valid()){
                return null;  
            }

            if(this.is_percentage){
                if(ds_lst == null || ds_lst.length==0){
                    return null;
                }else{
                    var discount_price = 0;
                    for(var i = 0;i<ds_lst.length;i++){
                        discount_price += (ds_lst[i].get_total_discount_price() * ds_lst[i].qty);
                    }
                    var discount = discount_price * this.number / 100;
                    return number.round_2_decimal(discount);
                }
            }else{
                return this.number;
            }
        }
    };


    function input_str_2_dictionary(input_str){
        if(input_str == null){
            return null;
        }

        input_str = input_str.trim();
        var last_char = input_str.substr(input_str.length - 1);
        if(last_char == '%'){
            var number_str = input_str.substring(0, input_str.length - 1);
            number_str = number_str.trim();
            if(number.is_positive_double(number_str)){
                return {is_percentage:true,number:parseFloat(number_str)}
            }else{
                return null;
            }
        }else if(number.is_positive_double(input_str)){
            return {is_percentage:false,number:parseFloat(input_str)}
        }else{
            return null;
        }
    }

    return Input;
});




            