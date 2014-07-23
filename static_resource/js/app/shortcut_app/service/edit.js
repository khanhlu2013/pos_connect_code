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
	var mod = angular.module('shortcut_app/service/edit',['service.ui']);
	mod.factory('shortcut_app/service/edit',['$http','$q','service.ui.prompt',function($http,$q,prompt_service){
		return function(ori_shortcut){
			var shortcut = angular.copy(ori_shortcut);
			
			var prompt_promise = prompt_service('edit shortcut',shortcut.caption/*prefill*/,true/*is_null_allow*/,false/*is_float*/);
			var edit_promise = prompt_promise.then(
				function(data){
					shortcut.caption=data;
					var promise_ing = $http({
						url:'sale_shortcut/parent_update_angular',
						method:'POST',
						data:{
							shortcut:JSON.stringify(shortcut)
						}
					})
					var promise_ed = promise_ing.then(
						function(data){
							return data.data;
						},
						function(reason){
							return $q.reject('edit shortcut ajax error');
						}
					)
					return promise_ed;
				},
				function(reason){
					return $q.reject(reason);
				}
			)
			return edit_promise;
		}
	}])
})