define(
[
	'angular'
	//------------
	,'service/ui'
]
,function
(
	angular
)
{
	var mod = angular.module('sp_app.service.edit.sku',['service.ui']);
	mod.factory('sp_app.service.edit.sku',['$modal','$http','$filter','service.ui.confirm','service.ui.alert','service.ui.prompt',function($modal,$http,$filter,confirm_service,alert_service,prompt_service){
		var template = 
			'<div class="modal-header">' + 
				'<div><h3>sku info: {{sp.name}}</h3></div>' +
 			'</div>' +
			
			'<div class="modal-body">' + 
				'<button ng-click="add_sku()"class="btn btn-primary"><span class="glyphicon glyphicon-plus"></span></button>' +
				'<table ng-show="get_my_sku_assoc_lst().length != 0" class="table table-hover table-bordered table-condensed table-striped">' + 
					'<tr>' +
						'<th>sku</th>' +
						'<th>remove</th>' +
					'</tr>' +
					'<tr ng-repeat="sku_assoc in get_my_sku_assoc_lst()">' +
						'<td>{{sku_assoc.sku_str}}</td>' +
						'<td><button ng-click="remove(sku_assoc)" class="btn btn-danger glyphicon glyphicon-trash"></button></td>' +
					'</tr>' +
				'</table>' +
				'<pre ng-show="get_my_sku_assoc_lst().length == 0">there is no sku</pre>' +
			'</div>' +
			
			'<div class="modal-footer">' + 
				'<button class="btn btn-warning" ng-click="exit()">exit</button>' +
			'</div>'				
		;
		var ModalCtrl = function($scope,$modalInstance,$filter,$q,sp){
			$scope.sp=sp;

			$scope.get_my_sku_assoc_lst = function(){
				return $filter('sku_in_store')($scope.sp.product.prodskuassoc_set,$scope.sp.store_id);
			}

			$scope.add_sku = function(){
				var promise = prompt_service('add new sku',null/*prefill*/,false/*is_null_allow*/,false/*is_float*/);
				promise.then(
					function(data){
						var promise_ing = $http({
							url:'/product/sku_add_angular',
							method:'POST',
							data: {product_id:$scope.sp.product_id,sku_str:data}							
						})
						var promise_ed = promise_ing.then(
							function(data){
								var processed_data = $filter('sp_lst_str_2_float')([data.data])[0]
								angular.copy(processed_data,$scope.sp);
							},
							function(reason){
								alert_service('alert','insert sku to product ajax error','red')
							}
						)
					},
					function(reason){
						alert_service('alert',reason,'red');
					}
				)
			}

			$scope.remove = function(prod_sku_assoc){
				var confirm_promise = confirm_service('deleting sku ' + prod_sku_assoc.sku_str + ' ?','red');
 				var promise = confirm_promise.then(
 					function(data){
 						var promise_ing = $http({
							url:'/product/sku_assoc_delete_angular',
							method:'POST',
							data:{product_id:$scope.sp.product_id,sku_str:prod_sku_assoc.sku_str}
						});

						var promise_ed = promise_ing.then(
							function(data){
								var processed_data = $filter('sp_lst_str_2_float')([data.data])[0];
								angular.copy(processed_data,$scope.sp);
							},
							function(reason){
								alert_service('alert','deleting sku subription ajax error','red');
							}
						)
 					},
 					function(reason){
						 //confirm error, do nothing
 					}
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