var mod = angular.module('share.ui');

mod.factory('share.ui.alert',['$modal',function($modal){
    return function(alert_obj,title,color){
        if(title === undefined){
            title = 'alert';
        }
        if(color === undefined){
            color = 'red';
        }
        var message;
        if(typeof(alert_obj) === 'string'){
            message = alert_obj;
            if(message === '_cancel_' || message === undefined/*cancel click*/ || message === 'backdrop click' || message === 'escape key press'){
                return;
            }
        }else{
            if(alert_obj.constructor.name === 'PouchError' || alert_obj.constructor.name === 'Error'){
                title = 'Pouch error: ' + alert_obj.name;
                message = alert_obj.message;
            }else{
                if(alert_obj.status === 0){
                    message = 'internet is disconnected!'
                }else{
                    title = 'please report ajax bug:'
                    message = 'url: ' + alert_obj.config.url;
                }                    
            }
        }

        var warning_class = ""
        if(color == 'green'){
            warning_class = 'alert alert-success'
        }else if(color == 'blue'){
            warning_class = 'alert alert-info'
        }else if(color == 'orange'){
            warning_class = 'alert alert-warning'
        }else if(color == 'red'){
            warning_class = 'alert alert-danger'
        }

        var template = 
        '<form name="form" novalidate>' +
            '<div id="service/ui/alert/dialog" class="modal-header ' + warning_class + '">' +
                '<h3 class="modal-title">' + title + '</h3>' +
            '</div>' +
            '<div class="modal-body">' +
                '<h1 id="service/ui/alert/message_lbl">' + message + '</h1>' +
            '</div>' +
            '<div class="modal-footer">' +
                '<button id="service/ui/alert/ok_btn" type="submit" class="btn btn-success" ng-click="ok()">ok</button>' +
            '</div>' +
        '</form>'
        ;


        var ModalCtrl = function($scope,$modalInstance){
            $scope.ok = function(){
                $modalInstance.close();
            }
        }
        ModalCtrl.$inject = ['$scope','$modalInstance'];
        var dlg = $modal.open({
            template : template,
            controller : ModalCtrl,
            size : 'md'
        });         
    }
}]);