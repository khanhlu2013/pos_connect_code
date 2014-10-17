define(
[
    'angular'
    //---
    ,'app/receipt_app/service/api'
    ,'ngTable'
    ,'service/ui'

]
,function
(
    angular
)
{
    var mod = angular.module('receipt_app/service/report_old',
    [
         'receipt_app/service/api'
        ,'ngTable'
        ,'service/ui'
    ]);
    mod.factory('receipt_app/service/report_old',
    [
         '$modal'
        ,'receipt_app/service/api'
        ,'ngTableParams'
        ,'service/ui/alert'
    ,function(
         $modal
        ,api
        ,ngTableParams
        ,alert_service
    ){
        return function(){

            var template_date_panel = 
                '<input type="text" datepicker-popup="MM-dd-yyyy" ng-model="$parent.date_from" is-open="$parent.is_from_date_open" ng-click="open_from_date($event)" placeholder="from date">' +
                '<input type="text" datepicker-popup="MM-dd-yyyy" ng-model="$parent.date_to"   is-open="$parent.is_to_date_open"   ng-click="open_to_date($event)"   placeholder="to date">' +                    
                '<button ng-click="refresh_report()" ng-disabled="date_from==null||date_to==null" class="btn btn-primary glyphicon glyphicon-refresh"></button>'
            ;             

            var template_left_table = 
                '<table ng-hide="$data.length==0" ng-table="tableParams" class="table table-hover table-bordered table-condensed table-striped">' +
                    '<tr>' +
                        '<th>date</th>' +
                        '<th>total</th>' +
                        '<th>info</th>' +
                    '</tr>' +

                    '<tr ng-repeat="receipt in $data">' +
                        '<td sortable="\'date\'">{{receipt.date|date:\'MMM-d-yyyy\'}}</td>' +
                        '<td class="alnright">{{receipt.get_otd_price()|currency}}</td>' +
                        '<td><button ng-click="show_info(receipt)" class="btn btn-primary glyphicon glyphicon-zoom-in"></button></td>' +
                    '</tr>' +                        
                '</table>'
            ;

            var template_right_table = 
                '<table ng-hide="$parent.cur_receipt==null" class="table table-hover table-bordered table-condensed table-striped">' +
                    '<tr>' +
                        '<th>qty</th>' +
                        '<th>product</th>' +
                        '<th>price</th>' +
                    '</tr>' +

                    '<tr ng-repeat="receipt_ln in $parent.cur_receipt.receipt_ln_lst">' +
                        '<td>{{receipt_ln.qty}}</td>' +
                        '<td>{{receipt_ln.get_name()}}</td>' +
                        '<td>{{receipt_ln.get_advertise_price() | currency}}</td>' +
                    '</tr>' +
                '</table>'
            ;

            var template = 
                '<div class="modal-header">' +
                    '<h4 class="modal-title">receipts: <span>' + template_date_panel + '</span></h4>' +
                '</div>' +
                
                '<div class="modal-body">' +
                   
                    '<div>' +
                        '<div class="col-sm-4">' + template_left_table + '</div>' +
                        '<div class="col-sm-8">' + template_right_table + '</div>' +
                        '<div class="clear"></div>' +                    
                    '</div>' +
                '</div>' +
                '<div class="modal-footer">' +
                    '<button ng-click="get_today_report()" class="btn btn-primary btn-float-left">today report</button>' +                
                    '<button ng-click="exit()" class="btn btn-warning">exit</button>' +
                '</div>'                            
            ;

            var ModalCtrl = function($scope,$modalInstance,$http,$filter){
                $scope.date_from = null;
                $scope.date_to = null;
                $scope.cur_receipt = null;

                $scope.tableParams = new ngTableParams({
                    page:1,
                    count:2,
                },{
                    total:0,
                    counts:[2,4],
                    getData:function($defer,params){
                        if($scope.date_from == null || $scope.date_to == null){
                            return;
                        }
                        var promise = api.get_receipt_pagination($scope.date_from,$scope.date_to,params.page()/*page_no*/,params.count()/*receipt_per_page*/);
                        promise.then(
                            function(data){
                                params.total(data.total);
                                $defer.resolve(data.receipt_lst);
                                if(data.receipt_lst.length==0){ alert_service('info','there is no data','blue');}
                            },function(reason){ alert_service('alert',reason,'red'); }
                        )                        
                    }
                })
                $scope.show_info = function(receipt){
                    $scope.cur_receipt = receipt;
                }
                $scope.get_today_report = function(){
                    $scope.date_from = new Date();
                    $scope.date_to = new Date();
                    $scope.tableParams.page(1);//go back to page 1
                    $scope.refresh_report();
                }
                $scope.refresh_report = function(){
                    $scope.cur_receipt = null;
                    $scope.tableParams.reload();
                }
                $scope.open_to_date = function($event) {
                    if($scope.date_to == null){
                        $scope.date_to = new Date();
                    }
                    $event.preventDefault();
                    $event.stopPropagation();
                    $scope.is_to_date_open = true;
                };      
                $scope.open_from_date = function($event) {
                    if($scope.date_from == null){
                        $scope.date_from = new Date();
                    }                    
                    $event.preventDefault();
                    $event.stopPropagation();
                    $scope.is_from_date_open = true;
                };   

                $scope.exit = function(){
                    $modalInstance.dismiss('_cancel_');
                }
            }
            ModalCtrl.$inject = ['$scope','$modalInstance','$http','$filter'];              
            var dlg = $modal.open({
                // templateUrl: 'template/mixed-ng-snipped.html',
                template:template,
                controller:ModalCtrl,
                size:'lg',
            })
            return dlg.result;
        }
    }])
})