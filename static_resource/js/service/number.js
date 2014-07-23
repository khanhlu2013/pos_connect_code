define(
[
    'angular'
]
,function
(
    angular
)
{
    var mod = angular.module('service/number',[]);
    mod.factory('service/number/str_2_float',function(){
    	return function(str){
	        /*
	            if null return 0
	            if "" return 0
	            return parseFloat
	        */
	        if(str == null){
	            return 0.0;
	        }
	        if(str.trim().length == 0){
	            return 0.0;
	        }
	        return parseFloat(str.trim())
    	}
    })
})