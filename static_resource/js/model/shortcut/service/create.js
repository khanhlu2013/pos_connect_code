define(
[
	'angular'
	//--
	,'service/ui'
]
,function
(
	angular
)
{
	var mod = angular.module('shortcut/service/create',['service/ui']);
	mod.factory('shortcut/service/create',
	[
		 '$http'
		,'$q'
		,'service/ui/prompt'
	,function(
		 $http
		,$q
		,prompt_service
	){
		return function(position){
			var defer = $q.defer();

			prompt_service('create new shortcut',null/*prefill*/,false/*is_null_allow*/,false/*is_float*/)
			.then(
				function(data){
					$http({
						url:'/sale_shortcut/parent_create_angular',
						method:'POST',
						data:{
							position:position,
							caption:data
						}
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
			);
			return defer.promise;
		}
 	}])
})