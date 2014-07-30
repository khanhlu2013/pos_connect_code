define(
[
    'angular'
    //----
    ,'app/sp_app/model'
]
,function
(
    angular
)
{
    var mod = angular.module('sp_app/service/api_crud',['sp_app/model']);
    mod.factory('sp_app/service/api_crud',['$http','$q','sp_app/model/Store_product',function($http,$q,Store_product){
    	return{
    		insert_new : function(sp,sku){
				var promise_ing = $http({
					url:'/product/insert_new_sp_angular',
					method: 'POST',
					data:{sku_str:sku_str,sp:JSON.stringify(sp)}
				});
 				var promise_ed = promise_ing.then(
					function(data){
						var defer=$q.defer();defer.resolve(Store_product.build(data.data));return defer.promise;
					}
					,function(reason){ return $q.reject('create new product ajax error')}
				)
				return promise_ed;
    		},
    		update : function(sp){
				var promise_ing =  $http({
					url:'product/update_sp_angular',
					method: 'POST',
					data:{sp:JSON.stringify(sp)}
				});
 				var promise_ed = promise_ing.then(
					 function(data){ var defer = $q.defer();defer.resolve(Store_product.build(data.data));return defer.promise;}
					,function(){ alert_service('alert','update product ajax error');}
				)
 				return promise_ed;
    		}
    	}
    }])
})