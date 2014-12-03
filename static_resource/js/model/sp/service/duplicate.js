define(
[
	'angular'
	//----
	,'model/sp/service/prompt'
	,'model/sp/api_crud'
]
,function
(
	angular
)
{
	var mod = angular.module('sp/service/duplicate',
	[
		 'sp/service/prompt'
		,'sp/api_crud'
	]);
	mod.factory('sp/service/duplicate',
	[
		'$http',
		'$filter',
		'$q',
		'sp/service/prompt',
		'sp/api_crud',
	function(
		$http,
		$filter,
		$q,
		prompt_service,
		sp_crud_api
	){
		return function(sp){
			var prompt_promise = prompt_service(null/*original_sp*/,null/*suggest_product*/,sp/*duplicate_sp*/,null/*sku*/,false/*is_operate_offline*/);
			var duplicate_promise = prompt_promise.then(
				 function(prompt_result){ return sp_crud_api.insert_new(prompt_result.sp,prompt_result.sku); }
				,function(reason){ return $q.reject(reason);}
			);
			return duplicate_promise;			
		}
	}]);
})