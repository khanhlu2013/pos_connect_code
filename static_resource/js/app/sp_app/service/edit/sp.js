define(
[
	'angular'
	//----
	,'app/sp_app/service/prompt'
	,'service/ui'
]
,function
(
	angular
)
{
	var mod = angular.module('sp_app.service.edit.sp',['sp_app.service.prompt','service.ui']);
	mod.factory('sp_app.service.edit.sp',['$http','$filter','sp_app.service.prompt','service.ui.alert',function($http,$filter,prompt_service,alert_service){
		return function(sp){
			var promise = prompt_service(sp,null/*suggest_product*/,null/*duplicate_sp*/,null/*sku*/);
			promise.then(
				function(prompt_result){
					var promise =  $http({
						url:'product/update_sp_angular',
						method: 'POST',
						data:{sp:JSON.stringify(prompt_result.sp)}
					});

					promise.then(
						function(data){
							var processed_data = $filter('sp_lst_str_2_float')([data.data])[0];
							angular.copy(processed_data,sp);
						},
						function(){
							alert_service('alert','update product ajax error');
						}
					)
 				},
				function(reason){
					alert_service('alert',reason,'red');
				}	
			)			
		}
	}]);
})