define(
[
	 'angular'
    ,'lib/directive/share_directive'       
]
,function
(
	angular
)
{
	var mod = angular.module('sp_app.search',['share_directive']);
	mod.factory('sp_app.search_dlg.service',['$modal',function($modal){
		var template = 
			'<div class="modal-header">' +
				'<h3 class="modal-title">search</h3>' +
			'</div>'+

			'<div class="modal-body">' + 
				'<input type="text" ng-model="$parent.search_str" ng-enter="search()" placeholder="name/sku">' +
				'<table ng-hide="sp_lst.length==0" class="table table-hover table-bordered table-condensed table-striped">' +
					'<tr>' +
						'<th>name</th>' +
						'<th>price</th>' +
						'<th>select</th>' +					
					'</tr>' +

					'<tr ng-repeat="sp in sp_lst">' + 
						'<td>{{sp.name}}</td>' +
						'<td>{{sp.price}}</td>' +
						'<td><button class="btn btn-primary" ng-click="select(sp)">select</button></td>' +
					'</tr>' +
 				'</table>' +
 				'<div ng-hide="message.length == 0">' +
 					'<pre>{{message}}</pre>' +
 				'</div>' +
			'</div>' +

			'<div class="modal-footer">' + 
				'<button class="btn btn-warning" ng-click="cancel()">cancel</button>' +
			'</div>'
 		;
		var ModalCtrl = function($scope,$modalInstance,$http,$filter,is_multiple_select){
			$scope.message = "";
			$scope.is_multiple_select = is_multiple_select;
			$scope.sp_lst = "";

			$scope.select = function(sp){
				$modalInstance.close(sp);
			}
 			$scope.search = function(){
 				$scope.search_str = $scope.search_str.trim();
 				$scope.last_search_str = $scope.search_str;

 				if($scope.search_str.length == 0){
 					$scope.sp_lst = [];
 					$scope.message = "";
 					return;
 				}

				var token_lst = $scope.search_str.split(' ');
				if(token_lst.length > 2){
					$scope.message = "2 words search max";
					return;
				}

 				var promise = $http({
 					url : '/product/search_by_name_sku_angular',
 					method: 'GET',
 					params : {'search_str':$scope.search_str}
 				});
				promise.success(function(data, status, headers, config){
					$scope.sp_lst = $filter('sp_lst_float_2_str')(data);
					if($scope.sp_lst.length == 0){
						$scope.message = "no result for " + "'" + $scope.search_str + "'";					
					}else{
						$scope.message = "";
					}
 				});
 				promise.error(function(data, status, headers, config){
 				    alert('ajax error');
 				}); 				
			}
			$scope.cancel = function(){
				$modalInstance.dismiss('cancel');
			}
		}
		return function(is_multiple_select){
			var dlg = $modal.open({
				template:template,
				controller:ModalCtrl,
				size:'lg',
				resolve:{
					is_multiple_select : function(){return is_multiple_select}
				}
			});
			return dlg.result
		}
	}]);
})