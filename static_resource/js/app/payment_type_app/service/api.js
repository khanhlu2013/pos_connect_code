define(
[
    'angular'
    //---
    ,'app/payment_type_app/model/Payment_type'
]
,function
(
    angular
)
{
    var mod = angular.module('payment_type_app/service/api',['payment_type_app/model']);
    mod.factory('payment_type_app/service/api',['$http','$q','payment_type_app/model/Payment_type',function($http,$q,Payment_type){
    	return{
    		get_lst:function(){
                var promise_ing = $http({
                    url:'/payment_type/get',
                    method:'GET',                       
                });
                var promise_ed = promise_ing.then(
                    function(data){
                        return data.data.map(Payment_type.build);
                    },
                    function(reason){
                        return $q.reject('get payment type list ajax error');
                    }
                );
                return promise_ed;
            }
    	}
    }])
})