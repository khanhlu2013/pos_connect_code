var mod = angular.module('share.util');
mod.factory('share.util.number',function(){
    function round_float_2_decimal(num){
        return parseFloat(num.toFixed(2));
    }
    function round_float_1_decimal(num){
        return parseFloat(num.toFixed(1));
    }      

    return{
        round_float_1_decimal:round_float_1_decimal,
        round_float_2_decimal:round_float_2_decimal
    }    
})