define(
[
	'angular'
	//---
	,'model/group/api'
]
,function
(
	angular
)
{
	var mod = angular.module('group/service/create',
	[
		 'group/service/prompt'
		,'group/api'
	]);
	mod.factory('group/service/create',
	[
		 '$q'
		,'group/service/prompt'
		,'group/api'
	,function
	(
		 $q
		,prompt_service
		,api
	){
		return function(){
			var prompt_promise = prompt_service(null);
			var create_promise = prompt_promise.then(
				 function(group_prompt_result){ return api.create(group_prompt_result);}
				,function(reason){return $q.reject(reason);}
			);
 			return create_promise;
		}
	}])
})