var mod = angular.module('model.group');
mod.requires.push.apply(mod.requires,[
    'share.ui'
])

mod.factory('model.group.manage',
[
    '$modal',
    '$templateCache',
    'model.group.rest',
function
(
    $modal,
    $templateCache,
    rest_service
){
    return function(){
        var template = 
            '<div class="modal-header"><div class="modal-title"><h3>manage group</h3></div></div>' +
            
            '<div class="modal-body">' +
                '<button id="group_app/service/manage/add_btn" ng-click="add_group()" class="btn btn-primary"><span class="glyphicon glyphicon-plus"></span></button>' +
                '<input type="text" ng-model="local_filter.name" placeHolder="local filter">' +
                '<table ng-hide="group_lst.length == 0" class="table table-hover table-bordered table-condensed table-striped">' +
                    '<tr>' + 
                        '<th>group</th>' +
                        '<th>execute</th>' +                            
                        '<th>delete</th>' +                            
                        '<th>edit</th>' +
                    '</tr>' +

                    '<tr ng-repeat="group in group_lst | filter:local_filter">' +
                        '<td>{{group.name}}</td>' +
                        '<td class="alncenter"><button id="model.group.manage.template.execute_btn" ng-click="execute_group(group.id)" class="btn btn-primary"><span class="glyphicon glyphicon-play"></span></button></td>' +                            
                        '<td class="alncenter"><button id="model.group.manage.template.delete_btn" ng-click="delete_group(group)" class="btn btn-danger"><span class="glyphicon glyphicon-trash"></span></button></td>' +
                        '<td class="alncenter"><button id="model.group.manage.template.edit_btn" ng-click="edit_group(group)"class="btn btn-primary"><span class="glyphicon glyphicon-pencil"></span></button></td>' +
                    '</tr>' +
                '</table>' +
                '<pre ng-show="group_lst.length == 0">there is no group</pre>' +
            '</div>' +
            
            '<div class="modal-footer">' +
                '<button id="group_app/service/manage/exit_btn" ng-click="exit()" class="btn btn-warning"><span class="glyphicon glyphicon-remove"></span></button>' +
            '</div>'                
        ;
                               
        if($templateCache.get('model.group.manage.modalCtrl.template')===undefined ){
            $templateCache.put('model.group.manage.modalCtrl.template',template);
        }

        var dlg = $modal.open({
            template:$templateCache.get('model.group.manage.modalCtrl.template'),
            controller:'model.group.manage.modalCtrl',
            size:'lg',
            resolve:{
                group_lst: function(){
                    return rest_service.get_lst();
                }
            }
        });
        return dlg.result;
    }
}]);

mod.controller('model.group.manage.modalCtrl',
[
    '$scope',
    '$modalInstance',
    '$rootScope',
    'share.ui.confirm',    
    'share.ui.alert',    
    'model.group.execute',
    'model.group.edit',
    'model.group.create',  
    'model.group.rest',      
    'group_lst',   
function(
    $scope,
    $modalInstance,
    $rootScope,
    confirm_service,
    alert_service,
    exe_service,
    edit_service,
    create_service,
    rest_service,
    group_lst
){
    $scope.group_lst = group_lst;

    $scope.execute_group = function(group_id){
        exe_service(group_id);
    }
    $scope.delete_group = function(group){
        confirm_service('delete ' + group.name + ' group?').then(
            function(data){
                if(data === false){
                    return;
                }

                rest_service.delete_item(group.id)
                .then(
                    function(){
                        var index = null;
                        for(var i = 0;i<$scope.group_lst.length;i++){
                            if($scope.group_lst[i].id === group.id){
                                index = i;
                                break;
                            }
                        }

                        if(index === null){
                            alert_service('Bug: should be unreachable. can not find deleted index after success response');
                        }else{
                            $scope.group_lst.splice(i,1);
                        }
                    },
                    function(reason){
                        alert_service(reason);
                    }
                )                            
            }
        )
    }
    $scope.add_group = function(){
        create_service().then(
            function(group){
                $scope.group_lst.push(group);
            },function(reason){
                alert_service(reason);
            }   
        )
    }
    $scope.edit_group = function(group){
        edit_service(group).then(
            function(data){
                angular.copy(data,group);
            },
            function(reason){
                alert_service(reason);
            }
        )                
    }
    $scope.exit = function(){
        $rootScope.$emit('model.group.manage',$scope.group_lst)
        $modalInstance.close();
    }
}])