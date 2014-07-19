define(
[
	'angular'
	//----
	,'app/sp_app/service/prompt'
]
,function
(
	angular
)
{
	var mod = angular.module('sp_app.service.duplicate',['sp_app.service.prompt']);
	mod.factory('sp_app.service.duplicate',['$http','$filter','$q','sp_app.service.prompt',function($http,$filter,$q,prompt_service){
		return function(sp){
			var prompt_promise = prompt_service(null/*original_sp*/,null/*suggest_product*/,sp/*duplicate_sp*/,null/*sku*/);
			var duplicate_promise = prompt_promise.then(
				function(prompt_result){
					var promise_ing = $http({
						url:'/product/insert_new_sp_angular',
						method: 'POST',
						data:{sku_str:prompt_result.sku,sp:JSON.stringify(prompt_result.sp)}
					});

					var promise_ed = promise_ing.then(
						function(data){
							var processed_data = $filter('sp_lst_str_2_float')([data.data/*sp*/])[0];
							var defer=$q.defer();defer.resolve(processed_data);return defer.promise;
						},
						function(reason){
							return $q.reject('insert new sp ajax error');
						}
					);

					return promise_ed;
 				},
				function(reason){
					return $q.reject(reason);
				}
			);
			return duplicate_promise;			
		}
	}]);
})