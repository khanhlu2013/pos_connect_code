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
        var dlg = $modal.open({
            template:$templateCache.get('model.group.manage.html'),
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