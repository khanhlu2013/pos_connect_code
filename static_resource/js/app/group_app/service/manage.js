define(
[
    'angular'
    //-----
    ,'service/ui'    
    ,'app/group_app/service/edit'
    ,'app/group_app/service/create'
    ,'app/group_app/service/delete'
    ,'app/group_app/service/api'
]
,function
(
    angular
)
{
    var mod = angular.module('group_app/service/manage',
    [
        'service/ui',
        'group_app/service/edit',
        'group_app/service/create',
        'group_app/service/delete',
        'group_app/service/api'
    ]);

    mod.factory('group_app/service/manage',
        [
            '$modal',
            '$http',
            'group_app/service/edit',
            'service/ui/alert',
            'service/ui/confirm',
            'group_app/service/create',
            'group_app/service/delete',
            'group_app/service/api',
        function
        (
            $modal,
            $http,
            edit_group_service,
            angular_alert,
            angular_confirm,
            create_group,
            delete_group,
            api
        ){
        return function(){
            var template = 
                '<div class="modal-header"><div class="modal-title"><h3>manage group</h3></div></div>' +
                
                '<div class="modal-body">' +
                    '<button id="group_app/service/manage/add_btn" ng-click="add_group()" class="btn btn-primary"><span class="glyphicon glyphicon-plus"></span></button>' +
                    '<table ng-hide="group_lst.length == 0" class="table table-hover table-bordered table-condensed table-striped">' +
                        '<tr>' + 
                            '<th>group</th>' +
                            '<th>action</th>' +                            
                            '<th>delete</th>' +                            
                            '<th>edit</th>' +
                        '</tr>' +

                        '<tr ng-repeat="group in group_lst">' +
                            '<td>{{group.name}}</td>' +
                            '<td class="alncenter"><button ng-click="action_group(group)" class="btn btn-primary"><span class="glyphicon glyphicon-play"></span></button></td>' +                            
                            '<td class="alncenter"><button ng-click="delete_group(group)" class="btn btn-danger"><span class="glyphicon glyphicon-trash"></span></button></td>' +
                            '<td class="alncenter"><button ng-click="edit_group(group)"class="btn btn-primary"><span class="glyphicon glyphicon-pencil"></span></button></td>' +
                        '</tr>' +
                    '</table>' +
                    '<pre ng-show="group_lst.length == 0">there is no group</pre>' +
                '</div>' +
                
                '<div class="modal-footer">' +
                    '<button id="group_app/service/manage/exit_btn" ng-click="exit()" class="btn btn-warning"><span class="glyphicon glyphicon-remove"></span></button>' +
                '</div>'                
            ;
            var ModalCtrl = function($scope,$modalInstance,$http,group_lst){
                $scope.group_lst = group_lst;

                $scope.action_group = function(group_id){
                    angular_alert('well ...','do we need this feature?','blue');
                }
                $scope.delete_group = function(group){
                    var confirm_promise = angular_confirm('delete ' + group.name + ' group?');
                    confirm_promise.then(
                        function(data){
                            if(data == false){
                                return;
                            }

                            var promise = delete_group(group.id);
                            promise.then(
                                function(data){
                                    if(data == true){ 
                                        var index = null;
                                        for(var i = 0;i<$scope.group_lst.length;i++){
                                            if($scope.group_lst[i].id == group.id){
                                                index = i;
                                                break;
                                            }
                                        }

                                        if(index == null){
                                            angular_alert('alert','Bug: should be unreachable. can not find deleted index after success response','red');
                                        }else{
                                            $scope.group_lst.splice(i,1);
                                        }
                                    }else{
                                        angular_alert('alert','Bug: should be unreachable. delete response data = false','red');
                                    }
                                },
                                function(reason){
                                    angular_alert('alert',reason,'red');
                                }
                            )                            
                        }
                    )
                }
                $scope.add_group = function(){
                    var promise = create_group();
                    promise.then(
                        function(data){
                            $scope.group_lst.push(data);
                        },
                        function(reason){
                            angular_alert('alert',reason,'red');
                        }
                    )
                }
                $scope.edit_group = function(group){
                    var promise = edit_group_service(group);
                    promise.then(
                        function(data){
                            angular.copy(data,group);
                        },
                        function(reason){
                            angular_alert('error',reason,'red');
                        }
                    )
                }
                $scope.exit = function(){
                    $modalInstance.close($scope.sp_lst);
                }
            }

            var dlg = $modal.open({
                template:template,
                controller:ModalCtrl,
                size:'lg',
                resolve:{
                    group_lst: function(){return api.get_lst();}
                }
            })
        }
    }]);
})