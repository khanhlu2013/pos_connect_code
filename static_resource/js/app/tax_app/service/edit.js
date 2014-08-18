define(
[
	'angular'
	//-----
	,'service/ui'
]
,function
(
	angular
)
{
	var mod = angular.module('tax_app.service.edit',['service/ui']);

	mod.factory('tax_app.service.edit',
	[
		 '$http'
		,'$modal'
		,'$q'
		,'service/ui/prompt'
		,'service/ui/alert'
	,function(
		 $http
		,$modal
		,$q
		,prompt_service
		,alert_service
	){
		return function(){
			var tax_rate = localStorage.getItem('tax_rate');
			var promise = prompt_service('enter tax rate',tax_rate/*prefill*/,false/*null is not allow*/,true/*is float*/);
			promise.then(
				function(prompt_data){
					var promise_ing = $http({
						url:'/tax/update_angular',
						method:'POST',
						data:{
							tax_rate:prompt_data
						}
					});

					var promised_id = promise_ing.then(
						function(data){
							var return_tax_rate = JSON.parse(data.data);
							
							localStorage.setItem('tax_rate',return_tax_rate);
							return data.data;
						},
						function(reason){
							return $q.reject('set tax ajax error');
						}
					)
				},
				function(reason){
					return $q.reject(reason);
				}
			);
			return promise;
		}
	}]);
})
