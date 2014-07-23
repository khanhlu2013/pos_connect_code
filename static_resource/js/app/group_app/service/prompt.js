define(
[
	'angular'
	//----
	,'app/sp_app/service/search_dlg'
	,'service/ui'
]
,function
(
	angular
)
{
	var mod = angular.module('group_app.service.prompt',['sp_app.service.search_dlg','service.ui']);
	mod.factory('group_app.service.prompt',['$modal','sp_app.service.search_dlg.multiple','service.ui.alert',function($modal,sp_search_multiple_dlg,alert_service){
		return function(original_group){
			var template = 
				'<div class="modal-header"><h3>{{original_group.name==undefined?\'Create new group\' : \'Edit group \'+ original_group.name}}</h3></div>' +
				'<div class="modal-body">' +
					'<form name="form" class="form-group">' + 
						'<label>group name:</label>' +
						'<input name="name" ng-model="$parent.group.name" type="text" required>' +
						'<label class="error" ng-show="form.name.$error.required">required</label>' +
					'</form>' +

					'<button ng-click="add_sp()" class="btn btn-primary"><span class="glyphicon glyphicon-plus"></span></button>' +
					'<table ng-hide="group.store_product_set.length == 0" class="table table-hover table-bordered table-condensed table-striped">' +
						'<tr>' +
							'<th>product</th>' +
							'<th>remove</th>' +
						'</tr>' +

						'<tr ng-repeat="sp in group.store_product_set">' +
							'<td>{{sp.name}}</td>' +
							'<td><button ng-click="remove_sp(sp)"class="btn btn-danger"><span class="glyphicon glyphicon-trash"></span></button></td>' +
						'</tr>' +
					'</table>' +
					'<pre ng-show="group.store_product_set.length == 0">there is no product in this group</pre>' +
					'{{original_group}}' +
				'</div>' + 
				'<div class="modal-footer">' +
					'<button ng-click="cancel()" class="btn btn-warning">cancel</button>' + 
					'<button ng-disabled="is_unchange()" ng-click="reset()" class="btn btn-primary">reset</button>' + 
					'<button ng-disabled="form.$invalid || is_unchange()" ng-click="ok()" class="btn btn-success">ok</button>' + 
				'</div>'
			;
			var ModalCtrl = function($scope,$modalInstance,$filter,original_group){
				if(original_group == null){
					original_group = {store_product_set:[]};
				}

				$scope.original_group = original_group;
				$scope.group = angular.copy($scope.original_group);

				$scope.remove_sp = function(sp){
					for(var i = 0;i<$scope.group.store_product_set.length;i++){
						if(sp.id == $scope.group.store_product_set[i].id){
							$scope.group.store_product_set.splice(i,1);
							break;
						}
					}
				}

				$scope.add_sp = function(){
					var promise = sp_search_multiple_dlg();
					promise.then(
						function(sp_lst){
							for(var i = 0;i<sp_lst.length;i++){
								if($filter('get_item_from_lst_base_on_id')($scope.group.store_product_set,sp_lst[i].id) == null){
									$scope.group.store_product_set.push(sp_lst[i]);
								}
							}
						},
						function(reason){
							alert_service('alert',reason,'red');
						}
					)
				}
				$scope.is_unchange = function(){
					return angular.equals($scope.group,$scope.original_group);
				}
				$scope.reset = function(){
					$scope.group = angular.copy($scope.original_group);
				}
				$scope.ok = function(){
					$modalInstance.close($scope.group);
				}
				$scope.cancel = function(){
					$modalInstance.dismiss('_cancel_');
				}
			}
			var dlg = $modal.open({
				template:template,
				controller:ModalCtrl,
				size:'lg',
				backdrop:'static',
				resolve:{
					original_group:function(){return original_group}
				}
			})

			return dlg.result;
		}
	}]);
})
