define(
[
	'angular'
	//----
	,'service/ui'
	,'app/mix_match_app/service/create'
	,'app/mix_match_app/service/edit'
	,'app/mix_match_app/service/delete'
]
,function
(
	angular
)
{
	var mod = angular.module('mix_match_app.service.manage',['service.ui','mix_match_app/service/create','mix_match_app/service/edit','mix_match_app/service/delete']);
	mod.factory('mix_match_app.service.manage',
	[
		'$http',
		'$modal',
		'$q',
		'$filter',
		'service.ui.alert',
		'service.ui.confirm',
		'mix_match_app/service/create',
		'mix_match_app/service/edit',
	 	'mix_match_app/service/delete',
	function(
		$http,
		$modal,
		$q,
		$filter,
		alert_service,
		confirm_service,
 		create_service,
		edit_service,
 		delete_service
	){
		return function(){
			var template = 
				'<div class="modal-header">' +
					'<h3 class="modal-title">manage mix match deals</h3>' +
				'</div>' +

				'<div class="modal-body">' +
					'<button ng-click="add_mix_match()" class="btn btn-primary"><span class="glyphicon glyphicon-plus"></span></button>' +
					'<table ng-hide="mm_lst.length == 0" class="table table-hover table-bordered table-condensed table-striped">' +
						'<tr>' +
							'<th>name</th>' +
							'<th>qty</th>' +
							'<th>price</th>' +
							'<th>include crv&tax</th>' +
							'<th>delete</th>' +
							'<th>edit</th>' +
						'</tr>' +
						'<tr ng-repeat="mm in mm_lst">' +
							'<td>{{mm.name}}</td>' +
							'<td>{{mm.qty}}</td>' +
							'<td>{{mm.mm_price|currency}}</td>' +
							'<td><span ng-class="mm.is_include_crv_tax ? \'glyphicon glyphicon-ok\' : \'glyphicon glyphicon-remove\'"></span></td>' +
							'<td><button ng-click="delete(mm)" class="btn btn-danger glyphicon glyphicon-trash"></button></td>' +
							'<td><button ng-click="edit(mm)" class="btn btn-primary glyphicon glyphicon-pencil"></button></td>' +
						'</tr>' +
					'</table>' +
					'<pre ng-show="mm_lst.length == 0">there is no deal</pre>' +
				'</div>' +

				'<div class="modal-footer">' +
					'<button ng-click="exit()" class="btn btn-warning">exit</button>' +
				'</div>'								
			;
			var ModalCtrl = function($scope,$modalInstance,$q,mm_lst){
				$scope.mm_lst = mm_lst;
				$scope.add_mix_match = function(){
					var promise = create_service();
					promise.then(
						function(data){
							$scope.mm_lst.push(data);
						},
						function(reason){
							alert_service('alert',reason,'red');
						}
					)
				}
				$scope.delete = function(mm){
					var confirm_promise = confirm_service('delete mix match ' + mm.name + ' ?','red');
					confirm_promise.then(
						function(){
							var promise = delete_service(mm);
							promise.then(
								function(data){
									for(var i = 0;i<$scope.mm_lst.length;i++){
										if($scope.mm_lst[i].id == mm.id){
											$scope.mm_lst.splice(i,1);
										}
									}
								},
								function(reason){
									alert_service('alert',reason,'red');
								}	
							)
						}
					)
				}
				$scope.edit = function(mm){
					var promise = edit_service(mm);
					promise.then(
						function(data){
							angular.copy(data,mm);
						},
						function(reason){
							alert_service('alert',reason,'red');
						}
					)
				}
				$scope.exit = function(){
					$modalInstance.close($scope.mm_lst);
				}
			}

			dlg = $modal.open({
				template:template,
				controller: ModalCtrl,
				size:'lg',
				resolve:{
					mm_lst : function(){
						var get_ing_promise = $http({
							url:'/mix_match/get',
							method:'GET'
						});
 						var get_ed_promise = get_ing_promise.then(
							function(data){
								var process_data = $filter('mix_match_app.filter.mm_lst_str_2_float')(data.data);
								var defer=$q.defer();defer.resolve(process_data);return defer.promise;
							},
							function(reason){
								return $q.reject('get mix match lst ajax error');
							}
						)
						return get_ed_promise;						
					}
				}
			});

			return dlg.result;
		}
	}])
})