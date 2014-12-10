define(
[
     'angular'
     //----
    ,'model/store/service/set_tax'
    ,'model/mix_match/service/manage'
    ,'model/payment_type/service/manage'
    ,'model/shortcut/service/manage'
    ,'service/ui'

]
,function
(
    angular
)
{
    var mod = angular.module('service.menu',
    [
         'store/service/set_tax'
        ,'mix_match/service/manage'
        ,'payment_type/service/manage'
        ,'shortcut/service/manage'
        ,'service/ui'

    ]);

    mod.controller('service.menu',
    [
         '$scope'
        ,'$window'
        ,'$q'
        ,'store/service/set_tax'
        ,'mix_match/service/manage'
        ,'payment_type/service/manage'
        ,'shortcut/service/manage'
        ,'service/ui/confirm'

    ,function(
         $scope 
        ,$window
        ,$q
        ,set_tax_service
        ,manage_mm
        ,manage_pt
        ,manage_shortcut
        ,confirm_service
    ){
        $scope.menu_setting_mix_match = function(){
            manage_mm();
        }
        $scope.menu_setting_tax = function(){
            set_tax_service();
        }
        $scope.menu_setting_payment_type = function(){
            manage_pt();
        }
        $scope.menu_setting_shortcut = function(){
            manage_shortcut();
        }
        $scope.logout = function(){
            confirm_service('logout?','orange').then(
                function(){
                    $window.location.href = '/account/logout/';
                }
            )
        }
    }])

    return mod;
})