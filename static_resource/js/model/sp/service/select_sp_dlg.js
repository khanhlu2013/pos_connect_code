define(
[
    'angular'
]
,function
(
    angular
)
{
    var mod = angular.module('sp/service/select_sp_dlg',[]);
    mod.factory('sp/service/select_sp_dlg',['$modal',function($modal){
        return function(sp_lst){
            var template = 
                '<div class="modal-header" id="sp/service/select">' +
                    '<h3>select a product</h3>' +
                '</div>' +

                '<div class="modal-body">' +
                    '<table class="table table-hover table-bordered table-condensed table-striped">' +
                        '<tr>' +
                            '<th>product</th>' + 
                            '<th>price</th>' +
                            '<th>crv</th>' +
                            '<th>taxable</th>' +
                            '<th>buydown</th>' +
                            '<th>select</th>' + 
                        '</tr>' +

                        '<tr ng-repeat="sp_to_select in sp_lst|orderBy:\'name\'">' +
                            '<td>{{sp_to_select.name}}</td>' +
                            '<td>{{sp_to_select.price}}</td>' +
                            '<td>{{sp_to_select.get_crv()}}</td>' +   
                            '<td class="alncenter"><span class="glyphicon" ng-class="sp_to_select.is_taxable ? \'glyphicon-check\' : \'glyphicon-unchecked\'"></span></td>' +
                            '<td>{{sp_to_select.get_buydown()}}</td>' +                                                     
                            '<td class="alncenter"><button ng-click="select(sp_to_select)" class="btn btn-primary">select</button></td>' +                                            
                        '</tr>' +
                    '</table>' +
                '</div>' +

                '<div class="modal-footer">' +
                    '<button id="sp/service/select/exit_btn" ng-click="exit()" class="btn btn-warning">exit</button>' +
                '</div>'
            ;                               
            var ModalCtrl = function($scope,$modalInstance,sp_lst){
                $scope.sp_lst = sp_lst;
                $scope.select = function(sp){
                    $modalInstance.close(sp);
                }
                $scope.exit = function(){
                    $modalInstance.dismiss('_cancel_');
                }
            }
            ModalCtrl.$inject = ['$scope','$modalInstance','sp_lst'];            
            var dlg = $modal.open({
                template : template,
                controller : ModalCtrl,
                size : 'lg',
                resolve:{ sp_lst:function(){return sp_lst}}
            })
            return dlg.result;
        }
    }])
})