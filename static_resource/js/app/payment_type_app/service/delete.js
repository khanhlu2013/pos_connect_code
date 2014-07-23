define(
[
	'angular'
]
,function
(
	angular
)
{
	var mod = angular.module('payment_type_app/service/delete',[]);
 	mod.factory('payment_type_app/service/delete',['$http','$q',function($http,$q){
		return function(pt){
			var promise_ing = $http({
				url:'/payment_type/delete',
				method:'POST',
				data:{id:pt.id}
			})
			var promise_ed = promise_ing.then(
				function(data){
					return data.data;
				},
				function(reason){	
					return $q.reject(reason);
				}
			)
			return promise_ed;
		}
	}])
})