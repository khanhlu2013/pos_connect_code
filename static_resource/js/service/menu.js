define(
[
     'angular'
     //----
    ,'app/tax_app/service/edit'
    ,'app/mix_match_app/service/manage'
    ,'app/payment_type_app/service/manage'
    ,'app/shortcut_app/service/manage'
    ,'app/receipt_app/service/report_new'    
    ,'app/receipt_app/service/push'
    ,'app/report_app/service/report_dlg'
    ,'service/ui'
]
,function
(
    angular
)
{
    var mod = angular.module('service.menu',
    [
         'tax_app/service/edit'
        ,'mix_match_app/service/manage'
        ,'payment_type_app/service/manage'
        ,'shortcut_app/service/manage'
        ,'receipt_app/service/report_new'
        ,'receipt_app/service/push'
        ,'report_app/service/report_dlg'
        ,'service/ui'
    ]);

    mod.controller('service.menu',
    [
         '$scope'
        ,'$window'
        ,'tax_app/service/edit'
        ,'mix_match_app/service/manage'
        ,'payment_type_app/service/manage'
        ,'shortcut_app/service/manage'
        ,'receipt_app/service/report_new'
        ,'report_app/service/report_dlg'
        ,'receipt_app/service/push'
        ,'service/ui/confirm'
    ,function(
         $scope 
        ,$window
        ,edit_tax
        ,manage_mm
        ,manage_pt
        ,manage_shortcut
        ,receipt_report_service
        ,sale_report_dlg
        ,push_receipt_api
        ,confirm_service
    ){
        $scope.menu_setting_mix_match = function(){
            manage_mm();
        }
        $scope.menu_setting_tax = function(){
            edit_tax();
        }
        $scope.menu_setting_payment_type = function(){
            manage_pt();
        }
        $scope.menu_setting_shortcut = function(){
            manage_shortcut();
        }
        $scope.menu_report_receipt = function(){
            receipt_report_service();
        }
        $scope.menu_report_sale = function(){ 
            sale_report_dlg(); 
        }
        $scope.logout = function(){
            confirm_service('logout?','orange').then(
                function(){
                    $window.location.href = '/account/logout/';
                }
            )
        }
        $scope.menu_action_push_receipt = function(){
            var promise = push_receipt_api();
            return promise;
        }
    }])

    return mod;
})