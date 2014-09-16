define(
[
     'angular'
    //--------
    ,'app/receipt_app/service/get_offline_receipt'
    ,'service/db'
    ,'service/ui'
    ,'app/sale_app/service/sale_able_info_dlg'

]
,function
(
    angular
)
{
    var mod = angular.module('receipt_app/service/report',
    [
         'receipt_app/service/get_offline_receipt'
        ,'service/db'
        ,'service/ui'
        ,'sale_app/service/sale_able_info_dlg'
    ]);
    mod.factory('receipt_app/service/report',
    [
         '$modal'
        ,'$q'
        ,'receipt_app/service/get_offline_receipt'
        ,'service/db/is_pouch_exist'
        ,'service/ui/alert'
        ,'sale_app/service/sale_able_info_dlg'
    ,function(
         $modal
        ,$q
        ,get_offline_receipt
        ,is_pouch_exist
        ,alert_service
        ,sale_able_info_dlg
    ){
        return function(){

            var online_tab = 
                '<tab' +
                ' id="receipt_app/service/report/tab/online"' +
                ' heading="online receipts">' +                    
                    '<div>online tab</div>' +
                '</tab>'
            ;
            var receipt_summary_template = 
                '<div class="form-horizontal" >' +
                    '<div id="receipt_app/service/report/receipt_summary/subtotal_derivation" ng-hide="cur_receipt.get_total_discount()===0.0 && cur_receipt.get_crv()===0.0">' +
                        '<div class="form-group">' +
                            '<label class="col-sm-4 control-label">original price:</label>' +
                            '<p id="receipt_app/service/report/receipt_summary/genesis_price" class="col-sm-8 form-control-static">{{cur_receipt.get_genesis_price()}}</p>' +
                        '</div>' +
                        '<div ng-hide="cur_receipt.get_total_discount()===0.0" class="form-group">' +
                            '<label class="col-sm-4 control-label">saving:</label>' +
                            '<p id="receipt_app/service/report/receipt_summary/saving" class="col-sm-8 form-control-static">{{(cur_receipt.get_total_discount() * -1) | currency}}</p>' +
                        '</div>' +
                        '<div ng-hide="cur_receipt.get_crv()===0.0" class="form-group">' +
                            '<label class="col-sm-4 control-label">crv:</label>' +
                            '<p id="receipt_app/service/report/receipt_summary/crv" class="col-sm-8 form-control-static">{{cur_receipt.get_crv()|currency}}</p>' +
                        '</div>' +
                        '<hr>' +
                    '</div>' +

                    '<div class="form-group">' +
                        '<label class="col-sm-4 control-label">subtotal:</label>' +
                        '<p id="receipt_app/service/report/receipt_summary/subtotal" class="col-sm-8 form-control-static">{{cur_receipt._get_b4_tax_price()|currency}}</p>' +
                    '</div>' +
                    
                    '<div ng-hide="cur_receipt.get_buydown_tax()===0.0" class="form-group">' +
                        '<label class="col-sm-4 control-label">buydown tax:</label>' +
                        '<p id="receipt_app/service/report/receipt_summary/buydown_tax" class="col-sm-8 form-control-static">{{cur_receipt.get_buydown_tax()|currency}}</p>' +
                    '</div>' +

                    '<div class="form-group">' +
                        '<label class="col-sm-4 control-label">tax ({{cur_receipt.tax_rate}}%):</label>' +
                        '<p id="receipt_app/service/report/receipt_summary/tax" class="col-sm-8 form-control-static">{{cur_receipt.get_product_tax()|currency}}</p>' +
                    '</div>' +

                    '<hr>' +

                    '<div class="form-group">' +
                        '<label class="col-sm-4 control-label">total:</label>' +
                        '<p id="receipt_app/service/report/receipt_summary/total" class="col-sm-8 form-control-static">{{cur_receipt.get_otd_price()|currency}}</p>' +
                    '</div>' +

                    '<div ng-repeat="tender_ln in cur_receipt.tender_ln_lst" class="form-group">' +
                        '<label class="col-sm-4 control-label">{{tender_ln.name === null ? \'cash\' : tender_ln.name}}:</label>' +
                        '<p ng-attr-id="receipt_app/service/report/receipt_summary/tender/{{tender_ln.id === null ? \'null\' : tender_ln.id}}" class="col-sm-8 form-control-static">{{(tender_ln.amount * -1)|currency}}</p>' +
                    '</div>' +

                    '<hr>' +

                    '<div class="form-group">' +
                        '<label class="col-sm-4 control-label">change:</label>' +
                        '<p id="receipt_app/service/report/receipt_summary/change" class="col-sm-8 form-control-static">{{cur_receipt.get_change()|currency}}</p>' +
                    '</div>' +                    
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
                                '<tr ng-repeat="receipt in offline_receipt_lst | orderBy : \'-date\'">' +
                                    '<td>{{receipt.date | date : \'M/d h:mm a\'}}</td>' +
                                    '<td>{{receipt.get_otd_price() | currency}}</td>' +
                                    '<td><button class="btn glyphicon glyphicon-info-sign" ng-class="is_cur_receipt(receipt) ? \'btn-warning\' : \'btn-primary\'" ng-click="toogle_cur_receipt(receipt)"></button></td>' +
                                '</tr>' +                                
                            '</table>' +                        
                        '</div>' +

                        '<div ng-hide="cur_receipt===null" class="col-sm-6">' +
                            '<table class="table table-hover table-bordered table-condensed table-striped">' +
                                '<tr>' +
                                    '<th>qty</th>' +
                                    '<th>product</th>' +
                                    '<th>price</th>' +
                                '</tr>' +
                                '<tr ng-repeat="receipt_ln in cur_receipt.receipt_ln_lst | orderBy : \'date\'">' +
                                    '<td>{{receipt_ln.qty}}</td>' +
                                    '<td>{{receipt_ln.get_name()}}</td>' +   
                                    '<td ng-click="display_sale_able_info_dlg(receipt_ln)">{{receipt_ln.get_advertise_price() | currency}}</td>' +                                  
                                '</tr>' +
                            '</table>' +  
                            receipt_summary_template +
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
                    '<button id="receipt_app/service/report/exit_btn" class="btn btn-warning" ng-click="exit()">exit</button>' +
                '</div>' 
            ;

            var controller = function($scope,$modalInstance,offline_receipt_lst){
                $scope.offline_receipt_lst = offline_receipt_lst;
                $scope.cur_receipt = null;

                $scope.display_sale_able_info_dlg = function(receipt_ln){
                    sale_able_info_dlg(receipt_ln,false/*is_enable_override_price*/);
                }
                $scope.toogle_cur_receipt = function(receipt){
                    if($scope.is_cur_receipt(receipt)){ $scope.cur_receipt = null;}
                    else{ $scope.cur_receipt = receipt; }
                }
                $scope.is_cur_receipt = function(receipt){
                    if($scope.cur_receipt === null){ return false; }
                    else{ return $scope.cur_receipt === receipt }
                }
                $scope.exit = function(){$modalInstance.dismiss('_cancel_');}
            }
            $modal.open({
                 template:template
                ,controller:controller
                ,size:'lg'
                ,resolve:{
                     offline_receipt_lst : function(){
                        var defer = $q.defer();
                        is_pouch_exist().then(
                            function(db_existance){
                                if(db_existance){
                                    get_offline_receipt().then(
                                         function(receipt_lst)  { defer.resolve(receipt_lst); }
                                        ,function(reason)       { alert_service('alert',reason,'red'); defer.resolve([]); }
                                    )
                                }else{ defer.resolve([]); }
                            }
                            ,function(reason){ alert_service('alert',reason,'red'); defer.resolve([]); }
                        )
                        return defer.promise;
                    }
                }
            });
        }
    }])
})