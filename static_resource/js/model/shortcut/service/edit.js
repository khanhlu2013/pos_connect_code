define(
[
	'angular'
	//---
	,'service/ui'


]
,function
(
	angular
)
{	
	var mod = angular.module('shortcut/service/edit',['service/ui']);
	mod.factory('shortcut/service/edit',
	[
		 '$http'
		,'$q'
		,'service/ui/prompt'
	,function(
		 $http
		,$q
		,prompt_service
	){
		return function(ori_shortcut){
			var defer = $q.defer();
			var shortcut = angular.copy(ori_shortcut);
			
			prompt_service('edit shortcut',shortcut.caption/*prefill*/,true/*is_null_allow*/,false/*is_float*/)
			.then(
				function(data){
					shortcut.caption=data;
					$http({
						url:'/sale_shortcut/parent_update_angular',
						method:'POST',
						data:{ shortcut:JSON.stringify(shortcut)}
					})
					.then(
						function(data){ 
						 	defer.resolve(data.data); 
						}
						,function(reason){
							defer.reject(reason);
						}
					)
				},
				function(reason){ 
					defer.reject(reason);
				}
			)
			return defer.promise;
		}
	}])
})