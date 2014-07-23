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
	var mod = angular.module('shortcut_app/service/create',['service.ui']);
	mod.factory('shortcut_app/service/create',['$http','$q','service.ui.prompt',function($http,$q,prompt_service){
		return function(position){
			var prompt_promise = prompt_service('create new shortcut',null/*prefill*/,false/*is_null_allow*/,false/*is_float*/);
			var create_promise = prompt_promise.then(
				function(data){
					var promise_ing = $http({
						url:'sale_shortcut/parent_create_angular',
						method:'POST',
						data:{
							position:position,
							caption:data
						}
					})
					var promise_ed = promise_ing.then(
						function(data){
							return data.data;
						},
						function(reason){
							return $q.reject('create shortcut ajax error');
						}
					)
					return promise_ed;
				},
				function(reason){
					return $q.reject(reason);
				}
			);
			return create_promise;
		}
 	}])
})