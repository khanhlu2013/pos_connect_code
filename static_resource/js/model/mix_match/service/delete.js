define(
[
	'angular'
]
,function
(
	angular
)
{
	var mod = angular.module('mix_match/service/delete',[]);
	mod.factory('mix_match/service/delete',
	[
		 '$http'
		,'$q'
	,function(
		 $http
		,$q
	){
		return function(mm){
			var defer = $q.defer();
			$http({
				url:'/mix_match/delete',
				method:'POST',
				data:{
					id:mm.id
				}
			})
			.then(
				function(data){
					defer.resolve(data.data);
				},
				function(reason)
				{
					defer.reject(reason);
				}
			)
			return defer.promise;
		}
	}])
})