define(
[
	'angular'
	//--
	,'service/ui'
]
,function
(
	angular
)
{
	var mod = angular.module('payment_type_app/service/edit',['service/ui']);
	mod.factory('payment_type_app/service/edit',
	[
		 '$http'
		,'$q'
		,'service/ui/prompt'
		,'service/ui/alert'
	,function(
		 $http
		,$q
		,prompt_service
		,alert_service
	){
		return function(pt){
			var message = 'edit' + pt.name
			var prefill = pt.name
			prompt_promise = prompt_service(message,prefill,false/*is_null_allow*/,false/*is_float*/);
			var edit_promise = prompt_promise.then(
				function(data){
					pt.name=data;

					var promise_ing = $http({
						url:'/payment_type/update_angular',
						method:'POST',
						data:{
							pt:JSON.stringify(pt)
						}
							
					})
					var promise_ed = promise_ing.then(
						function(data){
							return data.data;
						},
						function(reason){
							return $q.reject('edit payment type ajax error');
						}
					)
					return promise_ed;
				},
				function(reason){
					return $q.reject(reason);
				}
			);
			return edit_promise;
		}
	}]);
})