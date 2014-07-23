define(
[
    'angular'
]
,function
(
    angular
)
{
    var mod = angular.module('payment_type_app/model',[]);
    mod.factory('payment_type_app/model/Payment_type',function(){
    	function Payment_type(id,name){
    		this.id = id;
    		this.name = name;
    	}

    	// Payment_type.prototype.get_fancy_name=function(){
    	// 	return 'xxx ->' + this.name + '<- xxx';
    	// }

    	Payment_type.build = function(data){
    		return new Payment_type(data.id,data.name);
    	}
    	return Payment_type;
    })
})