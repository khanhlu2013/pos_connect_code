define(
[
    'angular'
    //--
    ,'service/ui'
    ,'model/report/api'
    ,'directive/share_directive'
]
,function
(
    angular
)
{
    var mod = angular.module('report/service/search_dlg',
    [
         'service/ui'
        ,'directive/share_directive'
    ]);
    mod.factory('report/service/search_dlg/multiple',
    [
         '$modal'
        ,'service/ui/alert'
        ,'report/api'
    ,function(
         $modal
        ,alert_service
        ,api
    ){
        return function(){
            var template = 
                '<div class="modal-header">' +
                    '<h3 class="modal-title">select reports</h3>' +
                '</div>' +
                '<div class="modal-body">' +
                    '<input ng-model="query" type="text" placeholder="offline filter" focus-me={{true}}>' +
                    '<div>' +
                        '<div class="col-sm-6">' +
                            '<table ng-hide="report_lst.length==0" class="table table-hover table-bordered table-condensed table-striped">' +
                                '<tr>' +
                                    '<th>report</th>' +
                                    '<th>select</th>' +
                                '</tr>' +
                                '<tr ng-repeat="report in report_lst | orderBy:\'name\' | filter:query">' +
                                    '<td>{{report.name}}</td>' +
                                    '<td class="alncenter"><button ng-click="toggle_select(report)" class="btn glyphicon" ng-class="is_report_selected(report) ? \'btn-warning glyphicon-check\' : \'btn-primary glyphicon-unchecked\'"></button></td>' +
                                '</tr>' +
                            '</table>' +   
                            '<pre ng-show="report_lst.length==0">there is no report to select</pre>' +                 
                        '</div>' +

                        '<div class="col-sm-6">' +
                            '<table class="table table-hover table-bordered table-condensed table-striped">' +
                                '<tr>' +
                                    '<th>report</th>' +
                                    '<th>remove</th>' +
                                '</tr>' +
                                '<tr ng-repeat="report in report_result_lst">' +
                                    '<td>{{report.name}}</td>' +
                                    '<td class="alnright"><button ng-click="toggle_select(report)" class="btn btn-warning glyphicon glyphicon-trash"></button></td>' +
                                '</tr>' +                            
                            '</table>' +
                        '</div>' + 
                        '<div class="clear"></div>' +    
                    '</div>' +
                '</div>' +
                '<div class="modal-footer">' +
                    '<button ng-click="cancel()" class="btn btn-warning">cancel</button>' +
                    '<button ng-disabled="report_result_lst.length==0" ng-click="reset()" class="btn btn-primary">reset</button>' +                    
                    '<button id="report_app/service/search_dlg/multiple/ok_btn" ng-disabled="report_result_lst.length==0" ng-click="ok()" class="btn btn-success">ok</button>' +
                '</div>'                        
            ;
            var ModalCtrl = function($scope,$modalInstance,report_lst){
                $scope.report_lst = report_lst;
                $scope.report_result_lst = [];
                $scope.toggle_select = function(report){
                    if($scope.is_report_selected(report)){
                        var index = null;
                        for(var i = 0;i<$scope.report_result_lst.length;i++){
                            if(report.id == $scope.report_result_lst[i].id){
                                index =i;
                                break;
                            }
                        }
                        $scope.report_result_lst.splice(index,1);
                    }else{
                        $scope.report_result_lst.push(report);
                    }
                }
                $scope.is_report_selected = function(report){
                    var is_select = false;
                    for(var i = 0;i<$scope.report_result_lst.length;i++){
                        if(report.id == $scope.report_result_lst[i].id){
                            is_select = true;
                            break;
                        }
                    }
                    return is_select;
                }
                $scope.reset = function(){
                    $scope.report_result_lst = [];
                }
                $scope.cancel = function(){
                    $modalInstance.dismiss('_cancel_');
                }
                $scope.ok = function(){
                    $modalInstance.close($scope.report_result_lst);
                }               
            }
            ModalCtrl.$inject = ['$scope','$modalInstance','report_lst'];            
            var dlg = $modal.open({
                template:template,
                controller:ModalCtrl,
                size:'lg',
                resolve:{
                    report_lst : function(){
                        var promise = api.get_lst();
                        promise.then(
                             function(){ /*do nothing*/ }
                            ,function(reason){ alert_service(reason); }
                        )
                        return promise;
                    }
                }
            })
            return dlg.result;
        }
    }])
})
