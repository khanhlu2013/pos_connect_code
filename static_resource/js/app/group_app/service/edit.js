define(
[
	'angular',
	//---
	'app/group_app/service/prompt'
]
,function
(
	angular
)
{
	var mod = angular.module('group_app.service.edit',['group_app.service.prompt']);
	mod.factory('group_app.service.edit',['$http','$q','group_app.service.prompt',function($http,$q,group_prompt){
		return function(original_group){
			if(original_group == null || original_group.id == null){
				var defer = $q.defer();
				defer.reject('must edit existing group with id');
				return defer.promise;
			}

			var get_ing_promise = $http({
				url:'/group/get_item',
				method:'GET',
				params:{group_id:original_group.id}
			});

			var get_ed_promise = get_ing_promise.then(
				function(get_ajax_data){
					var defer = $q.defer();
					defer.resolve(get_ajax_data.data);
					return defer.promise
				},
				function(){
					return $q.reject('get group item ajax error')
				}
			)

			var prompt_promise = get_ed_promise.then(
				function(group){
					return group_prompt(group);
				},
				function(reason){
					return $q.reject(reason);
				}
			);

			var update_promise = prompt_promise.then(
				function(prompt_data){
					var promise = $http({
						url:'/group/update_angular',
						method:'POST',
						data:{group:JSON.stringify(prompt_data),id:original_group.id}
					});

					return promise.then(
						function(data){
							var defer = $q.defer();defer.resolve(data.data);return defer.promise;
						},
						function(){
							return $q.reject('update group ajax error');
						}
					)
 				},
				function(reason){
					return $q.reject(reason);
				}
			);

			return update_promise;
 		}
 	}])
})