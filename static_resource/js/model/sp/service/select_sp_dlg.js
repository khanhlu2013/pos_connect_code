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
                '<div class="modal-header">' +
                    '<h3>select a product</h3>' +
                '</div>' +

                '<div class="modal-body">' +
                    '<table class="table table-hover table-bordered table-condensed table-striped">' +
                        '<tr>' +
                            '<th>product</th>' + 
                            '<th>price</th>' +
                            '<th>crv</th>' +
                            '<th>buydown</th>' +
                            '<th>cost</th>' +
                            '<th>select</th>' + 
                        '</tr>' +

                        '<tr ng-repeat="sp in sp_lst">' +
                            '<td>{{sp.name}}</td>' +
                            '<td>{{sp.price}}</td>' +
                            '<td>{{sp.crv}}</td>' +     
                            '<td>{{sp.buydown}}</td>' +                                                     
                            '<td>{{sp.cost}}</td>' +
                            '<td><button ng-click="select(sp)" class="btn btn-primary">select</button></td>' +                                            
                        '</tr>' +

                        
                    '</table>' +
                '</div>' +

                '<div class="modal-footer">' +
                    '<button ng-click="exit()" class="btn btn-warning">exit</button>' +
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
                size : 'md',
                resolve:{ sp_lst:function(){return sp_lst}}
            })
            return dlg.result;
        }
    }])
})