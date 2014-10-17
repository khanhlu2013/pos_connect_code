define(
[
    'angular'
    //----
    ,'app/sp_ll_app/service/search/name_sku_online_dlg'
    ,'service/ui'
]
,function
(
    angular
)
{
    var mod = angular.module('shortcut_app/service/prompt_child',
    [
         'sp_ll_app/service/search/name_sku_online_dlg'
        ,'service/ui'
    ]);
    mod.factory('shortcut_app/service/prompt_child',
    [
         '$modal'
        ,'sp_ll_app/service/search/name_sku_online_dlg/single'
        ,'service/ui/alert'
    ,function(
         $modal
        ,search_sp_single_service
        ,alert_service
    ){
    	return function(original_child){
    		var template = 
    			'<div class="modal-header">' +
    				'<h3 class="modal-title">{{original_child == null ? \'create new shortcut\' : \'edit shortcut: \' + original_child.store_product.name}}</h3>' +
    			'</div>' +
    			'<div class="modal-body">' +
    				'<form name="form" class="form-horizontal" novalidate>' +
    					'<div class="form-group">' +
	    					'<label class="col-sm-4 control-label">caption</label>' +
	    					'<div class="col-sm-8">' +
	    						'<input id="shortcut_app/service/prompt/caption_txt" ng-model="$parent.child.caption" name="caption" type="text" required>' +
	    						'<label class="error" ng-show="form.caption.$error.required">require</label>' +
	    					'</div>' +    					
    					'</div>' +

    					'<div class="form-group">' +
	    					'<label class="col-sm-4 control-label">product</label>' +
	    					'<div class="col-sm-8">' +
	    						'<input id="shortcut_app/service/prompt/sp_txt" ng-model="$parent.child.store_product.name" disabled name="product" type="text" required>' +
	    						'<label ng-show="form.product.$error.required" class="error">require</label>' +
	    						'<button id="shortcut_app/service/prompt/sp_btn" ng-click=select_sp() class="btn btn-primary glyphicon glyphicon-plus" type="button"></button>' +
	    					'</div>' +    					
    					'</div>' +
 					'</form>' +
    			'</div>' +
    			'<div class="modal-footer">' +
    				'<button id="shortcut_app/service/prompt/cancel_btn" ng-click="cancel()" class="btn btn-warning" type="button">cancel</button>' +
    				'<button ng-click="reset()" ng-disabled="is_unchange()"class="btn btn-primary" type="button">reset</button>' +
    				'<button id="shortcut_app/service/prompt/ok_btn" ng-click="ok()" ng-disabled="is_unchange() || form.$invalid" class="btn btn-success" type="button">ok</button>' +
    			'</div>'    			    			
    		;

    		var ModalCtrl = function($scope,$modalInstance,original_child){
    			$scope.original_child = original_child;
    			$scope.child = null;
    			var initial_child = {};
				if(original_child == null){
					$scope.child = angular.copy(initial_child);
				}else{
					$scope.child = angular.copy(original_child);
				}

				$scope.select_sp = function(){
					var promise = search_sp_single_service()
					promise.then(
						function(data){
                            $scope.child.store_product = data;
						},
						function(reason){
							alert_service('alert',reason,'red');
						}
					)
				}
    			$scope.is_unchange = function(){
    				if(original_child == null){
    					return angular.equals(initial_child,$scope.child);
    				}else{
    					return angular.equals(original_child,$scope.child);
    				}    				
    			}

    			$scope.reset = function(){
    				if(original_child == null){
    					angular.copy(initial_child,$scope.child);
    				}else{
    					angular.copy(original_child,$scope.child);
    				}
    			}

    			$scope.cancel = function(){
    				$modalInstance.dismiss('_cancel_');
    			}
    			$scope.ok = function(){
    				$modalInstance.close($scope.child)
    			}
    		}
            ModalCtrl.$inject = ['$scope','$modalInstance','original_child'];            
    		var dlg = $modal.open({
    			template:template,
    			controller:ModalCtrl,
    			size:'lg',
    			resolve:{
    				original_child:function(){return original_child}
    			}
    		})
    		return dlg.result;
    	}
    }])
})