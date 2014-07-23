define(
[
    'angular'
    //---
    ,'service/date'
    ,'app/receipt_app/service/convert'
]
,function
(
    angular
)
{
    var mod = angular.module('receipt_app/service/report',['service/date','receipt_app/service/convert']);
    mod.factory('receipt_app/service/report',['$modal','service/date/get_timezone_offset','receipt_app/service/convert/lst',function($modal,get_timezone_offset,convert_receipt_lst){
        return function(){
            var template = 
                '<div class="modal-header">' +
                    '<h3 class="modal-title">receipts</h3>' +
                '</div>' +
                '<div class="modal-body">' +
                    '<input type="text" datepicker-popup="MMMM-dd-yyyy" ng-model="$parent.date_from" type="text" placeholder="from">' +
                    '<input type="text" datepicker-popup="MMMM-dd-yyyy" ng-model="$parent.date_to"  placeholder="to">' +
                    '<button ng-click="get_report()" ng-disabled="date_from==null||date_to==null" class="btn btn-primary glyphicon glyphicon-refresh"></button>' +
                    '<button ng-click="get_today_report()" class="btn btn-primary">today report</button>' +
                    '<table ng-hide="receipt_lst.length==0">' +
                        '<tr>' +
                            '<th>date</th>' +
                            '<th>total</th>' +
                        '</tr>' +
                        '<tr ng-repeat="receipt in receipt_lst">' +
                            '<th>{{receipt.time_stamp}}</th>' +
                            '<th>xxx</th>' +
                        '</tr>' +                        
                    '</table>' +
                    '{{receipt_lst}}' +
                '</div>' +
                '<div class="modal-footer">' +
                    '<button ng-click="exit()" class="btn btn-warning">exit</button>' +
                '</div>'                            
            ;
            var ModalCtrl = function($scope,$modalInstance,$http,$filter){
                $scope.receipt_lst = [];
                $scope.date_from = new Date();
                $scope.date_to = new Date();
                var server_accepted_format = "M/d/yyyy";
                $scope.get_today_report = function(){
                    $scope.date_from = new Date();
                    $scope.date_to = new Date();
                    $scope.get_report();
                }
                $scope.get_report = function(){
                    var promise_ing = $http({
                        url:'/receipt/get_receipt',
                        method:'GET',
                        params:{
                            from_date:$filter('date')($scope.date_from,server_accepted_format),
                            to_date:$filter('date')($scope.date_to,server_accepted_format),
                            time_zone_offset: get_timezone_offset()
                        }
                    })
                    var promise_ed = promise_ing.then(
                        function(data){
                            $scope.receipt_lst = convert_receipt_lst(data.data);
                        },
                        function(reason){
                            alert_service.alert('alert','get receipt ajax error','red');
                        }
                    )
                }
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