define(
[
	'angular'
]
,function
(
	angular
)
{
	var mod = angular.module('group_app.service.create',['group_app.service.prompt']);
	mod.factory('group_app.service.create',['$q','$http','group_app.service.prompt',function($q,$http,prompt_service){
		return function(){
			var prompt_promise = prompt_service(null);
			var create_promise = prompt_promise.then(
				function(group_prompt_result){
					var promise = $http({
						url:'/group/insert_angular',
						method:'POST',
						data:{group:JSON.stringify(group_prompt_result)}
					});
					return promise.then(
						function(data){
							var defer = $q.defer();defer.resolve(data.data);return defer.promise;
						},
						function(){
							return $q.reject('insert ajax error');
						}
					)
				},
				function(reason){
					return $q.reject(reason);
				}
			);

			return create_promise;
		}
	}])
})