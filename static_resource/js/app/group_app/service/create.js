define(
[
	'angular'
	//---
	,'app/group_app/service/api'
]
,function
(
	angular
)
{
	var mod = angular.module('group_app/service/create',['group_app.service.prompt','group_app/service/api']);
	mod.factory('group_app/service/create',['$q','group_app.service.prompt','group_app/service/api',function($q,prompt_service,api){
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