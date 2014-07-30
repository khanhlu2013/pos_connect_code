define(
[
	'angular'
	//----
	,'service/ui'	
	,'app/sp_app/service/prompt'
 	,'app/sp_app/service/api_crud'
]
,function
(
	angular
)
{
	var mod = angular.module('sp_app.service.edit.sp',
	[
		'sp_app.service.prompt',
		'service.ui'
	]);
	mod.factory('sp_app.service.edit.sp',
	[
		'$http',
		'$filter',
		'sp_app.service.prompt',
		'service.ui.alert',
		'sp_app/service/api_crud',
	function(
		$http,
		$filter,
		prompt_service,
		alert_service,
		api_crud
	){
		return function(sp){
			var promise = prompt_service(sp,null/*suggest_product*/,null/*duplicate_sp*/,null/*sku*/);
			promise.then(
				function(prompt_result){
					api_crud.update(prompt_result).then(
						 function(updated_sp){ angular.copy(updated_sp,sp);}
						,function(reason){ alert_service('alert',reason,'red');}
					)
 				}
 				,function(reason){ alert_service('alert',reason,'red');}
			)			
		}
	}]);
})