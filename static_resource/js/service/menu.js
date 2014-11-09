define(
[
     'angular'
     //----
    ,'app/tax_app/service/edit'
    ,'app/mix_match_app/service/manage'
    ,'app/payment_type_app/service/manage'
    ,'app/shortcut_app/service/manage'
    ,'app/receipt_app/service/report_new'    
    ,'app/report_app/service/report_dlg'
    ,'service/ui'
    ,'app/receipt_app/service/push'
    ,'service/db'
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
        ,'report_app/service/report_dlg'
        ,'service/ui'
        ,'receipt_app/service/push'
        ,'service/db'
    ]);

    mod.controller('service.menu',
    [
         '$scope'
        ,'$window'
        ,'$q'
        ,'tax_app/service/edit'
        ,'mix_match_app/service/manage'
        ,'payment_type_app/service/manage'
        ,'shortcut_app/service/manage'
        ,'receipt_app/service/report_new'
        ,'report_app/service/report_dlg'
        ,'service/ui/confirm'
        ,'service/ui/alert'
        ,'receipt_app/service/push'
        ,'service/db/download_product'
    ,function(
         $scope 
        ,$window
        ,$q
        ,edit_tax
        ,manage_mm
        ,manage_pt
        ,manage_shortcut
        ,receipt_report_service
        ,sale_report_dlg
        ,confirm_service
        ,alert_service
        ,push_receipt
        ,download_product
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
        $scope.menu_action_sync = function(){
            push_receipt().then(
                function(push_response){
                    if(push_response === null){
                        alert_service('there is no offline database to sync');
                    }else if(push_response.number_receipt_push !== 0){
                        //download product is already perform in push service
                        if(push_response.local !== push_response.remote && push_response.local !== undefined && push_response.remote !== undefined){
                            alert_service(response.remote - response.local + ' products missing. please sync again.');
                        }else{
                            alert_service('receipt: ' + push_response.number_receipt_push + ', update product:' + push_response.docs_written + ', total product:' + push_response.local,'info','green');
                        }
                    }else{
                        //there is offline database but there is no offline receipt. in this case, push does not do a download product. lets do it now
                        download_product(false/*not force. by now, we know local db exist*/).then(
                            function(response){
                                if(response.local !== response.remote){
                                    alert_service(response.remote - response.local + ' products missing. please sync again.');
                                }else{
                                    alert_service('receipt: 0' + ', update product:' + response.docs_written + ', total product:' + response.local,'info','green');
                                }
                            }
                            ,function(reason){
                                alert_service(reason);
                            }
                        )                     
                    }
                }
                ,function(reason){
                    alert_service(reason);
                }
            )
        }
    }])

    return mod;
})