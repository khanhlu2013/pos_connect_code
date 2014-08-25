define(
[
	'angular'
	//----
	,'service/ui'	
	,'app/sp_app/service/prompt'
 	,'app/sp_app/service/api_sp'
]
,function
(
	angular
)
{
	var mod = angular.module('sp_app/service/edit/sp',
	[
		'sp_app/service/prompt',
		'service/ui',
		'sp_app/service/api_sp'
	]);
	mod.factory('sp_app/service/edit/sp',
	[
		'$http',
		'$filter',
		'$q',
		'sp_app/service/prompt',
		'service/ui/alert',
		'sp_app/service/api_sp',
	function(
		$http,
		$filter,
		$q,
		prompt_service,
		alert_service,
		api_sp
	){
		return function(sp){
			var promise_ing = prompt_service(sp,null/*suggest_product*/,null/*duplicate_sp*/,null/*sku*/);
			var promise_ed = promise_ing.then(
				 function(prompt_result){ return api_sp.update(prompt_result.sp);}
 				,function(reason){ return $q.reject(reason); }
			)			
			return promise_ed;
		}
	}]);
})


					