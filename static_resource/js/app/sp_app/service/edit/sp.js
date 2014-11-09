define(
[
	'angular'
	//----
	,'app/sp_app/service/prompt'
 	,'app/sp_app/service/api/crud'
    ,'service/db' 	
]
,function
(
	angular
)
{
	var mod = angular.module('sp_app/service/edit/sp',
	[
		 'sp_app/service/prompt'
		,'sp_app/service/api/crud'
        ,'service/db'		
	]);
	mod.factory('sp_app/service/edit/sp',
	[
		 '$http'
		,'$filter'
		,'$q'
		,'sp_app/service/prompt'
		,'sp_app/service/api/crud'
        ,'service/db/download_product'		
	,function(
		 $http
		,$filter
		,$q
		,prompt_service
		,sp_crud_api
		,download_product
	){
		return function(sp){
			var defer = $q.defer();

			prompt_service(sp,null/*suggest_product*/,null/*duplicate_sp*/,null/*sku*/,false/*is_operate_offline*/).then(
				 function(prompt_result){ 
				 	sp_crud_api.update(prompt_result.sp).then(
				 		function(updated_sp){
				 			download_product(false/*not force*/).then(
				 				 function(){ defer.resolve(updated_sp); }
				 				,function(reason){ defer.reject(reason); }
				 			)
				 		}
				 		,function(reason){ defer.reject(reason); }
				 	)
				 }
 				,function(reason){ return defer.reject(reason); }
			)

			return defer.promise;
		}
	}]);
})


					