define(
[
	'angular'
	//---
	,'app/group_app/service/search_dlg'
]
,function
(
	angular
)
{
	var mod = angular.module('sp_app.service.edit.group',['group_app.service.search_dlg'])
    mod.factory('sp_app.service.edit.group',['$modal','group_app.service.search_dlg',function($modal,group_select){
        var template = 
            '<div class="modal-header">' +
                '<h3 class="modal-title">Group info: {{sp.name}}</h3>' +
            '</div>' +

            '<div class="modal-body">' +   

                '<button ng-click="add()" class="btn btn-primary"><span class="glyphicon glyphicon-plus"></span></button>' +
                '</br>' +
                '<table ng-hide="sp.group_set.length==0" class="table table-hover table-bordered table-condensed table-striped">' +
                    '<tr>' +
                        '<th>group</th>' +         
                        '<th>remove</th>' +                
                    '</tr>' +    
                    '<tr ng-repeat="group in sp.group_set">' +
                        '<td>{{group.name}}</td>' +    
                        '<td><button ng-click="remove(group)" class="btn btn-danger glyphicon glyphicon-trash"></button></td>' +                                            
                    '</tr>' +                                                  
                '</table>' +
                '<div ng-show="sp.group_set.length==0">' +
                    '</br>' +
                    '<pre>No group!</pre>' +
                '</div>' +

            '</div>' +

            '<div class="modal-footer">' +          
                '<button class="btn btn-warning" ng-click="cancel()">cancel</button>' + 
                '<button ng-disabled="is_unchange()" class="btn btn-primary" ng-click="reset()">reset</button>' +                               
                '<button ng-disabled="is_unchange()||form.$invalid" class="btn btn-success" ng-click="save()">save</button>' +
            '</div>'        
        ;    

        var ModalCtrl = function($scope,$modalInstance,$http,$filter,original_sp){
            $scope.original_sp = original_sp;
            $scope.sp = angular.copy(original_sp);

            $scope.is_unchange = function() {
                return angular.equals($scope.original_sp, $scope.sp);
            };   
            $scope.add = function(){
                var promise = group_select(true/*allow to select multiple group*/);
                promise.then(function (result_lst) {
                    for(var i = 0;i<result_lst.length;i++){
                        if($filter('get_item_from_lst_base_on_id')($scope.sp.group_set,result_lst[i].id) == null) {
                            $scope.sp.group_set.push(result_lst[i]);
                        }
                    }
                }, function () {
                    //do nothing
                });                
            }
            $scope.remove = function(group){
                for(var i = 0;i<$scope.sp.group_set.length;i++){
                    if($scope.sp.group_set[i].id === group.id){
                        $scope.sp.group_set.splice(i,1);
                    }
                }
            };         
            $scope.reset = function(){
                $scope.sp = angular.copy($scope.original_sp)
            };            
            $scope.cancel = function(){
                $modalInstance.dismiss('cancel');
            };
            $scope.save = function(){
                //update sp
                var promise = $http({
                    url: '/product/group/update_angular',
                    method : "POST",
                    data: {sp:JSON.stringify($scope.sp)}
                });
                promise.success(function(data, status, headers, config){
                    angular.copy(data,$scope.original_sp);
                    $modalInstance.close($scope.original_sp);
                });
                promise.error(function(data, status, headers, config){
                    alert('ajax error');
                });     
            };
        }

        return function(sp){
            var dlg = $modal.open({
                template: template,
                controller: ModalCtrl,
                backdrop:'static',
                // scope:$scope,
                size: 'lg',
                resolve : {
                    original_sp : function(){return sp}
                }
            });
            return dlg.result;
        }            
    }]);
})