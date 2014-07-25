define(
[
	'angular'
	//---
	,'app/group_app/service/prompt'
	,'app/group_app/service/api'
]
,function
(
	angular
)
{
	var mod = angular.module('group_app.service.edit',
	[
		 'group_app.service.prompt'
		,'group_app/service/api'
	]);
	mod.factory('group_app.service.edit',
	[
		 '$http'
		,'$q'
		,'group_app.service.prompt'
		,'group_app/service/api'
	,function(
		 $http
		,$q
		,group_prompt
		,api
	){
		return function(original_group){
			var get_promise = api.get_item(original_group.id);

			var prompt_promise = get_promise.then(
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