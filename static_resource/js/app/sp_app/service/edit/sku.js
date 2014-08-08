define(
[
	'angular'
	//------------
	,'service/ui'
	,'app/sp_app/service/api_sku'
]
,function
(
	angular
)
{
	var mod = angular.module('sp_app.service.edit.sku',
	[
		'service.ui',
		'sp_app/service/api_sku'
	]);
	mod.factory('sp_app.service.edit.sku',
	[
		'$modal',
		'$http',
		'$filter',
		'service.ui.confirm',
		'service.ui.alert',
		'service.ui.prompt',
		'sp_app/service/api_sku',
	function(
		$modal,
		$http,
		$filter,
		confirm_service,
		alert_service,
		prompt_service,
		api_sku
	){
		var template = 
			'<div id="sp_app/service/edit/sku/dialog" class="modal-header">' + 
				'<div><h3>sku info: {{sp.name}}</h3></div>' +
 			'</div>' +
			
			'<div class="modal-body">' + 
				'<button id="sp_app/service/edit/sku/add_btn" ng-click="add_sku()"class="btn btn-primary"><span class="glyphicon glyphicon-plus"></span></button>' +
				'<table ng-show="sp.get_my_sku_assoc_lst().length != 0" class="table table-hover table-bordered table-condensed table-striped">' + 
					'<tr>' +
						'<th>sku</th>' +
						'<th>remove</th>' +
					'</tr>' +
					'<tr ng-repeat="sku_assoc in sp.get_my_sku_assoc_lst()">' +
						'<td>{{sku_assoc.sku_str}}</td>' +
						'<td><button ng-click="remove(sku_assoc)" class="btn btn-danger glyphicon glyphicon-trash"></button></td>' +
					'</tr>' +
				'</table>' +
				'<pre ng-show="sp.get_my_sku_assoc_lst().length == 0">there is no sku</pre>' +
			'</div>' +
			
			'<div class="modal-footer">' + 
				'<button id="sp_app/service/edit/sku/exit_btn" class="btn btn-warning" ng-click="exit()">exit</button>' +
			'</div>'				
		;
		var ModalCtrl = function($scope,$modalInstance,$filter,$q,sp){
			$scope.sp=sp;

			$scope.add_sku = function(){
				var promise = prompt_service('add new sku',null/*prefill*/,false/*is_null_allow*/,false/*is_float*/);
				promise.then(
					function(sku){
						api_sku.add_sku($scope.sp.product_id,sku).then(
							 function(updated_sp){ angular.copy(updated_sp,$scope.sp); }
							,function(reason){alert_service('alert',reason,'red')}
						)
					}
					,function(reason){ alert_service('alert',reason,'red');}
				)
			}

			$scope.remove = function(prod_sku_assoc){
				confirm_service('deleting sku ' + prod_sku_assoc.sku_str + ' ?','red').then(
 					function(){
 						api_sku.delete_sku($scope.sp.product_id,prod_sku_assoc.sku_str).then(
 							 function(updated_sp){angular.copy(updated_sp,$scope.sp);}
 							,function(reason){alert_service('alert',reason,'red')}
 						)
 					}
 					,function(){/*confirm cancel, do nothing*/}
 				)
			}

			$scope.exit = function(){
				$modalInstance.close();
			}
		}
		return function(sp){
			var dlg = $modal.open({
				template:template,
				controller:ModalCtrl,
				size:'lg',
				resolve:{
					sp:function(){return sp},
				}
			});
			return dlg.result;
		}
	}])
})