define(
[
    'angular'
    //----
    ,'model/sp/service/search/name_sku_online_dlg'
    ,'service/ui'
    ,'service/misc'
    ,'directive/share_directive'
]
,function
(
    angular
)
{
    var mod = angular.module('report/service/prompt',
    [
         'sp/service/search/name_sku_online_dlg'
        ,'service/ui'
        ,'service/misc'
        ,'directive/share_directive'
    ]);
    mod.factory('report/service/prompt',
    [
         '$modal'
        ,'sp/service/search/name_sku_online_dlg/multiple'
        ,'service/ui/alert'
        ,'service/misc'
    ,function(
         $modal
        ,sp_search_multiple_dlg
        ,alert_service
        ,misc_service
    ){
        return function(original_report){
            var template = 
                '<div class="modal-header"><h3>{{original_report.name==undefined?\'Create new report\' : \'Edit report \'+ original_report.name}}</h3></div>' +
                '<div class="modal-body">' +
                    '<div name="form" class="form-report">' + 
                        '<label>report name:</label>' +
                        '<input id="report_app/service/prompt/name_txt" name="name" ng-model="$parent.report.name" type="text" focus-me={{true}} required>' +
                        '<label class="error" ng-show="form.name.$error.required">required</label>' +
                    '</div>' +

                    '<button id="report_app/service/prompt/add_btn" ng-click="add_sp()" class="btn btn-primary"><span class="glyphicon glyphicon-plus"></span></button>' +
                    '<table ng-hide="report.sp_lst.length == 0" class="table table-hover table-bordered table-condensed table-striped">' +
                        '<tr>' +
                            '<th>product</th>' +
                            '<th>remove</th>' +
                        '</tr>' +

                        '<tr ng-repeat="sp in report.sp_lst">' +
                            '<td>{{sp.name}}</td>' +
                            '<td class="alncenter"><button ng-click="remove_sp(sp)"class="btn btn-danger"><span class="glyphicon glyphicon-trash"></span></button></td>' +
                        '</tr>' +
                    '</table>' +
                    '<pre ng-show="report.sp_lst.length == 0">there is no product in this report</pre>' +
                '</div>' + 
                '<div class="modal-footer">' +
                    '<button id="report_app/service/prompt/cancel_btn" ng-click="cancel()" class="btn btn-warning">cancel</button>' + 
                    '<button ng-disabled="is_unchange()" ng-click="reset()" class="btn btn-primary">reset</button>' + 
                    '<button id="report_app/service/prompt/ok_btn" ng-disabled="form.$invalid || is_unchange()" ng-click="ok()" class="btn btn-success">ok</button>' + 
                '</div>'
            ;
            var ModalCtrl = function($scope,$modalInstance,original_report){
                if(original_report == null){
                    original_report = {sp_lst:[]};
                }
                $scope.original_report = original_report;
                $scope.report = angular.copy($scope.original_report);

                $scope.remove_sp = function(sp){
                    for(var i = 0;i<$scope.report.sp_lst.length;i++){
                        if(sp.id == $scope.report.sp_lst[i].id){
                            $scope.report.sp_lst.splice(i,1);
                            break;
                        }
                    }
                }

                $scope.add_sp = function(){
                    var promise = sp_search_multiple_dlg();
                    promise.then(
                        function(sp_lst){
                            for(var i = 0;i<sp_lst.length;i++){
                                if(misc_service.get_item_from_lst_base_on_id(sp_lst[i].id,$scope.report.sp_lst) == null){
                                    $scope.report.sp_lst.push(sp_lst[i]);
                                }
                            }
                        },
                        function(reason){
                            alert_service(reason);
                        }
                    )
                }
                $scope.is_unchange = function(){
                    return angular.equals($scope.report,$scope.original_report);
                }
                $scope.reset = function(){
                    $scope.report = angular.copy($scope.original_report);
                }
                $scope.ok = function(){
                    $modalInstance.close($scope.report);
                }
                $scope.cancel = function(){
                    $modalInstance.dismiss('_cancel_');
                }
            }
            ModalCtrl.$inject = ['$scope','$modalInstance','original_report'];
            var dlg = $modal.open({
                template:template,
                controller:ModalCtrl,
                size:'md',
                backdrop:'static',
                resolve:{
                    original_report:function(){return original_report}
                }
            })

            return dlg.result;
        }
    }]);
})
