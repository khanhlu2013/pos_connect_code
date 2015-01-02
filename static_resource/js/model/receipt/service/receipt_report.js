define(
[
    'angular'
    ,'model/receipt/service/push'
    ,'model/receipt/api'
    ,'service/ui'
    ,'model/receipt/api_offline'
    ,'app/sale_app/service/sale_able_info_dlg'
    ,'app/sale_app/service/tender_ui'
    ,'model/receipt/service/adjust_receipt_tender'    
]
,function
(
    angular
)
{
    var mod = angular.module('receipt/service/receipt_report',
    [
         'receipt/service/push'
        ,'receipt/api'
        ,'service/ui'
        ,'receipt/api_offline'
        ,'sale_app/service/sale_able_info_dlg'
        ,'sale_app/service/tender_ui'
        ,'receipt/service/adjust_receipt_tender'        
    ]);
    mod.factory('receipt/service/receipt_report',
    [
         '$modal'
        ,'receipt/service/push'
        ,'receipt/api'
        ,'service/ui/alert'
        ,'receipt/api_offline'
        ,'sale_app/service/sale_able_info_dlg'
        ,'sale_app/service/tender_ui'
        ,'receipt/service/adjust_receipt_tender'        
    ,function(
         $modal
        ,push_receipt
        ,receipt_online_api
        ,alert_service
        ,receipt_offline_api
        ,sale_able_info_dlg
        ,tender_ui
        ,adjust_receipt_tender
    ){
        return function(GLOBAL_SETTING){
            var template_receipt_table = 
                '<table ng-hide="receipt_lst.length===0" class="table table-hover table-bordered table-condensed table-striped">' +
                    '<tr>' +
                        '<th>time</th>' +
                        '<th>total</th>' +
                        '<th>info</th>' +
                    '</tr>' +

                    '<tr ng-repeat="receipt in receipt_lst | orderBy:\'-date\'">' +
                        '<td>{{receipt.date | date : \'M/d h:mm a\'}}</td>' +
                        '<td>{{receipt.get_otd_price() | currency}}</td>' +
                        '<td class="alncenter"><button class="btn glyphicon glyphicon-info-sign" ng-class="is_cur_receipt(receipt) ? \'btn-warning\' : \'btn-primary\'" ng-click="toogle_cur_receipt(receipt)"></button></td>' +
                    '</tr>' +                        
                '</table>' +
                '<pre ng-show="receipt_lst.length===0">there is no receipt data</pre>'
            ;

            var template_receipt_ln_table = 
                '<table id="receipt_app/service/report/ds_lst" class="table table-hover table-bordered table-condensed table-striped">' +
                    '<tr>' +
                        '<th>qty</th>' +
                        '<th>product</th>' +
                        '<th>price</th>' +
                    '</tr>' +

                    '<tr ng-repeat="receipt_ln in $parent.cur_receipt.receipt_ln_lst | orderBy:\'date\'">' +
                        '<td>{{receipt_ln.qty}}</td>' +
                        '<td>{{receipt_ln.get_name()}}</td>' +
                        '<td class="alncenter"><button ng-click="display_sale_able_info_dlg(receipt_ln,$parent.cur_receipt.tax_rate)" class="btn btn-primary">{{receipt_ln.get_advertise_price() | currency}}</button></td>' +
                    '</tr>' +
                '</table>'
            ;    
            var receipt_summary_template = 
                '<div class="form-horizontal" >' +
                    '<div id="receipt_app/service/report/receipt_summary/subtotal_derivation" ng-hide="cur_receipt.get_saving()===0.0 && cur_receipt.get_crv()===0.0">' +
                        '<div id="receipt_app/service/report/receipt_summary/original_price" class="form-group">' +
                            '<label ng-class="receipt_summary_lbl_class">original price:</label>' +
                            '<p ng-class="receipt_summary_value_class">{{cur_receipt.get_genesis_price()|currency}}</p>' +
                        '</div>' +
                        '<div id="receipt_app/service/report/receipt_summary/saving_div" ng-hide="cur_receipt.get_saving()===0.0" class="form-group">' +
                            '<label ng-class="receipt_summary_lbl_class">saving:</label>' +
                            '<p id="receipt_app/service/report/receipt_summary/saving" ng-class="receipt_summary_value_class">{{(cur_receipt.get_saving() * -1) | currency}}</p>' +
                        '</div>' +
                        '<div id="receipt_app/service/report/receipt_summary/crv_div" ng-hide="cur_receipt.get_crv()===0.0" class="form-group">' +
                            '<label ng-class="receipt_summary_lbl_class">crv:</label>' +
                            '<p id="receipt_app/service/report/receipt_summary/crv" ng-class="receipt_summary_value_class">{{cur_receipt.get_crv()|currency}}</p>' +
                        '</div>' +
                        '<hr>' +
                    '</div>' +

                    '<div id="receipt_app/service/report/receipt_summary/subtotal_div" class="form-group">' +
                        '<label ng-class="receipt_summary_lbl_class">subtotal:</label>' +
                        '<p id="receipt_app/service/report/receipt_summary/subtotal" ng-class="receipt_summary_value_class">{{cur_receipt._get_b4_tax_price()|currency}}</p>' +
                    '</div>' +
                    
                    '<div id="receipt_app/service/report/receipt_summary/buydown_tax_div" ng-hide="cur_receipt.get_buydown_tax()===0.0" class="form-group">' +
                        '<label ng-class="receipt_summary_lbl_class">buydown tax:</label>' +
                        '<p id="receipt_app/service/report/receipt_summary/buydown_tax" ng-class="receipt_summary_value_class">{{cur_receipt.get_buydown_tax()|currency}}</p>' +
                    '</div>' +

                    '<div id="receipt_app/service/report/receipt_summary/tax_div" class="form-group">' +
                        '<label ng-class="receipt_summary_lbl_class">tax ({{cur_receipt.tax_rate}}%):</label>' +
                        '<p id="receipt_app/service/report/receipt_summary/tax" ng-class="receipt_summary_value_class">{{cur_receipt.get_product_tax()|currency}}</p>' +
                    '</div>' +

                    '<hr>' + /* total and tender amount-------------------------------------------------------------------------------------------------------------- */

                    '<div id="receipt_app/service/report/receipt_summary/total_div" class="form-group">' +
                        '<label ng-class="receipt_summary_lbl_class">total:</label>' +
                        '<p id="receipt_app/service/report/receipt_summary/total" ng-class="receipt_summary_value_class">{{cur_receipt.get_otd_price()|currency}}</p>' +
                    '</div>' +

                    '<div id="receipt_app/service/report/receipt_summary/tender_div" ng-repeat="tender_ln in cur_receipt.tender_ln_lst | orderBy:sort_tender_ln_func" class="form-group">' +
                        '<label' +
                            ' ng-attr-id="receipt_app/service/report/receipt_summary/tender_lbl/{{tender_ln.pt === null ? \'null\' : tender_ln.pt.id}}"' +
                            ' ng-class="receipt_summary_lbl_class">' +
                                '{{tender_ln.name === null ? \'cash\' : tender_ln.pt.name}}:' + 
                        '</label>' +
                        '<p' +
                            ' ng-attr-id="receipt_app/service/report/receipt_summary/tender_value/{{tender_ln.pt === null ? \'null\' : tender_ln.pt.id}}"' +
                            ' ng-class="receipt_summary_value_class">' +
                                '{{(tender_ln.amount)|currency}}' +
                        '</p>' +
                    '</div>' +

                    '<hr>' +

                    '<div id="receipt_app/service/report/receipt_summary/change_div" class="form-group">' +
                        '<label ng-class="receipt_summary_lbl_class">change:</label>' +
                        '<p id="receipt_app/service/report/receipt_summary/change" ng-class="receipt_summary_value_class">{{cur_receipt.get_change()|currency}}</p>' +
                    '</div>' + 
                '</div>'  /* end form horizontal*/
            ;                    
            var receipt_button_toolbar_template = 
                '<div ng-hide="$parent.cur_receipt===null" class="btn-group">' +
                    '<button id="receipt_app/service/report/print_btn" class="btn btn-primary" ng-click="print_cur_receipt()">print</button>' +
                    '<button id="receipt_app/service/report/receipt_summary/change_receipt_tender_btn" class="btn btn-primary" ng-click="adjust_cur_receipt_tender_ln()">adjust tender</button>' +      
                    '<button class="btn btn-primary" ng-click="return_cur_receipt_product()">return product</button>' +                                  
                '</div>'
            ;
            var template = 
                '<div class="modal-header"><h3>{{is_internet_offline? \'Offline receipts\' : \'Receipts\'}}</h3></div>' +
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
                            '<div id="receipt_app/service/report/master" class="col-xs-4">' + template_receipt_table + '</div>' +
                            '<div id="receipt_app/service/report/detail" ng-hide="$parent.cur_receipt===null" class="col-xs-8">' + 
                                receipt_button_toolbar_template +
                                template_receipt_ln_table + 
                                receipt_summary_template +
                            '</div>' +
                            '<div class="clear"></div>' +                    
                        '</div>' +
                    '</div>' +
                '</div>' +
                '<div class="modal-footer">' +
                    '<button id="receipt_app/service/report/exit_btn" class="btn btn-warning" ng-click="exit()">exit</button>' +
                '</div>' 
            ;

            var ModalCtrl = function($scope,$modalInstance,GLOBAL_SETTING){
                $scope.receipt_summary_lbl_class = 'col-xs-4 control-label';
                $scope.receipt_summary_value_class = 'col-xs-8 form-control-static';

                $scope.sort_tender_ln_func = function(tender_ln) {
                    if(tender_ln.pt === null){
                        return null;
                    }else{
                        return tender_ln.pt.sort;
                    }
                };

                $scope.display_sale_able_info_dlg = function(receipt_ln,tax_rate){
                    sale_able_info_dlg(receipt_ln,false/*is_enable_override_price*/,tax_rate);
                }
                $scope.toogle_cur_receipt = function(receipt){
                    if($scope.is_cur_receipt(receipt)){ 
                        $scope.cur_receipt = null;
                    }else{ 
                        $scope.cur_receipt = receipt; 
                    }
                }
                $scope.is_cur_receipt = function(receipt){
                    if($scope.cur_receipt === null){ return false; }
                    else{ return $scope.cur_receipt === receipt }
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
                    receipt_online_api.get_receipt_by_range($scope.from_date,$scope.to_date).then(
                        function(data){ 
                            $scope.receipt_lst = data; 
                        }
                        ,function(reason){ 
                            alert_service(reason);
                        }
                    )
                }
                $scope.return_cur_receipt_product = function(){
                    alert_service('return products is a complicated feature. Not sure when i am going to do it.','Sorry!','green');
                }                
                $scope.adjust_cur_receipt_tender_ln = function(){
                    tender_ui($scope.cur_receipt.receipt_ln_lst,$scope.cur_receipt.tender_ln_lst,$scope.cur_receipt.tax_rate,GLOBAL_SETTING).then(
                        function(new_tender_ln_lst){
                            adjust_receipt_tender($scope.cur_receipt,new_tender_ln_lst,GLOBAL_SETTING).then(
                                function(adjust_receipt){
                                    var index = -1;
                                    for(var i = 0;i<$scope.receipt_lst.length;i++){
                                        if($scope.receipt_lst[i] === $scope.cur_receipt);
                                        index = i;
                                        break;
                                    }
                                    $scope.receipt_lst[index] = adjust_receipt;
                                    $scope.cur_receipt = adjust_receipt;
                                },function(reason){
                                    alert_service(reason);
                                }
                            )
                        },function(reason){
                            alert_service(reason);
                        }
                    )
                }
                $scope.print_cur_receipt = function() {
                    var ds_lst_html = document.getElementById('receipt_app/service/report/ds_lst').outerHTML;
                    var subtotal_derivation_html = "";
                    if($scope.cur_receipt.get_saving()!==0.0 || $scope.cur_receipt.get_crv()!==0.0){
                        subtotal_derivation_html += document.getElementById('receipt_app/service/report/receipt_summary/original_price').innerHTML;                          
                    }                        
                    if($scope.cur_receipt.get_saving()!==0.0){
                        subtotal_derivation_html += document.getElementById('receipt_app/service/report/receipt_summary/saving_div').innerHTML;
                    }
                    if($scope.cur_receipt.get_crv()!==0.0){
                        subtotal_derivation_html += document.getElementById('receipt_app/service/report/receipt_summary/crv_div').innerHTML;
                    }                      
                    var subtotal_html = document.getElementById('receipt_app/service/report/receipt_summary/subtotal_div').innerHTML;
                    var buydown_tax_html = "";
                    if($scope.cur_receipt.get_buydown_tax()!==0.0){
                        buydown_tax_html += document.getElementById('receipt_app/service/report/receipt_summary/buydown_tax_div').innerHTML;
                    }                     
                    var tax_html = document.getElementById('receipt_app/service/report/receipt_summary/tax_div').innerHTML;                    
                    var total_html = document.getElementById('receipt_app/service/report/receipt_summary/total_div').innerHTML;    
                    var tender_html = document.getElementById('receipt_app/service/report/receipt_summary/tender_div').innerHTML;                        
                    var change_html = document.getElementById('receipt_app/service/report/receipt_summary/change_div').innerHTML;    

                    var main_html = 
                        ds_lst_html + '\n' +
                        '<div class="form-horizontal">' + '\n' +
                            subtotal_derivation_html + '\n' +
                            subtotal_html + '\n' +
                            buydown_tax_html + '\n' +
                            tax_html + '\n' +
                            total_html + '\n' +
                            tender_html + '\n' +
                            change_html + '\n' +
                        '</div>'
                    ;
                    var static_url = GLOBAL_SETTING.STATIC_URL;
                    var css_str = 
                        '<link rel="stylesheet" type ="text/css" href="' + static_url + 'css/bootstrap.css">' +
                        '<link rel="stylesheet" type ="text/css" href="' + static_url + 'css/bootstrap-theme.css">' +
                        '<link rel="stylesheet" type ="text/css" href="' + static_url + 'css/share.css">'
                    ;
                    var html = '<html><head>' + css_str + '</head><body>' + main_html + '</html>'

                    var popupWin = window.open('', '_blank', 'width=300,height=300');
                    popupWin.document.open();
                    popupWin.document.write(html);
                    popupWin.document.close();
                    popupWin.print();
                    popupWin.close();
                }                 
                $scope.exit = function(){
                    $modalInstance.close();
                }
                function handle_internet_offline(){
                    $scope.is_internet_offline = true;
                    receipt_offline_api.get_receipt_lst(GLOBAL_SETTING).then(
                        function(lst){
                            $scope.receipt_lst = lst;
                            var message = 'Internet is disconnected! ';
                            if(lst.length ===0){
                                message += 'You can only see offline receipt but there is none.'
                            }else{
                                message += 'You can only access offline receipts.'
                            }
                            alert_service(message);                            
                        }
                        ,function(reason){
                            alert_service(reason);
                        }
                    );
                }
                $scope.cur_receipt = null;
                $scope.from_date = null;
                $scope.to_date = null;
                $scope.is_internet_offline = false;
                push_receipt(GLOBAL_SETTING).then(
                    function(){
                        var default_number_receipt = 15;
                        receipt_online_api.get_receipt_by_count(default_number_receipt).then(
                            function(data){ 
                                $scope.receipt_lst = data; 
                            }
                            ,function(reason){ 
                                if(reason.status === 0){
                                    handle_internet_offline();//usually, when internet is offline, push_receipt will reject the promise (which cause the code to jump into the reject function and not here) unless offline_receipt.length === 0. if could get here under this case, thus we have to handle offline internet here as well. this method will go and get offline receipt again eventhough we already know that offline_receipt.lenght === 0 now. this could be an optimization to pass in handle_offline_internet method a param saying don't bother getting receipt_offline since it is empty anyway,but the code is messy and it is rare so i don't bother.
                                }else{
                                    alert_service(reason);
                                }
                            }
                        )
                    }
                    ,function(reason){
                        if(reason.status === 0){
                            handle_internet_offline();
                        }else{
                            alert_service(reason);
                        }
                    }
                )
            }
            ModalCtrl.$inject = ['$scope','$modalInstance','GLOBAL_SETTING'];    
            return $modal.open({
                 template:template
                ,controller:ModalCtrl
                ,size:'lg'
                ,resolve : {
                    GLOBAL_SETTING : function(){ return GLOBAL_SETTING}
                }
            }).result;
        }
    }])
})