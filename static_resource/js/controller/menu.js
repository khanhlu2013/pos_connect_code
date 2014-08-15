define(
[
	 'angular'
	 //----
	,'app/group_app/service/manage'
	,'app/tax_app/service/edit'
	,'app/mix_match_app/service/manage'
	,'app/payment_type_app/service/manage'
	,'app/shortcut_app/service/manage'
	,'app/receipt_app/service/report'
]
,function
(
	angular
)
{
	var mod = angular.module('controller.menu',
	[
		'group_app.service.manage',
		'tax_app.service.edit',
		'mix_match_app.service.manage',
		'payment_type_app/service/manage',
		'shortcut_app/service/manage',
		'receipt_app/service/report'
	]);

	mod.controller('controller.menu',
	[
		'$scope',
		'group_app.service.manage',
		'tax_app.service.edit',
		'mix_match_app.service.manage',
		'payment_type_app/service/manage',
		'shortcut_app/service/manage',
		'receipt_app/service/report',
	function(
		$scope,
		manage_group,
		edit_tax,
		manage_mm,
		manage_pt,
		manage_shortcut,
		report_receipt
	){
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

		$scope.menu_payment_type_manage = function(){
			manage_pt();
		}

		$scope.menu_shortcut_manage = function(){
			manage_shortcut();
		}

		$scope.menu_receipt_report = function(){
			report_receipt();
		}
	}])

	return mod;
})