var mod = angular.module('model.group');
mod.requires.push.apply(mod.requires,[
    'share.ui',
    'share.util',
    'model.store_product'
])
mod.factory('model.group.prompt',
[
    '$modal',
    '$templateCache',
    'share.ui.alert',
    'share.util.misc',
    'model.store_product.search.online.multiple',
function(
    $modal,
    $templateCache,
    alert_service,
    misc_util,
    search_sp_online_multiple_service
){
    return function(original_group){
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
            template:$templateCache.get('model.group.prompt.html'),
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