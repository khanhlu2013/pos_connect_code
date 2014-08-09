define(
[
	'angular'
	//---
	,'app/mix_match_app/service/prompt'
	,'app/mix_match_app/service/api'
]
,function
(
	angular
)
{
	var mod = angular.module('mix_match_app/service/edit',
	[
		'mix_match_app/service/prompt',
		'mix_match_app/service/api'
	]);
	mod.factory('mix_match_app/service/edit',
	[
		'$q',
		'$http',
		'$filter',
		'mix_match_app/service/prompt',
		'mix_match_app/service/api',
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