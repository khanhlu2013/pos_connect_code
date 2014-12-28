define(
[
     'angular'
     //----
    ,'service/ui'
    ,'model/store/service/set_tax'
    ,'model/mix_match/service/manage'
    ,'model/payment_type/service/manage'
    ,'model/shortcut/service/manage'
    ,'model/store/service'
]
,function
(
    angular
)
{
    var mod = angular.module('service.menu',
    [
         'service/ui'
        ,'store/service/set_tax'
        ,'mix_match/service/manage'
        ,'payment_type/service/manage'
        ,'shortcut/service/manage'
        ,'store/service'
    ]);

    mod.controller('service.menu',
    [
         '$scope'
        ,'$window'
        ,'$q'
        ,'service/ui/confirm'
        ,'service/ui/alert'        
        ,'store/service/set_tax'
        ,'mix_match/service/manage'
        ,'payment_type/service/manage'
        ,'shortcut/service/manage'
        ,'store/service/edit'
    ,function(
         $scope 
        ,$window
        ,$q
        ,confirm_service
        ,alert_service        
        ,set_tax_service
        ,manage_mm
        ,manage_pt
        ,manage_shortcut
        ,edit_store_service
    ){
        $scope.menu_setting_store = function(){
            edit_store_service();
        }
        $scope.menu_setting_mix_match = function(){
            manage_mm();
        }
        $scope.menu_setting_tax = function(){
            set_tax_service().then(
                function(){

                },function(reason){
                    alert_service(reason);
                }
            )
        }
        $scope.menu_setting_payment_type = function(){
            manage_pt();
        }
        $scope.menu_setting_shortcut = function(){
            manage_shortcut();
        }
        $scope.menu_action_logout = function(){
            confirm_service('logout?','orange').then(
                function(){
                    $window.location.href = '/account/logout/';
                }
            )
        }
    }])

    return mod;
})