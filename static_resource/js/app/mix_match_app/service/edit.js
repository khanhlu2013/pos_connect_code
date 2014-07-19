define(
[
	'angular'
	//---
	,'app/mix_match_app/service/prompt'
]
,function
(
	angular
)
{
	var mod = angular.module('mix_match_app/service/edit',['mix_match_app/service/prompt']);
	mod.factory('mix_match_app/service/edit',['$q','$http','mix_match_app/service/prompt',function($q,$http,prompt_service){
		return function(mm){
			var prompt_promise = prompt_service(mm);
			var edit_promise = prompt_promise.then(
				function(data){
					var promise_ing = $http({
						url:'/mix_match/edit_angular',
						method:'POST',
						data:{
							mix_match:JSON.stringify(data)
						}
					})
					var promise_ed = promise_ing.then(
						function(data){
							return data.data
						},
						function(reason){
							return $q.reject('edit mix match ajax error');
						}
					);
					return promise_ed;
				},
				function(reason){
					return $q.reject(reason);
				}
			)
			return edit_promise;
		}
	}]);
})