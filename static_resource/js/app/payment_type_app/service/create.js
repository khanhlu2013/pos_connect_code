define(
[
	'angular'
	//---
	,'service/ui'
]
,function
(
	angular
)
{
	var mod = angular.module('payment_type_app/service/create',['service/ui']);
	mod.factory('payment_type_app/service/create',
	[
		 '$http'
		,'$q'
		,'service/ui/prompt'
	,function(
		 $http
		,$q
		,prompt_service
	){
		return function(){
			var prompt_promise = prompt_service('create new payment type',null/*prefill*/,false/*is_null_allow*/,false/*is_float*/);
			var create_promise = prompt_promise.then(
				function(data){
					var promise_ing = $http({
						url:'/payment_type/insert',
						method:'POST',
						data:{
							name:data
						}
					});
					var promise_ed = promise_ing.then(
						function(data){
							return data.data;
						},
						function(reason){
							return $q.reject(reason);
						}
					)
					return promise_ed;
				},
				function(reason){
					return $q.reject(reason);
				}
			)
			return create_promise;
		}
 	}]);
})