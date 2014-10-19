define(
[
    'angular'
    //--
    ,'service/ui'
    ,'app/group_app/service/api'
]
,function
(
    angular
)
{
    var mod = angular.module('group_app/service/search_dlg',['service/ui']);
    mod.factory('group_app/service/search_dlg/multiple',
    [
         '$modal'
        ,'service/ui/alert'
        ,'group_app/service/api'
    ,function(
         $modal
        ,alert_service
        ,api
    ){
    	return function(){
    		var template = 
    			'<div class="modal-header">' +
    				'<h3 class="modal-title">select groups</h3>' +
    			'</div>' +
    			'<div class="modal-body">' +
                    '<input ng-model="query" type="text" placeholder="offline filter">' +
                    '<div>' +
                        '<div class="col-sm-6">' +
                            '<table ng-hide="group_lst.length==0" class="table table-hover table-bordered table-condensed table-striped">' +
                                '<tr>' +
                                    '<th>group</th>' +
                                    '<th>select</th>' +
                                '</tr>' +
                                '<tr ng-repeat="group in group_lst | orderBy:\'name\' | filter:query">' +
                                    '<td>{{group.name}}</td>' +
                                    '<td class="alncenter"><button ng-click="toggle_select(group)" class="btn glyphicon" ng-class="is_group_selected(group) ? \'btn-warning glyphicon-check\' : \'btn-primary glyphicon-unchecked\'"></button></td>' +
                                '</tr>' +
                            '</table>' +   
                            '<pre ng-show="group_lst.length==0">there is no group to select</pre>' +                 
                        '</div>' +

                        '<div class="col-sm-6">' +
                            '<table class="table table-hover table-bordered table-condensed table-striped">' +
                                '<tr>' +
                                    '<th>group</th>' +
                                    '<th>remove</th>' +
                                '</tr>' +
                                '<tr ng-repeat="group in group_result_lst">' +
                                    '<td>{{group.name}}</td>' +
                                    '<td class="alnright"><button ng-click="toggle_select(group)" class="btn btn-warning glyphicon glyphicon-trash"></button></td>' +
                                '</tr>' +                            
                            '</table>' +
                        '</div>' + 
                        '<div class="clear"></div>' +    
                    '</div>' +
                '</div>' +
    			'<div class="modal-footer">' +
    				'<button ng-click="cancel()" class="btn btn-warning">cancel</button>' +
                    '<button ng-disabled="group_result_lst.length==0" ng-click="reset()" class="btn btn-primary">reset</button>' +                    
    				'<button id="group_app/service/search_dlg/multiple/ok_btn" ng-disabled="group_result_lst.length==0" ng-click="ok()" class="btn btn-success">ok</button>' +
    			'</div>'		    			
    		;
    		var ModalCtrl = function($scope,$modalInstance,group_lst){
                $scope.group_lst = group_lst;
                $scope.group_result_lst = [];
                $scope.toggle_select = function(group){
                    if($scope.is_group_selected(group)){
                        var index = null;
                        for(var i = 0;i<$scope.group_result_lst.length;i++){
                            if(group.id == $scope.group_result_lst[i].id){
                                index =i;
                                break;
                            }
                        }
                        $scope.group_result_lst.splice(index,1);
                    }else{
                        $scope.group_result_lst.push(group);
                    }
                }
                $scope.is_group_selected = function(group){
                    var is_select = false;
                    for(var i = 0;i<$scope.group_result_lst.length;i++){
                        if(group.id == $scope.group_result_lst[i].id){
                            is_select = true;
                            break;
                        }
                    }
                    return is_select;
                }
                $scope.reset = function(){
                    $scope.group_result_lst = [];
                }
    			$scope.cancel = function(){
    				$modalInstance.dismiss('_cancel_');
    			}
    			$scope.ok = function(){
                    $modalInstance.close($scope.group_result_lst);
    			}    			
    		}
            ModalCtrl.$inject = ['$scope','$modalInstance','group_lst'];            
    		var dlg = $modal.open({
    			template:template,
    			controller:ModalCtrl,
    			size:'lg',
    			resolve:{
                    group_lst : function(){
                        var promise = api.get_lst();
                        promise.then(
                             function(){ /*do nothing*/ }
                            ,function(reason){ alert_service('alert',message,'red'); }
                        )
                        return promise;
                    }
    			}
    		})
    		return dlg.result;
    	}
    }])
})
