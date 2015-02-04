var mod = angular.module('share.ui');

mod.factory('share.ui.confirm',['$modal',function($modal){
    return function(message,type){
        if(type == null){
            type = 'warning';
        }
        var warning_class = 'alert alert-' + type;
        
        var template = 
            '<div id="service/ui/confirm/dialog" class="modal-header ' + warning_class + '">' +
                '<h3 class="modal-title">confirm</h3>' +
            '</div>' +
            '<div class="modal-body">' +
                '<h1 id="service/ui/confirm/message_txt">' + message + '</h1>' +
            '</div>' +
            '<div class="modal-footer">' +
                '<button id="service/ui/confirm/cancel_btn" class="btn btn-warning" ng-click="cancel()" type="button">cancel</button>' +                
                '<button id="service/ui/confirm/ok_btn" type="submit" class="btn btn-success" ng-click="ok()">ok</button>' +
            '</div>'
        ;

        var ModalCtrl = function($scope,$modalInstance){
            $scope.ok = function(){
                $modalInstance.close();
            }
            $scope.cancel = function(){
                $modalInstance.dismiss('_cancel_');
            }               
        }
        ModalCtrl.$inject = ['$scope','$modalInstance'];
        var dlg = $modal.open({
            template : template,
            controller : ModalCtrl,
            size : 'md'
        });         
        return dlg.result;
    }
}]);
