define(
[
	'angular'
	//
	,'app/sp_app/service/search_dlg'
	,'service/ui'
]
,function
(
	angular
)
{
	var mod = angular.module('mix_match_app/service/prompt',['sp_app.service.search_dlg','service.ui']);

	mod.factory('mix_match_app/service/prompt',['$modal','service.ui.alert','sp_app.service.search_dlg.multiple',function($modal,alert_service,search_multiple_sp_service){
		return function(original_mm){
			var template = 
				'<div class="modal-header">' +
					'<h3>{{$scope.original_mm == null ? "create new mix match" : "edit " + mm.name}}</h3>' +
				'</div>' +
				'<div class="modal-body">' +			
					'<form class="form-horizontal" name="form" novalidate>' +
						'<div class="form-group">' +
							'<label class="col-sm-4">name</label>' +
							'<div class="col-sm-8">' +
								'<input ng-model="$parent.mm.name" name="name" required>' +
								'<label ng-show="form.name.$error.required" class="error">required</label>' +
							'</div>' +
						'</div>' +

						'<div class="form-group">' +
							'<label class="col-sm-4">qty</label>' +
							'<div class="col-sm-8">' +
								'<input ng-model="$parent.mm.qty" name="qty" ng-pattern="integer_validation" type="number" min="2" required>' +
								'<label ng-show="form.qty.$error.required && !form.qty.$error.number && !form.qty.$error.min" class="error">required</label>' +
								'<label ng-show="form.qty.$error.number || form.qty.$error.pattern" class="error">invalid number</label>' +
								'<label ng-show="form.qty.$error.min" class="error">at least 2</label>' +
							'</div>' +
						'</div>' +

						'<div class="form-group">' +
							'<label class="col-sm-4">price</label>' +
							'<div class="col-sm-8">' +
								'<input ng-model="$parent.mm.mm_price" name="price" type="number" min="0.01" required>' +
								'<label ng-show="form.price.$error.required && !form.price.$error.number && !form.price.$error.min" class="error">required</label>' +
								'<label ng-show="form.price.$error.number" class="error">invalid number</label>' +
								'<label ng-show="form.price.$error.min" class="error">invalid price</label>' +
							'</div>' +
						'</div>' +

						'<div class="form-group">' +
							'<label class="col-sm-4">include crv&tax</label>' +
							'<div class="col-sm-8">' +
								'<input ng-model="$parent.mm.is_include_crv_tax" name="is_include_crv_tax" type="checkbox">' +
								'<label ng-show="form.is_include_crv_tax.$error.required" class="error">required</label>' +
							'</div>' +
						'</div>' +
 					'</form>' +

 					'<button ng-click="add_product()" class="btn btn-primary"><span class="glyphicon glyphicon-plus"></span> product</button>' +
 					'<table ng-hide="mm.sp_lst.length==0" class="table table-hover table-bordered table-condensed table-striped">' +
 						'<tr>' +	
 							'<th>product</th>' +
 							'<th>remove</th>' +
 						'<tr>' +
 						'<tr ng-repeat="mm_child in mm.sp_lst">' +
 							'<td>{{mm_child.store_product.name}}</td>' +
 							'<td><button ng-click="remove_child(mm_child)" class="btn btn-danger glyphicon glyphicon-trash"></button></td>' +
 						'</tr>' +
 					'</table>' +
 					'<label ng-show="mm.sp_lst.length==0" class="error">empty deal</label>' +
 				'</div>' +

				'<div class="modal-footer">' +
					'<button ng-click="cancel()" class="btn btn-warning">cancel</button>' +
					'<button ng-disabled="is_unchange()" ng-click="reset()" class="btn btn-primary">reset</button>' +
					'<button ng-disabled="is_unchange() || (form.$invalid || mm.sp_lst.length == 0)" ng-click="ok()"class="btn btn-success">ok</button>' +
				'</div>'						
			;
			var ModalCtrl = function($scope,$modalInstance,$filter,original_mm){
				$scope.original_mm = original_mm;
				$scope.mm = angular.copy(original_mm);
				$scope.integer_validation = /^\d*$/;
				initial_mm = {is_include_crv_tax:false,sp_lst:[]};

				if($scope.mm == null){
					$scope.mm = angular.copy(initial_mm);
				}
				$scope.remove_child = function(child){
					for(var i = 0;i<$scope.mm.sp_lst.length;i++){
						if(child.id==$scope.mm.sp_lst[i].id){
							$scope.mm.sp_lst.splice(i,1);
							break;
						}
					}
				}
 				$scope.add_product = function(){
					var promise = search_multiple_sp_service(null);
					promise.then(
						function(sp_lst){
							for(var i = 0;i<sp_lst.length;i++){

								var is_found = false//see if we can find sp_lst[i] in the current deal
								for(var j = 0;j<$scope.mm.sp_lst.length;j++){
									if($scope.mm.sp_lst[j].store_product.id == sp_lst[i].id){
										is_found = true;
										break;
									}
								}

								if(!is_found){
									$scope.mm.sp_lst.push({store_product:sp_lst[i]});
								}
							}
						},
						function(reason){
							alert_service('alert',reason,'red');
						}
					)
				}
				$scope.is_unchange = function(){
					if(original_mm == null){
						return angular.equals(initial_mm,$scope.mm)
					}else{
						return angular.equals(original_mm,$scope.mm)
					}
				}
				$scope.reset = function(){
					if(original_mm == null){
						angular.copy(initial_mm,$scope.mm)
					}else{
						angular.copy(original_mm,$scope.mm)
					}
				}
				$scope.ok = function(){
					$modalInstance.close($scope.mm);
				}
				$scope.cancel = function(){
					$modalInstance.dismiss('_cancel_');
				}
			}
			var dlg = $modal.open({
				template:template,
				controller:ModalCtrl,
				size:'lg',
				resolve:{
					original_mm : function(){return original_mm;}
				}
			})
			return dlg.result;
		}
	}]);
})