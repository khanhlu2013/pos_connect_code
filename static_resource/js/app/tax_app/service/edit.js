define(
[
	'angular'
	//-----
	,'service/ui'
]
,function
(
	angular
)
{
	var mod = angular.module('tax_app/service/edit',['service/ui']);

	mod.factory('tax_app/service/edit',
	[
		 '$http'
		,'$modal'
		,'$q'
		,'$rootScope'
		,'service/ui/prompt'
		,'service/ui/alert'
	,function(
		 $http
		,$modal
		,$q
		,$rootScope
		,prompt_service
		,alert_service
	){
		return function(){
			var defer = $q.defer();

			prompt_service('enter tax rate',$rootScope.GLOBAL_SETTING.tax_rate/*prefill*/,false/*null is not allow*/,true/*is float*/).then(
				function(prompt_data){
					$http({
						url:'/tax/update_angular',
						method:'POST',
						data:{ tax_rate:prompt_data }
					}).then(
						function(data){
							var new_tax_rate = JSON.parse(data.data);
							$rootScope.GLOBAL_SETTING.tax_rate = new_tax_rate;
							defer.resolve(new_tax_rate);
						},
						function(reason){ defer.reject('set tax ajax error'); }
					)
				},
				function(reason){ defer.reject(reason); }
			);
			return defer.promise;
		}
	}]);
})