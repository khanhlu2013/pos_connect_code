define(
[
	'angular'
	//-----
	,'app/payment_type_app/service/edit'
	,'app/payment_type_app/service/create'
	,'app/payment_type_app/service/delete'
	,'service/ui'
	,'app/payment_type_app/service/api'

]
,function
(
	angular
)
{
	var mod = angular.module('payment_type_app/service/manage',
		[
			'payment_type_app/service/create',
			'payment_type_app/service/edit',
			'service.ui',
			'payment_type_app/service/delete',
			'payment_type_app/service/api'
		]
	);
	mod.service('payment_type_app/service/manage',
	[
		'$http',
		'$modal',
		'payment_type_app/service/edit',
		'payment_type_app/service/create',
		'service.ui.alert',
		'service.ui.confirm',
		'payment_type_app/service/delete',
		'payment_type_app/service/api',
	function
	(
		$http,
		$modal,
		edit_service,
		create_service,
		alert_service,
		confirm_service,
		delete_service,
		api
	){
		return function(){
			var template = 
				'<div class="modal-header">' +
					'<h3 class="modal-title">manage payment type</h3>' +
				'</div>' +

				'<div class="modal-body">' +
					'<button id="payment_type_app/service/manage/create_btn" ng-click="create()" class="btn btn-primary glyphicon glyphicon-plus"></button>' +
					'<table ng-hide="pt_lst.length==0" class="table table-hover table-bordered table-condensed table-striped">' +
						'<tr>' +
							'<th>payment type</th>' +
							'<th>remove</th>' +
							'<th>edit</th>' +
						'</tr>' +
						'<tr ng-repeat="pt in pt_lst | orderBy:\'name\'">' +
							'<td>{{pt.name}}</td>' +
							'<th><button ng-click="delete(pt)" class="btn btn-danger glyphicon glyphicon-trash"></button></th>' +
							'<th><button ng-click="edit(pt)" class="btn btn-primary glyphicon glyphicon-pencil"></button></th>' +
 						'</tr>' +
 					'</table>' +
					'<pre ng-show="pt_lst.length==0">there is no payment type</pre>' +
				'</div>' +

				'<div class="modal-footer">' +
					'<button id="payment_type_app/service/manage/exit_btn" class="btn btn-warning" type="button" ng-click="exit()">exit</button>'
				'</div>'						
			;
			var ModalCtrl = function($scope,$modalInstance,$q,pt_lst){
				$scope.pt_lst = pt_lst;

				$scope.exit = function(){
					$modalInstance.dismiss('_cancel_');
				}
				$scope.create = function(){
					var promise = create_service();
					promise.then(
						 function(data){$scope.pt_lst.push(data);}
						,function(reason){alert_service('alert',reason,'red');}
					)
				}
				$scope.delete = function(pt){
					var confirm_promise = confirm_service('delete payment type: ' + pt.name + ' ?','red');
					confirm_promise.then(
						function(){
							var promise = delete_service(pt);
							promise.then(
								function(data){
									for(var i = 0;i<$scope.pt_lst.length;i++){
										if($scope.pt_lst[i].id == pt.id){
											$scope.pt_lst.splice(i,1);
										}
									}
								}
								,function(reason){alert_service(reason);}
 							)
						}
					)
				}
				$scope.edit = function(pt){
					var promise = edit_service(pt);
					promise.then(
						 function(data){ angular.copy(data,pt);}
						,function(reason){alert_service('alert',reason,'red');}
					)
				}
			}
			var dlg = $modal.open({
				template:template,
				controller:ModalCtrl,
				size:'md',
				resolve:{
					pt_lst:function(){
						return api.get_lst();
					}
				}
			})
		}
	}])
})