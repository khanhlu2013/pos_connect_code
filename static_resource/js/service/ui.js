define(
[
    'angular'
    //---
]
,function
(
    angular
)
{
    var mod = angular.module('service/ui',[]);

    mod.factory('service/ui/prompt',['$modal','service/ui/alert',function($modal,alert_service){
        return function(message,prefill,is_null_allow,is_float){
            var template = 
                '<div id="service/ui/prompt/dialog" class="modal-header alert alert-info">' +
                    '<h3 class="modal-title">' + message + '</h3>' +
                '</div>' +
                '<div class="modal-body">' +
                    '<form name="form" novalidate>' +
                        '<input id="service/ui/prompt/prompt_txt" name="answer" ng-model="$parent.answer" type="text" ng-required="!is_null_allow">' +
                        '<label class="error" ng-show="form.answer.$error.required">require</label>' +
                    '</form>' +
                '</div>' +
                '<div class="modal-footer">' +
                    '<button id="service/ui/prompt/cancel_btn" class="btn btn-warning" ng-click="cancel()" type="button">cancel</button>' +           
                    '<button ng-show="$parent.prefill!=null" ng-disabled="is_unchange()" ng-click="reset()" class="btn btn-primary" type="button">reset</button>' +
                    '<button id="service/ui/prompt/ok_btn" ng-disabled="form.$invalid || is_unchange()" type="submit" class="btn btn-success" ng-click="ok()">ok</button>' +
                '</div>'
            ;

            var ModalCtrl = function($scope,$modalInstance,prefill,is_null_allow,is_float){
                $scope.prefill = prefill;
                $scope.answer = prefill;
                $scope.is_null_allow = is_null_allow;
                $scope.is_float = is_float;

                $scope.is_unchange = function(){
                    return angular.equals($scope.answer,$scope.prefill);
                }
                $scope.reset = function(){
                    if($scope.prefill!=null){
                        $scope.answer = $scope.prefill;
                    }
                }
                $scope.ok = function(){
                    if($scope.answer && $scope.is_float && isNaN(+$scope.answer)){
                        alert_service('error','invalid number','red');
                        return;
                    }

                    if($scope.is_float){
                        if($scope.is_null_allow && $scope.answer.length == 0){
                             $modalInstance.close(null);
                        }else{
                            $modalInstance.close(+$scope.answer);
                        }
                    }else{
                        $modalInstance.close($scope.answer);                        
                    }
                    
                }
                $scope.cancel = function(){
                    $modalInstance.dismiss('_cancel_');
                }               
            }
            ModalCtrl.$inject = ['$scope','$modalInstance','prefill','is_null_allow','is_float'];
            var dlg = $modal.open({
                template : template,
                controller : ModalCtrl,
                resolve : {
                    prefill : function(){return prefill;},
                    is_null_allow : function(){return is_null_allow;},
                    is_float : function(){return is_float;}
                },
                size : 'md'
            });         
            return dlg.result;
        }
    }]);

    mod.factory('service/ui/confirm',['$modal',function($modal){
        return function(message,color){
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

    mod.factory('service/ui/alert',['$modal',function($modal){
        return function(title,message,color){
            if(message=='_cancel_' || message==undefined/*cancel click*/ || message == 'backdrop click'){
                return
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
                '<div id="service/ui/alert/dialog" class="modal-header ' + warning_class + '">' +
                    '<h3 class="modal-title">' + title + '</h3>' +
                '</div>' +
                '<div class="modal-body">' +
                    '<h1 id="service/ui/alert/message_lbl">' + message + '</h1>' +
                '</div>' +
                '<div class="modal-footer">' +
                    '<button id="service/ui/alert/ok_btn" type="submit" class="btn btn-success" ng-click="ok()">ok</button>' +
                '</div>'
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

})