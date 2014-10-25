define(
[
    'angular'
    ,'app/receipt_app/service/push'
    ,'app/receipt_app/service/api'
    ,'service/ui'
    ,'app/receipt_app/service/api_offline'
    ,'app/sale_app/service/sale_able_info_dlg'
]
,function
(
    angular
)
{
    var mod = angular.module('receipt_app/service/report_new',
    [
         'receipt_app/service/push'
        ,'receipt_app/service/api'
        ,'service/ui'
        ,'receipt_app/service/api_offline'
        ,'sale_app/service/sale_able_info_dlg'
    ]);
    mod.factory('receipt_app/service/report_new',
    [
         '$modal'
        ,'receipt_app/service/push'
        ,'receipt_app/service/api'
        ,'service/ui/alert'
        ,'receipt_app/service/api_offline'
        ,'sale_app/service/sale_able_info_dlg'
    ,function(
         $modal
        ,push_receipt
        ,receipt_online_api
        ,alert_service
        ,receipt_offline_api
        ,sale_able_info_dlg
    ){
        return function(){
            var template_left_online_table = 
                '<table ng-hide="online_receipt_lst.length===0" class="table table-hover table-bordered table-condensed table-striped">' +
                    '<tr>' +
                        '<th>time</th>' +
                        '<th>total</th>' +
                        '<th>info</th>' +
                    '</tr>' +

                    '<tr ng-repeat="online_receipt in online_receipt_lst | orderBy:\'-date\'">' +
                        '<td>{{online_receipt.date | date : \'M/d h:mm a\'}}</td>' +
                        '<td>{{online_receipt.get_otd_price() | currency}}</td>' +
                        '<td class="alncenter"><button class="btn glyphicon glyphicon-info-sign" ng-class="is_cur_online_receipt(online_receipt) ? \'btn-warning\' : \'btn-primary\'" ng-click="toogle_cur_online_receipt(online_receipt)"></button></td>' +
                    '</tr>' +                        
                '</table>' +
                '<pre ng-show="online_receipt_lst.length===0">there is no receipt data</pre>'
            ;

            var template_right_online_table = 
                '<table class="table table-hover table-bordered table-condensed table-striped">' +
                    '<tr>' +
                        '<th>qty</th>' +
                        '<th>product</th>' +
                        '<th>price</th>' +
                    '</tr>' +

                    '<tr ng-repeat="receipt_ln in $parent.cur_online_receipt.receipt_ln_lst | orderBy:\'date\'">' +
                        '<td>{{receipt_ln.qty}}</td>' +
                        '<td>{{receipt_ln.get_name()}}</td>' +
                        '<td class="alncenter"><button ng-click="display_sale_able_info_dlg(receipt_ln)" class="btn btn-primary">{{receipt_ln.get_advertise_price() | currency}}</button></td>' +
                    '</tr>' +
                '</table>'
            ;    
            var receipt_summary_online_template = 
                '<div class="form-horizontal" >' +
                    '<div id="receipt_app/service/report/online/receipt_summary/subtotal_derivation" ng-hide="cur_online_receipt.get_saving()===0.0 && cur_online_receipt.get_crv()===0.0">' +
                        '<div class="form-group">' +
                            '<label class="col-sm-4 control-label">original price:</label>' +
                            '<p id="receipt_app/service/report/online/receipt_summary/genesis_price" class="col-sm-8 form-control-static">{{cur_online_receipt.get_genesis_price()}}</p>' +
                        '</div>' +
                        '<div ng-hide="cur_online_receipt.get_saving()===0.0" class="form-group">' +
                            '<label class="col-sm-4 control-label">saving:</label>' +
                            '<p id="receipt_app/service/report/online/receipt_summary/saving" class="col-sm-8 form-control-static">{{(cur_online_receipt.get_saving() * -1) | currency}}</p>' +
                        '</div>' +
                        '<div ng-hide="cur_online_receipt.get_crv()===0.0" class="form-group">' +
                            '<label class="col-sm-4 control-label">crv:</label>' +
                            '<p id="receipt_app/service/report/online/receipt_summary/crv" class="col-sm-8 form-control-static">{{cur_online_receipt.get_crv()|currency}}</p>' +
                        '</div>' +
                        '<hr>' +
                    '</div>' +

                    '<div class="form-group">' +
                        '<label class="col-sm-4 control-label">subtotal:</label>' +
                        '<p id="receipt_app/service/report/online/receipt_summary/subtotal" class="col-sm-8 form-control-static">{{cur_online_receipt._get_b4_tax_price()|currency}}</p>' +
                    '</div>' +
                    
                    '<div ng-hide="cur_online_receipt.get_buydown_tax()===0.0" class="form-group">' +
                        '<label class="col-sm-4 control-label">buydown tax:</label>' +
                        '<p id="receipt_app/service/report/online/receipt_summary/buydown_tax" class="col-sm-8 form-control-static">{{cur_online_receipt.get_buydown_tax()|currency}}</p>' +
                    '</div>' +

                    '<div class="form-group">' +
                        '<label class="col-sm-4 control-label">tax ({{cur_online_receipt.tax_rate}}%):</label>' +
                        '<p id="receipt_app/service/report/online/receipt_summary/tax" class="col-sm-8 form-control-static">{{cur_online_receipt.get_product_tax()|currency}}</p>' +
                    '</div>' +

                    '<hr>' +

                    '<div class="form-group">' +
                        '<label class="col-sm-4 control-label">total:</label>' +
                        '<p id="receipt_app/service/report/receipt_summary/total" class="col-sm-8 form-control-static">{{cur_online_receipt.get_otd_price()|currency}}</p>' +
                    '</div>' +

                    '<div ng-repeat="tender_ln in cur_online_receipt.tender_ln_lst" class="form-group">' +
                        '<label' +
                            ' ng-attr-id="receipt_app/service/report/online/receipt_summary/tender_lbl/{{tender_ln.pt === null ? \'null\' : tender_ln.pt.id}}"' +
                            ' class="col-sm-4 control-label">' +
                                '{{tender_ln.name === null ? \'cash\' : tender_ln.pt.name}}:' + 
                        '</label>' +
                        '<p' +
                            ' ng-attr-id="receipt_app/service/report/online/receipt_summary/tender_txt/{{tender_ln.pt === null ? \'null\' : tender_ln.pt.id}}"' +
                            ' class="col-sm-8 form-control-static">' +
                                '{{(tender_ln.amount)|currency}}' +
                        '</p>' +
                    '</div>' +

                    '<hr>' +

                    '<div class="form-group">' +
                        '<label class="col-sm-4 control-label">change:</label>' +
                        '<p id="receipt_app/service/report/online/receipt_summary/change" class="col-sm-8 form-control-static">{{cur_online_receipt.get_change()|currency}}</p>' +
                    '</div>' + 
                '</div>'  /* end form horizontal*/
            ;                    
            var template = 
                '<div class="modal-header"><h3>Receipts</h3></div>' +
                '<div class="modal-body">' +
                    '<div>' +                  
                        '<p ng-hide="is_internet_offline" class="input-group" id="receipt_app/serivce/report/control_panel">' +
                            //from date
                            '<input type="text" class="form-control" datepicker-popup="MM-dd-yyyy" ng-model="$parent.from_date" is-open="$parent.opened_from" close-text="close" datepicker-options="dateOptions"></input>' +
                            '<span class="input-group-btn">' +
                                '<button type="button" class="btn btn-default" ng-click="open_date_dlg($event,\'opened_from\')"><i class="glyphicon glyphicon-calendar"></i></button>' +
                            '</span>' +
                            //to date
                            '<input type="text" class="form-control" datepicker-popup="MM-dd-yyyy" ng-model="$parent.to_date" is-open="$parent.opened_to" close-text="close" datepicker-options="dateOptions"></input>' +
                            '<span class="input-group-btn">' +
                                '<button type="button" class="btn btn-default" ng-click="open_date_dlg($event,\'opened_to\')"><i class="glyphicon glyphicon-calendar"></i></button>' +
                            '</span>' + 
                            //refresh
                            '<span class="input-group-btn">' +
                                '<button ng-click="refresh_report()" ng-disabled="from_date==null||to_date==null" class="btn btn-primary"><i class="glyphicon glyphicon-refresh"></i></button>'  +  
                            '</span>' +
                            '<span class="input-group-btn">' +
                                '<button id="receipt_app/service/report/today_report_btn" ng-click="refresh_today_report()" class="btn btn-primary">today report</button>'  +                      
                            '</span>' +
                        '</p>' +

                        '<div>' +
                            '<div class="col-sm-4">' + template_left_online_table + '</div>' +
                            '<div ng-hide="$parent.cur_online_receipt==null" class="col-sm-8">' + 
                                template_right_online_table + 
                                receipt_summary_online_template +
                            '</div>' +
                            '<div class="clear"></div>' +                    
                        '</div>' +
                    '</div>' +
                '</div>' +
                '<div class="modal-footer">' +
                    '<button id="receipt_app/service/report/exit_btn" class="btn btn-warning" ng-click="exit()">exit</button>' +
                '</div>' 
            ;

            var ModalCtrl = function($scope,$modalInstance){
                $scope.display_sale_able_info_dlg = function(receipt_ln){
                    sale_able_info_dlg(receipt_ln,false/*is_enable_override_price*/);
                }
                $scope.toogle_cur_online_receipt = function(receipt){
                    if($scope.is_cur_online_receipt(receipt)){ $scope.cur_online_receipt = null;}
                    else{ $scope.cur_online_receipt = receipt; }
                }
                $scope.is_cur_online_receipt = function(receipt){
                    if($scope.cur_online_receipt === null){ return false; }
                    else{ return $scope.cur_online_receipt === receipt }
                }    
                $scope.open_date_dlg = function($event,from_or_to) {
                    $event.preventDefault();
                    $event.stopPropagation();
                    $scope[from_or_to] = true;
                };   
                $scope.refresh_today_report = function(){
                    $scope.from_date = new Date();
                    $scope.to_date = new Date();
                    $scope.refresh_report();                                     
                }
                $scope.refresh_report = function(){
                    receipt_online_api.get_receipt($scope.from_date,$scope.to_date).then(
                        function(data){ 
                            $scope.online_receipt_lst = data; 
                        }
                        ,function(reason){ 
                            alert_service(reason);
                        }
                    )
                }
                $scope.exit = function(){$modalInstance.dismiss('_cancel_');}

                // $scope.online_receipt_lst = [];
                $scope.cur_online_receipt = null;
                $scope.from_date = null;
                $scope.to_date = null;
                $scope.is_internet_offline = false;

                push_receipt().then(
                    function(){
                        var default_number_receipt = 15;
                        receipt_online_api.get_receipt_by_count(default_number_receipt).then(
                            function(data){ 
                                $scope.online_receipt_lst = data; 
                            }
                            ,function(reason){ 
                                alert_service(reason); 
                            }
                        )
                    }
                    ,function(reason){
                        if(reason.status === 0){
                            $scope.is_internet_offline = true;
                            alert_service('internet is disconnected. you can only access to offline receipt');
                            receipt_offline_api.get_receipt_lst().then(
                                function(lst){
                                    $scope.online_receipt_lst = lst;
                                }
                                ,function(reason){
                                    alert_service(reason);
                                }
                            );
                        }else{
                            alert_service(reason);
                        }
                    }
                )
            }
            ModalCtrl.$inject = ['$scope','$modalInstance'];    
            $modal.open({
                 template:template
                ,controller:ModalCtrl
                ,size:'lg'
            });
        }
    }])
})