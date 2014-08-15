define(
[
	'angular'
]
,function
(
	angular
)
{
	var mod = angular.module('group_app.service.delete',[]);
	mod.factory('group_app.service.delete',['$http','$q',function($http,$q){
		return function(group_id){
			var get_ing_promise = $http({
				url:'/group/get_item',
				method:'GET',
				params:{group_id:group_id}
			})

			var get_ed_promise = get_ing_promise.then(
				function(data){
					var defer = $q.defer();defer.resolve(data.data);return defer.promise;
				},
				function(reason){
					return $q.reject('get group item ajax error');
				}
			)

			var delete_promise = get_ed_promise.then(
				function(group){
					if(group.sp_lst.length == 0){
						var delete_ing_promise = $http({
							url:'/group/delete_angular',
							method:'POST',
							data:{group_id:group_id}
						});
						var delete_ed_promise = delete_ing_promise.then(
							function(){
								return true;
							},
							function(){
								return $q.reject('delete group ajax error');
							}
						);
						return delete_ed_promise;
					}else{
						return $q.reject('group must be empty to be deleted')
 					}
 				},
				function(reason){
					return $q.reject(reason);
				}
			)
			return delete_promise;
		}
	}]);
})