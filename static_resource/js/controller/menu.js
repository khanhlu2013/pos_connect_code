define(
[
	 'angular'
	,'app/group_app/service/manage'
	,'app/tax_app/service/edit'
	,'app/mix_match_app/service/manage'
]
,function
(
	angular
)
{
	var mod = angular.module('controller.menu',['group_app.service.manage','tax_app.service.edit','mix_match_app.service.manage']);

	mod.controller('controller.menu',['$scope','group_app.service.manage','tax_app.service.edit','mix_match_app.service.manage',function($scope,manage_group,edit_tax,manage_mm){
		$scope.menu_group_manage = function(){
			var promise = manage_group();
			return promise;
		}

		$scope.menu_mix_match_manage = function(){
			var promise = manage_mm();
			return promise;
		}

		$scope.menu_tax_edit = function(){
			edit_tax();
		}
	}])

	return mod;
})