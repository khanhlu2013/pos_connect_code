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
	var mod = angular.module('group_app/service/edit',
	[
		 'group_app/service/prompt'
		,'group_app/service/api'
	]);
	mod.factory('group_app/service/edit',
	[
		 '$http'
		,'$q'
		,'group_app/service/prompt'
		,'group_app/service/api'
	,function(
		 $http
		,$q
		,group_prompt
		,api
	){
		return function(original_group){
			var defer = $q.defer();

			api.get_item(original_group.id)
			.then(
				function(group){ 
				 	return group_prompt(group); 
				}
				,function(reason){
					defer.reject(reason); 
				}
			)
			.then(
				function(prompt_data){
					api.edit_item(prompt_data,original_group.id)
					.then(
						function(group){
							defer.resolve(group);
						}
						,function(reason){
							defer.reject(reason);
						}
					)
 				},
				function(reason){
					defer.reject(reason);
				}
			);

			return defer.promise;
 		}
 	}])
})