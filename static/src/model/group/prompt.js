var mod = angular.module('model.group');
mod.requires.push.apply(mod.requires,[
    'share.ui',
    'share.util',
    'model.store_product'
])
mod.factory('model.group.prompt',
[
    '$modal',
    'share.ui.alert',
    'share.util.misc',
    'model.store_product.search.online.multiple',
function(
    $modal,
    alert_service,
    misc_util,
    search_sp_online_multiple_service
){
    return function(original_group){
        var template = 
            '<div class="modal-header"><h3>{{original_group.name==undefined?\'Create new group\' : \'Edit group \'+ original_group.name}}</h3></div>' +
            '<div class="modal-body">' +
                '<div name="form" class="form-group">' + 
                    '<label>group name:</label>' +
                    '<input id="group_app/service/prompt/name_txt" name="name" ng-model="group.name" type="text" focus-me={{true}} required>' +
                    '<label class="error" ng-show="form.name.$error.required">required</label>' +
                '</div>' +

                '<button id="group_app/service/prompt/add_btn" ng-click="add_sp()" class="btn btn-primary"><span class="glyphicon glyphicon-plus"></span></button>' +
                '<table ng-hide="group.sp_lst.length == 0" class="table table-hover table-bordered table-condensed table-striped">' +
                    '<tr>' +
                        '<th>product</th>' +
                        '<th>remove</th>' +
                    '</tr>' +

                    '<tr ng-repeat="sp in group.sp_lst">' +
                        '<td>{{sp.name}}</td>' +
                        '<td class="alncenter"><button ng-click="remove_sp(sp)"class="btn btn-danger"><span class="glyphicon glyphicon-trash"></span></button></td>' +
                    '</tr>' +
                '</table>' +
                '<pre ng-show="group.sp_lst.length == 0">there is no product in this group</pre>' +
            '</div>' + 
            '<div class="modal-footer">' +
                '<button id="group_app/service/prompt/cancel_btn" ng-click="cancel()" class="btn btn-warning">cancel</button>' + 
                '<button ng-disabled="is_unchange()" ng-click="reset()" class="btn btn-primary">reset</button>' + 
                '<button id="group_app/service/prompt/ok_btn" ng-disabled="form.$invalid || is_unchange()" ng-click="ok()" class="btn btn-success">ok</button>' + 
            '</div>'
        ;
        var ModalCtrl = function($scope,$modalInstance,original_group){
            if(original_group == null){
                original_group = {sp_lst:[]};
            }
            $scope.original_group = original_group;
            $scope.group = angular.copy($scope.original_group);

            $scope.remove_sp = function(sp){
                for(var i = 0;i<$scope.group.sp_lst.length;i++){
                    if(sp.id == $scope.group.sp_lst[i].id){
                        $scope.group.sp_lst.splice(i,1);
                        break;
                    }
                }
            }

            $scope.add_sp = function(){
                search_sp_online_multiple_service().then(
                    function(sp_lst){
                        for(var i = 0;i<sp_lst.length;i++){
                            if(misc_util.get_item_from_lst_base_on_id(sp_lst[i].id,$scope.group.sp_lst) == null){
                                $scope.group.sp_lst.push(sp_lst[i]);
                            }
                        }
                    },
                    function(reason){
                        alert_service(reason);
                    }
                )

            }
            $scope.is_unchange = function(){
                return angular.equals($scope.group,$scope.original_group);
            }
            $scope.reset = function(){
                $scope.group = angular.copy($scope.original_group);
            }
            $scope.ok = function(){
                $modalInstance.close($scope.group);
            }
            $scope.cancel = function(){
                $modalInstance.dismiss('_cancel_');
            }
        }
        ModalCtrl.$inject = ['$scope','$modalInstance','original_group'];
        var dlg = $modal.open({
            template:template,
            controller:ModalCtrl,
            size:'md',
            backdrop:'static',
            resolve:{
                original_group:function(){return original_group}
            }
        })

        return dlg.result;
    }
}]);