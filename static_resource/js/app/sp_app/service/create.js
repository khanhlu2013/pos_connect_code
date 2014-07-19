define(
[
	'angular'
	//----
	,'app/sp_app/service/prompt'
	,'app/sp_app/filter'
]
,function
(
	angular
)
{
	var mod = angular.module('sp_app.service.create',['sp_app.service.prompt']);

	mod.factory('sp_app.service.create.old',['$http','$q','sp_app.service.prompt',function($http,$q,prompt_service){
		return function(suggest_product,sku){

			var prompt_promise = prompt_service(null/*original_sp*/,suggest_product,null/*duplicate_sp*/,sku);

			var insert_promise = prompt_promise.then(
				function(prompt_data){
					var promise_ing = $http({
						url:'/product/sp_insert_old_angular',
						method:'POST',
						data:{product_id:suggest_product.product_id,sku_str:prompt_data.sku,sp:JSON.stringify(prompt_data.sp)}
					});
 					var promise_ed = promise_ing.then(
						function(data){
							var defer = $q.defer();defer.resolve(data.data);return defer.promise;
						},
						function(reason){
							return $q.reject('insert new_old sp product ajax error');
						}
					)
 					return promise_ed;
				},
				function(reason){
					return $q.reject(reason);
				}
			)
			return insert_promise;
		}
 	}]);

	mod.factory('sp_app.service.create.new',['$http','$q','sp_app.service.prompt',function($http,$q,prompt_service){
		return function(sku){
			var prompt_promise = prompt_service(null/*original_sp*/,null/*suggest_product*/,null/*duplicate_sp*/,sku);
			var insert_promise = prompt_promise.then(
				function(prompt_data){
					var promise_ing = $http({
						url:'/product/insert_new_sp_angular',
						method:'POST',
						data:{sku_str:prompt_data.sku,sp:JSON.stringify(prompt_data.sp)}
					});
 					var promise_ed = promise_ing.then(
						function(data){
							var defer=$q.defer();defer.resolve(data.data);return defer.promise;
						},
						function(reason){
							return $q.reject('insert new_new sp product ajax error')
						}
					);
					return promise_ed;
				},
				function(reason){
					return $q.reject(reason);
				}
			);
			return insert_promise;
		}
 	}]);

	mod.factory('sp_app.service.create',
		[
			'$modal',
			'$filter',
			'$http',
			'$q',
			'sp_app.service.create.select_suggest',
			'sp_app.service.create.new',
			'sp_app.service.create.old',
		function(
			$modal,
			$filter,
			$http,
			$q,
			select_suggest,
			create_new_sp_service,
			create_old_sp_service
		){
		return function(prod_store__prod_sku__0_0,prod_store__prod_sku__1_0,sku){

			var select_promise = select_suggest(prod_store__prod_sku__0_0,prod_store__prod_sku__1_0,sku)
 			var create_promise = select_promise.then(
				function(select_option){
					if(select_option == null)
					{
						return create_new_sp_service(sku);
					}
					else if($filter('is_obj_sp')(select_option))
					{
						var cur_store_sp = select_option;
						var promise = $http({
							url:'/product/sku_add_angular',
							method:'POST',
							data: {product_id:cur_store_sp.product_id,sku_str:sku}
						})
						.then(
							function(data){
								return $filter('sp_lst_str_2_float')([data.data])[0];
							},
							function(ajax_reject_reason){
								return $q.reject('adding sku from another store for exiting product ajax error');
							}
						)
						return promise;
					}
					else if($filter('is_obj_p')(select_option))
					{
						var suggest_product = select_option;
						return create_old_sp_service(suggest_product,sku);
					}
				},
				function(reason){
					return $q.reject(reason);
				}
			);
			return create_promise;
		}
	}]);

	mod.factory('sp_app.service.create.select_suggest',['$modal','$filter','$q',function($modal,$filter,$q){
		return function(prod_store__prod_sku__0_0,prod_store__prod_sku__1_0){
			/*
				PRE: length of 0_0 and 1_0 can be both emtpy
				
				RETURN: a promise
 					. promise.data = null			-> create new sp
					. promise.data = sp			 	-> add sku
					. promise.data = product		-> insert old sp

			*/

			if(prod_store__prod_sku__0_0.length == 0 && prod_store__prod_sku__1_0.length == 0){
				var defer = $q.defer();
				defer.resolve(null);
				return defer.promise;
			}

			if(prod_store__prod_sku__0_0.length != 0){
				for(var i = 0;i<prod_store__prod_sku__0_0.length;i++){
					prod_store__prod_sku__0_0[i].store_product_set = $filter('sp_lst_str_2_float')(prod_store__prod_sku__0_0[i].store_product_set);
				}
 			}
 			if(prod_store__prod_sku__1_0.length != 0){
				prod_store__prod_sku__1_0 = $filter('sp_lst_str_2_float')(prod_store__prod_sku__1_0);
			}				
			var template = 
				'<div>' +
					'<div class="modal-header">' +
						'<h3 class="modal-title">select option</h3>' +
 					'</div>' +		
					'<div class="modal-body">' +
						'<div ng-hide="prod_store__prod_sku__1_0.length == 0">' +
							'<pre>product exist in your store. just need to add sku</pre>' +
							'<table class="table table-hover table-bordered table-condensed table-striped">' + 
								'<tr>' +
									'<caption>product exist in your store already. select to only add sku.</caption>' +
									'<th>your product</th>' +
									'<th>price</th>' +
									'<th>taxable</th>' +
									'<th>crv</th>' +
									'<th>cost</th>' +
									'<th>buydown</th>' +
									'<th><span class="glyphicon glyphicon-plus"> sku</span></th>' +
								'</tr>' +
								'<tr ng-repeat="sp in prod_store__prod_sku__1_0">' +
									'<td>{{sp.name}}</td>' +
									'<td>{{sp.price | currency}}</td>' +
									'<td ng-class="sp.is_taxable ? \'glyphicon glyphicon-ok\' : \'glyphicon glyphicon-remove\'"></td>' +
									'<td>{{sp|compute_sp_kit_field:\'crv\'}}</td>' +
									'<td>{{sp|compute_sp_kit_field:\'cost\'}}</td>' +
									'<td>{{sp|compute_sp_kit_field:\'buydown\'}}</td>' +
									'<td><button ng-click="add_sku(sp)" class="btn btn-primary glyphicon glyphicon-plus"> sku</button></td>' +
 								'</tr>' +
							'</table>' +	
						'</div>' +		
						'<div ng-hide="prod_store__prod_sku__0_0.length == 0">' +
							'<table class="table table-hover table-bordered table-condensed table-striped">' + 
								'<tr>' +
									'<caption>product exist from other store. select to import to your store.</caption>' +
									'<th>product from other stores</th>' +
									'<th>import</th>' +
								'</tr>' +
								'<tr ng-repeat="product in prod_store__prod_sku__0_0">' +
									'<td>{{product.name}}</td>' +
									'<td><button ng-click="import(product)" class="btn btn-primary">import</button></td>' +
 								'</tr>' +							
							'</table>' +
						'</div>' +												
						'<br />' +
						'<button class="btn btn-primary" ng-click="create_new()">click me to create new</button>' +

					'</div>' +	
					'<div class="modal-footer">' +
						'<button class="btn btn-warning" ng-click="cancel()">cancel</button>' +
					'</div>' +														
				'</div>'
			;

			var ModalCtrl = function($scope,$modalInstance,prod_store__prod_sku__0_0,prod_store__prod_sku__1_0){
				$scope.prod_store__prod_sku__0_0 = prod_store__prod_sku__0_0;
				$scope.prod_store__prod_sku__1_0 = prod_store__prod_sku__1_0;

				$scope.add_sku = function(sp){
					$modalInstance.close(sp);
				}
				$scope.import = function(product){
					$modalInstance.close(product);
				}
				$scope.create_new = function(){
					$modalInstance.close(null);
				}
				$scope.cancel = function(){
					$modalInstance.dismiss('_cancel_');
				}
			};

			var dlg = $modal.open({
				template:template,
				controller:ModalCtrl,
				size:'lg',
				resolve: {
					prod_store__prod_sku__0_0 : function(){return prod_store__prod_sku__0_0;},
					prod_store__prod_sku__1_0 : function(){return prod_store__prod_sku__1_0;}
				}
			});	

			return dlg.result;
		}
	}]);
})