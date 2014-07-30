define(
[
	'angular'
	//----
	,'app/sp_app/service/prompt'
	,'app/sp_app/service/api_crud'
]
,function
(
	angular
)
{
	var mod = angular.module('sp_app.service.duplicate',['sp_app.service.prompt','sp_app/service/api_crud']);
	mod.factory('sp_app.service.duplicate',
	[
		'$http',
		'$filter',
		'$q',
		'sp_app.service.prompt',
		'sp_app/service/api_crud',
	function(
		$http,
		$filter,
		$q,
		prompt_service,
		api_crud
	){
		return function(sp){
			var prompt_promise = prompt_service(null/*original_sp*/,null/*suggest_product*/,sp/*duplicate_sp*/,null/*sku*/);
			var duplicate_promise = prompt_promise.then(
				 function(prompt_result){ return api_crud.insert_new(prompt_result.sp,prompt_result.sku); }
				,function(reason){ return $q.reject(reason);}
			);
			return duplicate_promise;			
		}
	}]);
})