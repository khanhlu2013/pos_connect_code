define(
[
	'angular'
	//---
	,'model/mix_match/service/prompt'
	,'model/mix_match/api'
]
,function
(
	angular
)
{
	var mod = angular.module('mix_match/service/edit',
	[
		'mix_match/service/prompt',
		'mix_match/api'
	]);
	mod.factory('mix_match/service/edit',
	[
		'$q',
		'$http',
		'$filter',
		'mix_match/service/prompt',
		'mix_match/api',
	function(
		$q,
		$http,
		$filter,
		prompt_service,
		api
	){
		return function(mm){
			var prompt_promise = prompt_service(mm);
			var edit_promise = prompt_promise.then(
				 function(data){ return api.edit(data)}
				,function(reason){ return $q.reject(reason);}
			)
			return edit_promise;
		}
	}]);
})