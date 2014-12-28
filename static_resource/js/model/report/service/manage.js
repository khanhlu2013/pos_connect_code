define(
[
    'angular'
    //-----
    ,'service/ui'    
    ,'model/report/service/edit'
    ,'model/report/service/create'
    ,'model/report/api'
]
,function
(
    angular
)
{
    var mod = angular.module('report/service/manage',
    [
         'service/ui'
        ,'report/service/edit'
        ,'report/service/create'
        ,'report/api'
    ]);

    mod.factory('report/service/manage',
    [
         '$modal'
        ,'report/service/edit'
        ,'service/ui/alert'
        ,'service/ui/confirm'
        ,'report/service/create'
        ,'report/api'
    ,function
    (
         $modal
        ,edit_report_service
        ,alert_service
        ,confirm_service
        ,create_report
        ,api
    ){
        return function(){
            var template = 
                '<div class="modal-header"><div class="modal-title"><h3>manage report</h3></div></div>' +
                
                '<div class="modal-body">' +
                    '<button id="report_app/service/manage/add_btn" ng-click="add_report()" class="btn btn-primary"><span class="glyphicon glyphicon-plus"></span></button>' +
                    '<input type="text" ng-model="local_filter.name" placeHolder="local filter">' +
                    '<table ng-hide="report_lst.length === 0" class="table table-hover table-bordered table-condensed table-striped">' +
                        '<tr>' + 
                            '<th>report</th>' +                          
                            '<th>delete</th>' +                            
                            '<th>edit</th>' +
                        '</tr>' +

                        '<tr ng-repeat="report in report_lst | filter:local_filter">' +
                            '<td>{{report.name}}</td>' +                           
                            '<td class="alncenter"><button ng-click="delete_report(report)" class="btn btn-danger"><span class="glyphicon glyphicon-trash"></span></button></td>' +
                            '<td class="alncenter"><button ng-click="edit_report(report)"class="btn btn-primary"><span class="glyphicon glyphicon-pencil"></span></button></td>' +
                        '</tr>' +
                    '</table>' +
                    '<pre ng-show="report_lst.length === 0">there is no report</pre>' +
                '</div>' +
                
                '<div class="modal-footer">' +
                    '<button id="report/service/manage/exit_btn" ng-click="exit()" class="btn btn-warning"><span class="glyphicon glyphicon-remove"></span></button>' +
                '</div>'                
            ;
            var ModalCtrl = function($scope,$modalInstance,report_lst){
                $scope.report_lst = report_lst;

                $scope.delete_report = function(report){
                    var confirm_promise = confirm_service('delete ' + report.name + ' report?');
                    confirm_promise.then(
                        function(data){
                            if(data === false){
                                return;
                            }

                            api.delete_item(report.id)
                            .then(
                                function(){
                                    var index = null;
                                    for(var i = 0;i<$scope.report_lst.length;i++){
                                        if($scope.report_lst[i].id === report.id){
                                            index = i;
                                            break;
                                        }
                                    }

                                    if(index === null){
                                        alert_service('Bug: should be unreachable. can not find deleted index after success response');
                                    }else{
                                        $scope.report_lst.splice(i,1);
                                    }
                                },
                                function(reason){
                                    alert_service(reason);
                                }
                            )                            
                        }
                    )
                }
                $scope.add_report = function(){
                    var promise = create_report();
                    promise.then(
                        function(data){
                            $scope.report_lst.push(data);
                        },
                        function(reason){
                            alert_service(reason);
                        }
                    )
                }
                $scope.edit_report = function(report){
                    var promise = edit_report_service(report);
                    promise.then(
                        function(data){
                            angular.copy(data,report);
                        },
                        function(reason){
                            alert_service(reason);
                        }
                    )
                }
                $scope.exit = function(){
                    $modalInstance.close($scope.report_lst);
                }
            }
            ModalCtrl.$inject = ['$scope','$modalInstance','report_lst'];
            
            var dlg = $modal.open({
                template:template,
                controller:ModalCtrl,
                size:'lg',
                resolve:{
                    report_lst: function(){return api.get_lst();}
                }
            });
            return dlg.result;
        }
    }]);
})