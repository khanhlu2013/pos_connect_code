define(
[
    'angular'
    //---
    ,'app/receipt_app/service/api'
    ,'ngTable'

]
,function
(
    angular
)
{
    var mod = angular.module('receipt_app/service/report',['receipt_app/service/api','ngTable']);
    mod.factory('receipt_app/service/report',['$modal','receipt_app/service/api','ngTableParams',function($modal,api,ngTableParams){
        return function(){
            var template = 
                '<div class="modal-header">' +
                    '<h3 class="modal-title">receipts</h3>' +
                '</div>' +
                '<div class="modal-body">' +
                    '<input type="text" datepicker-popup="MMMM-dd-yyyy" ng-model="$parent.date_from" type="text" placeholder="from">' +
                    
                    '<p class="input-group">' +
                        '<input class="form-control" type="text" datepicker-popup="MMMM-dd-yyyy" ng-model="$parent.date_to" is-open="$parent.is_to_date_open"  placeholder="to">' +
                        '<span class="input-group-btn">' +
                            '<button type="button" class="btn btn-default" ng-click="open_to_date($event)"><i class="glyphicon glyphicon-calendar"></i></button>' +
                        '</span>' +
                    '</p>' +
                    '<button ng-click="get_report()" ng-disabled="date_from==null||date_to==null" class="btn btn-primary glyphicon glyphicon-refresh"></button>' +
                    '<button ng-click="get_today_report()" class="btn btn-primary">today report</button>' +
                    '<table ng-table="tableParams" class="table table-hover table-bordered table-condensed table-striped">' +
                        '<tr>' +
                            '<th>date</th>' +
                            '<th>total</th>' +
                            '<th>info</th>' +
                        '</tr>' +

                        '<tr ng-repeat="receipt in $data">' +
                            '<td sortable="\'date\'">{{receipt.date|date:\'MMM-d-yyyy\'}}</td>' +
                            '<td class="alnright">{{receipt.get_total()|currency}}</td>' +
                        '</tr>' +                        
                    '</table>' +
                '</div>' +
                '<div class="modal-footer">' +
                    '<button ng-click="exit()" class="btn btn-warning">exit</button>' +
                '</div>'                            
            ;
            var ModalCtrl = function($scope,$modalInstance,$http,$filter){
                $scope.date_from = new Date();
                $scope.date_to = new Date();

                $scope.tableParams = new ngTableParams({
                    page:1,
                    count:2,
                },{
                    total:0,
                    counts:[],
                    getData:function($defer,params){
                        var promise = api.get_receipt($scope.date_from,$scope.date_to,params.page());
                        promise.then(
                            function(data){
                                // params.total(data.length);
                                params.total(data.total);
                                $defer.resolve(data.receipt_lst);
                            },function(reason){
                                alert_service('alert',reason,'red');
                            }
                        )                        
                    }
                })

                $scope.show_info = function(receipt){
                    alert(receipt.id);
                }
                $scope.get_today_report = function(){
                    $scope.date_from = new Date();
                    $scope.date_to = new Date();
                    $scope.get_report();
                }
                $scope.get_report = function(){
                    $scope.tableParams.reload();
                }
                $scope.open_to_date = function($event) {
                    $event.preventDefault();
                    $event.stopPropagation();
                    $scope.is_to_date_open = true;
                };                
                $scope.exit = function(){
                    $modalInstance.dismiss('_cancel_');
                }
            }
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