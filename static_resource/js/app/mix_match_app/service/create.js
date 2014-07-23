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
	var mod = angular.module('mix_match_app/service/create',['mix_match_app/service/prompt']);
	mod.factory('mix_match_app/service/create',['$http','$q','$filter','mix_match_app/service/prompt',function($http,$q,$filter,prompt_service){
		return function(){
			var prompt_promise = prompt_service(null);
			var create_promise = prompt_promise.then(
				function(data){
					var promise_ing = $http({
						url:'/mix_match/insert_angular',
						method:'POST',
						data:{
							mix_match:JSON.stringify(data)
						}
					})
					var promise_ed = promise_ing.then(
						function(data){
							return $filter("mix_match_app.filter.mm_item_str_2_float")(data.data);
						},
						function(reason){
							return $q.reject('create mix match ajax error');
						}
					)
					return promise_ed;
				},
				function(reason){
					$q.reject(reason);
				}
			);
			return create_promise;			
		}
	}])
})