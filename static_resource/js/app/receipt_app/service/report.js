define(
[
     'angular'
    //--------
    ,'app/receipt_app/service/api_offline'
    ,'service/db'
    ,'service/ui'
    ,'app/sale_app/service/sale_able_info_dlg'
    ,'app/receipt_app/service/push'
    ,'app/receipt_app/service/api'
]
,function
(
    angular
)
{
    var mod = angular.module('receipt_app/service/report',
    [
         'receipt_app/service/api_offline'
        ,'service/db'
        ,'service/ui'
        ,'sale_app/service/sale_able_info_dlg'
        ,'receipt_app/service/push'
        ,'receipt_app/service/api'
    ]);
    mod.factory('receipt_app/service/report',
    [
         '$modal'
        ,'$q'
        ,'receipt_app/service/api_offline'
        ,'service/db/is_pouch_exist'
        ,'service/ui/alert'
        ,'sale_app/service/sale_able_info_dlg'
        ,'receipt_app/service/push'
        ,'receipt_app/service/api'
    ,function(
         $modal
        ,$q
        ,api_offline
        ,is_pouch_exist
        ,alert_service
        ,sale_able_info_dlg
        ,push_receipt
        ,online_api
    ){

        function get_offline_receipt_lst(){
            var defer = $q.defer();
            is_pouch_exist().then(
                function(db_existance){
                    if(db_existance){
                        api_offline.get_receipt_lst().then(
                             function(receipt_lst)  { defer.resolve(receipt_lst); }
                            ,function(reason)       { alert_service('alert',reason,'red'); defer.resolve([]); }
                        )
                    }else{ defer.resolve([]); }
                }
                ,function(reason){ alert_service('alert',reason,'red'); defer.resolve([]); }
            )
            return defer.promise;
        }

        return function(){
            var receipt_summary_offline_template = 
                '<div class="form-horizontal" >' +
                    '<div id="receipt_app/service/report/offline/receipt_summary/subtotal_derivation" ng-hide="cur_offline_receipt.get_saving()===0.0 && cur_offline_receipt.get_crv()===0.0">' +
                        '<div class="form-group">' +
                            '<label class="col-sm-4 control-label">original price:</label>' +
                            '<p id="receipt_app/service/report/offline/receipt_summary/genesis_price" class="col-sm-8 form-control-static">{{cur_offline_receipt.get_genesis_price()}}</p>' +
                        '</div>' +
                        '<div ng-hide="cur_offline_receipt.get_saving()===0.0" class="form-group">' +
                            '<label class="col-sm-4 control-label">saving:</label>' +
                            '<p id="receipt_app/service/report/offline/receipt_summary/saving" class="col-sm-8 form-control-static">{{(cur_offline_receipt.get_saving() * -1) | currency}}</p>' +
                        '</div>' +
                        '<div ng-hide="cur_offline_receipt.get_crv()===0.0" class="form-group">' +
                            '<label class="col-sm-4 control-label">crv:</label>' +
                            '<p id="receipt_app/service/report/offline/receipt_summary/crv" class="col-sm-8 form-control-static">{{cur_offline_receipt.get_crv()|currency}}</p>' +
                        '</div>' +
                        '<hr>' +
                    '</div>' +

                    '<div class="form-group">' +
                        '<label class="col-sm-4 control-label">subtotal:</label>' +
                        '<p id="receipt_app/service/report/online/receipt_summary/subtotal" class="col-sm-8 form-control-static">{{cur_offline_receipt._get_b4_tax_price()|currency}}</p>' +
                    '</div>' +
                    
                    '<div ng-hide="cur_offline_receipt.get_buydown_tax()===0.0" class="form-group">' +
                        '<label class="col-sm-4 control-label">buydown tax:</label>' +
                        '<p id="receipt_app/service/report/offline/receipt_summary/buydown_tax" class="col-sm-8 form-control-static">{{cur_offline_receipt.get_buydown_tax()|currency}}</p>' +
                    '</div>' +

                    '<div class="form-group">' +
                        '<label class="col-sm-4 control-label">tax ({{cur_offline_receipt.tax_rate}}%):</label>' +
                        '<p id="receipt_app/service/report/offline/receipt_summary/tax" class="col-sm-8 form-control-static">{{cur_offline_receipt.get_product_tax()|currency}}</p>' +
                    '</div>' +

                    '<hr>' +

                    '<div class="form-group">' +
                        '<label class="col-sm-4 control-label">total:</label>' +
                        '<p id="receipt_app/service/report/receipt_summary/total" class="col-sm-8 form-control-static">{{cur_offline_receipt.get_otd_price()|currency}}</p>' +
                    '</div>' +

                    '<div ng-repeat="tender_ln in cur_offline_receipt.tender_ln_lst" class="form-group">' +
                        '<label' +
                            ' ng-attr-id="receipt_app/service/report/offline/receipt_summary/tender_lbl/{{tender_ln.pt === null ? \'null\' : tender_ln.pt.id}}"' +
                            ' class="col-sm-4 control-label">' +
                                '{{tender_ln.name === null ? \'cash\' : tender_ln.pt.name}}:' + 
                        '</label>' +
                        '<p' +
                            ' ng-attr-id="receipt_app/service/report/offline/receipt_summary/tender_txt/{{tender_ln.pt === null ? \'null\' : tender_ln.pt.id}}"' +
                            ' class="col-sm-8 form-control-static">' +
                                '{{(tender_ln.amount)|currency}}' +
                        '</p>' +
                    '</div>' +

                    '<hr>' +

                    '<div class="form-group">' +
                        '<label class="col-sm-4 control-label">change:</label>' +
                        '<p id="receipt_app/service/report/offline/receipt_summary/change" class="col-sm-8 form-control-static">{{cur_offline_receipt.get_change()|currency}}</p>' +
                    '</div>' +       
                    'xx{{cur_offline_receipt.get_saving()}}'+
                '</div>'  /* end form horizontal*/
            ;

            var offline_tab = 
                '<tab ' +
                ' id="receipt_app/service/report/tab/offline"' +
                ' heading="offline receipts">' +
                    '<pre ng-show="offline_receipt_lst.length === 0">there is no offline receipt</pre>' +
                    '<div ng-hide="offline_receipt_lst.length === 0">' +
                        '<div class="col-sm-6">' + 
                            '<table class="table table-hover table-bordered table-condensed table-striped">' +
                                '<tr>' +
                                    '<th>time</th>' +
                                    '<th>total</th>' +
                                    '<th>info</th>' +
                                '</tr>' +
                                '<tr ng-repeat="receipt in offline_receipt_lst | orderBy:\'-date\'">' +
                                    '<td>{{receipt.date | date : \'M/d h:mm a\'}}</td>' +
                                    '<td>{{receipt.get_otd_price() | currency}}</td>' +
                                    '<td class="alncenter"><button class="btn glyphicon glyphicon-info-sign" ng-class="is_cur_offline_receipt(receipt) ? \'btn-warning\' : \'btn-primary\'" ng-click="toogle_cur_offline_receipt(receipt)"></button></td>' +
                                '</tr>' +                                
                            '</table>' +                        
                        '</div>' +

                        '<div ng-hide="cur_offline_receipt===null" class="col-sm-6">' +
                            '<table class="table table-hover table-bordered table-condensed table-striped">' +
                                '<tr>' +
                                    '<th>qty</th>' +
                                    '<th>product</th>' +
                                    '<th>price</th>' +
                                '</tr>' +
                                '<tr ng-repeat="receipt_ln in cur_offline_receipt.receipt_ln_lst | orderBy:\'date\'">' +
                                    '<td>{{receipt_ln.qty}}</td>' +
                                    '<td>{{receipt_ln.get_name()}}</td>' +   
                                    '<td class="alncenter"><button ng-click="display_sale_able_info_dlg(receipt_ln)" class="btn btn-primary">{{receipt_ln.get_advertise_price() | currency}}</button></td>' +                                  
                                '</tr>' +
                            '</table>' +  
                            receipt_summary_offline_template +
                        '</div>' +

                        '<div class="clear"></div>' +                
                    '</div>' +
                '</tab>'
            ;
            var template_left_online_table = 
                '<table ng-hide="online_receipt_lst.length==0" class="table table-hover table-bordered table-condensed table-striped">' +
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
                '</table>'
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
            var online_tab = 
                '<tab' +
                ' id="receipt_app/service/report/tab/online"' +
                ' heading="online receipts">' +                    
                    '<p class="input-group">' +
                        //from date
                        '<input type="text" class="form-control" datepicker-popup="MM-dd-yyyy" ng-model="from_date" is-open="$parent.opened_from" close-text="close" datepicker-options="dateOptions"></input>' +
                        '<span class="input-group-btn">' +
                            '<button type="button" class="btn btn-default" ng-click="open($event,\'opened_from\')"><i class="glyphicon glyphicon-calendar"></i></button>' +
                        '</span>' +
                        //to date
                        '<input type="text" class="form-control" datepicker-popup="MM-dd-yyyy" ng-model="to_date" is-open="$parent.opened_to" close-text="close" datepicker-options="dateOptions"></input>' +
                        '<span class="input-group-btn">' +
                            '<button type="button" class="btn btn-default" ng-click="open($event,\'opened_to\')"><i class="glyphicon glyphicon-calendar"></i></button>' +
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
                '</tab>'
            ;
            var template = 
                '<div class="modal-header"><h3>Receipts</h3></div>' +
                '<div class="modal-body">' +
                    '<tabset justified="true">' +
                        offline_tab +
                        online_tab +
                    '</tabset>' +
                '</div>' +
                '<div class="modal-footer">' +
                    '<button ng-hide="offline_receipt_lst.length === 0" id="receipt_app/service/report/push_btn" class="btn btn-primary btn-float-left" ng-click="push()">push</button>' +
                    '<button id="receipt_app/service/report/exit_btn" class="btn btn-warning" ng-click="exit()">exit</button>' +
                '</div>' 
            ;

            var controller = function($scope,$modalInstance,offline_receipt_lst){
                $scope.offline_receipt_lst = offline_receipt_lst;
                $scope.cur_offline_receipt = null;
                $scope.display_sale_able_info_dlg = function(receipt_ln){
                    sale_able_info_dlg(receipt_ln,false/*is_enable_override_price*/);
                }
                $scope.toogle_cur_offline_receipt = function(receipt){
                    if($scope.is_cur_offline_receipt(receipt)){ $scope.cur_offline_receipt = null;}
                    else{ $scope.cur_offline_receipt = receipt; }
                }
                $scope.is_cur_offline_receipt = function(receipt){
                    if($scope.cur_offline_receipt === null){ return false; }
                    else{ return $scope.cur_offline_receipt === receipt }
                }
                $scope.push = function(){
                    push_receipt().then(
                         function(response){ 
                            get_offline_receipt_lst().then(
                                 function(offline_receipt_lst){ $scope.offline_receipt_lst = offline_receipt_lst; }
                                ,function(reason){ alert_service('alert',reason,'red'); }
                            )
                        }
                        ,function(reason){alert_service('alert',reason,'red');}
                    )
                }

                //-------------

                $scope.online_receipt_lst = [];
                $scope.cur_online_receipt = null;
                $scope.toogle_cur_online_receipt = function(receipt){
                    if($scope.is_cur_online_receipt(receipt)){ $scope.cur_online_receipt = null;}
                    else{ $scope.cur_online_receipt = receipt; }
                }
                $scope.is_cur_online_receipt = function(receipt){
                    if($scope.cur_online_receipt === null){ return false; }
                    else{ return $scope.cur_online_receipt === receipt }
                }    

                $scope.from_date = null;
                $scope.to_date = null;
                $scope.open = function($event,from_or_to) {
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
                    online_api.get_receipt($scope.from_date,$scope.to_date).then(
                         function(data){ $scope.online_receipt_lst = data; }
                        ,function(reason){ alert_service('alert',reason,'red');}
                    )
                }

                //---------------

                $scope.exit = function(){$modalInstance.dismiss('_cancel_');}
            }

            $modal.open({
                 template:template
                ,controller:controller
                ,size:'lg'
                ,resolve:{ offline_receipt_lst : get_offline_receipt_lst }
            });
        }
    }])
})