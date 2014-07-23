define(
[
	'angular'
]
,function
(
	angular
)
{
	var mod = angular.module('mix_match_app/service/delete',[]);
	mod.factory('mix_match_app/service/delete',['$http','$q',function($http,$q){
		return function(mm){
			var promise_ing = $http({
				url:'/mix_match/delete',
				method:'POST',
				data:{
					id:mm.id
				}
			});
			var promise_ed = promise_ing.then(
				function(data){
					return data.data;
				},
				function(reason)
				{
					return $q.reject(reason);
				}
			)
			return promise_ed;
		}
	}])
})