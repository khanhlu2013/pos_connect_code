define(
[
    'angular'
    //-----
    ,'model/payment_type/service/edit'
    ,'model/payment_type/service/create'
    ,'service/ui'
    ,'model/payment_type/api'

]
,function
(
    angular
)
{
    var mod = angular.module('payment_type/service/manage',
        [
            'payment_type/service/create',
            'payment_type/service/edit',
            'service/ui',
            'payment_type/api'
        ]
    );
    mod.service('payment_type/service/manage',
    [
        '$http',
        '$modal',
        '$rootScope',
        'payment_type/service/edit',
        'payment_type/service/create',
        'service/ui/alert',
        'service/ui/confirm',
        'payment_type/api',
    function
    (
        $http,
        $modal,
        $rootScope,
        edit_service,
        create_service,
        alert_service,
        confirm_service,
        api
    ){
        return function(){
            var template = 
                '<div class="modal-header">' +
                    '<h3 class="modal-title">manage payment type</h3>' +
                '</div>' +

                '<div class="modal-body">' +
                    '<button id="payment_type_app/service/manage/create_btn" ng-click="create()" class="btn btn-primary glyphicon glyphicon-plus"></button>' +
                    '<table ng-hide="pt_lst.length==0" class="table table-hover table-bordered table-condensed table-striped">' +
                        '<tr>' +
                            '<th>payment type</th>' +
                            '<th>sort</th>' +
                            '<th>active</th>' +
                            '<th>edit</th>' +
                        '</tr>' +
                        '<tr ng-repeat="pt_manage in pt_lst | orderBy:\'sort\'">' +
                            '<td>{{pt_manage.name}}</td>' +
                            '<td>{{pt_manage.sort}}</td>' +
                            '<td class="alncenter"><span class="glyphicon" ng-class="pt_manage.active? \'glyphicon-check\' : \'glyphicon-unchecked\'"></span></td>' +
                            '<td class="alncenter"><button ng-click="edit(pt_manage)" class="btn btn-primary glyphicon glyphicon-pencil"></button></td>' +
                        '</tr>' +
                    '</table>' +
                    '<pre ng-show="pt_lst.length==0">there is no payment type</pre>' +
                '</div>' +

                '<div class="modal-footer">' +
                    '<button id="payment_type_app/service/manage/exit_btn" class="btn btn-warning" type="button" ng-click="exit()">exit</button>'
                '</div>'                        
            ;
            var ModalCtrl = function($scope,$modalInstance,$q,pt_lst){
                $scope.pt_lst = pt_lst;

                $scope.exit = function(){
                    $rootScope.GLOBAL_SETTING.PAYMENT_TYPE_LST = $scope.pt_lst;
                    $modalInstance.dismiss('_cancel_');
                }
                $scope.create = function(){
                    create_service()
                    .then(
                        function(data){
                            $scope.pt_lst.push(data);
                        }
                        ,function(reason){
                            alert_service(reason);
                        }
                    )
                }
                $scope.edit = function(pt){
                    edit_service(pt).then(
                        function(data){
                            angular.copy(data,pt);
                        }
                        ,function(reason){
                            alert_service(reason); 
                        }
                    );
                }
            }
            ModalCtrl.$inject = ['$scope','$modalInstance','$q','pt_lst'];
            var dlg = $modal.open({
                template:template,
                controller:ModalCtrl,
                size:'md',
                resolve:{
                    pt_lst:function(){ return api.get_lst(); }
                }
            })
        }
    }])
})