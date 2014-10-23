define(
[
     'angular'
     //----
    ,'app/group_app/service/manage'
    ,'app/tax_app/service/edit'
    ,'app/mix_match_app/service/manage'
    ,'app/payment_type_app/service/manage'
    ,'app/shortcut_app/service/manage'
    ,'app/receipt_app/service/report'    
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
         'group_app/service/manage'
        ,'tax_app/service/edit'
        ,'mix_match_app/service/manage'
        ,'payment_type_app/service/manage'
        ,'shortcut_app/service/manage'
        ,'receipt_app/service/report'
        ,'report_app/service/report_dlg'
        ,'service/ui'
    ]);

    mod.controller('service.menu',
    [
         '$scope'
        ,'$window'
        ,'group_app/service/manage'
        ,'tax_app/service/edit'
        ,'mix_match_app/service/manage'
        ,'payment_type_app/service/manage'
        ,'shortcut_app/service/manage'
        ,'receipt_app/service/report'
        ,'report_app/service/report_dlg'
        ,'service/ui/confirm'
    ,function(
         $scope 
        ,$window
        ,manage_group
        ,edit_tax
        ,manage_mm
        ,manage_pt
        ,manage_shortcut
        ,receipt_report_service
        ,sale_report_dlg
        ,confirm_service
    ){
        $scope.menu_group_manage = function(){ var promise = manage_group(); return promise; }
        $scope.menu_mix_match_manage = function(){manage_mm();}
        $scope.menu_tax_edit = function(){edit_tax();}
        $scope.menu_payment_type_manage = function(){manage_pt();}
        $scope.menu_shortcut_manage = function(){manage_shortcut();}
        $scope.menu_receipt_report = function(){receipt_report_service();}
        $scope.menu_report_sale = function(){ sale_report_dlg(); }
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