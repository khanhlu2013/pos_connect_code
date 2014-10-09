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
    ]);

    mod.controller('service.menu',
    [
         '$scope'
        ,'group_app/service/manage'
        ,'tax_app/service/edit'
        ,'mix_match_app/service/manage'
        ,'payment_type_app/service/manage'
        ,'shortcut_app/service/manage'
        ,'receipt_app/service/report'
        ,'report_app/service/report_dlg'
    ,function(
         $scope 
        ,manage_group
        ,edit_tax
        ,manage_mm
        ,manage_pt
        ,manage_shortcut
        ,receipt_report_service
        ,sale_report_dlg
    ){
        $scope.menu_group_manage = function(){ var promise = manage_group(); return promise; }
        $scope.menu_mix_match_manage = function(){manage_mm();}
        $scope.menu_tax_edit = function(){edit_tax();}
        $scope.menu_payment_type_manage = function(){manage_pt();}
        $scope.menu_shortcut_manage = function(){manage_shortcut();}
        $scope.menu_receipt_report = function(){receipt_report_service();}
        $scope.menu_report_sale = function(){ sale_report_dlg(); }
    }])

    return mod;
})