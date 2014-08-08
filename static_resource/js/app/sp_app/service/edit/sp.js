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
		'sp_app/service/api_sp',
	function(
		$http,
		$filter,
		prompt_service,
		alert_service,
		api_sp
	){
		return function(sp){
			var promise = prompt_service(sp,null/*suggest_product*/,null/*duplicate_sp*/,null/*sku*/);
			promise.then(
				function(prompt_result){
					api_sp.update(prompt_result.sp).then(
						 function(updated_sp){ angular.copy(updated_sp,sp);}
						,function(reason){ alert_service('alert',reason,'red');}
					)
 				}
 				,function(reason){ alert_service('alert',reason,'red');}
			)			
		}
	}]);
})