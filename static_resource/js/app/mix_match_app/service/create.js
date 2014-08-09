define(
[
	'angular'
	//---
	,'app/mix_match_app/service/prompt'
	,'app/mix_match_app/model'
]
,function
(
	angular
)
{
	var mod = angular.module('mix_match_app/service/create',
	[
		'mix_match_app/service/prompt',
		'mix_match_app/service/api'
	]);
	mod.factory('mix_match_app/service/create',
	[
		'$http',
		'$q',
		'$filter',
		'mix_match_app/service/prompt',
		'mix_match_app/service/api',
	function(
		$http,
		$q,
		$filter,
		prompt_service,
		api
	){
		return function(){
			var prompt_promise = prompt_service(null);
			var create_promise = prompt_promise.then(
				 function(mm){ return api.create(mm)}
				,function(reason){ return $q.reject(reason);}
			);
			return create_promise;			
		}
	}])
})