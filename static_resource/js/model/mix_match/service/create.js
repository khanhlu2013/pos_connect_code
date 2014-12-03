define(
[
	'angular'
	//---
	,'model/mix_match/service/prompt'
	,'model/mix_match/model'
]
,function
(
	angular
)
{
	var mod = angular.module('mix_match/service/create',
	[
		'mix_match/service/prompt',
		'mix_match/api'
	]);
	mod.factory('mix_match/service/create',
	[
		'$http',
		'$q',
		'$filter',
		'mix_match/service/prompt',
		'mix_match/api',
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