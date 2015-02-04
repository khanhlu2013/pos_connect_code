var mod = angular.module('share.menu');
mod.requires.push.apply(mod.requires,[
    'share.ui',
    'model.group'
])

mod.controller('share.menu.menuCtrl',
[
    '$scope',
    '$rootScope',
    '$window',
    'share.ui.alert',
    'share.ui.confirm',
    'model.group.manage',
function(
    $scope,
    $rootScope,
    $window,
    alert_service,
    confirm_service,
    manage_group
){
    $scope.menu_setting_group = function(){
        manage_group($rootScope.GLOBAL_SETTING);
    }
    $scope.menu_setting_store = function(){
        alert_service('store settings');
    }
    $scope.menu_setting_mix_match = function(){
        alert_service('mix match settings');
    }
    $scope.menu_setting_payment_type = function(){
        alert_service('payment type settings');
    }
    $scope.menu_setting_shortcut = function(){
        alert_service('shortcut');
    }
    $scope.menu_action_logout = function(){
        confirm_service('logout?').then(
            function(){
                $window.location.href = '/account/logout/';
            }
        )
    }
}])
