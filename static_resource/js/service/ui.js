define(
[
    'angular'
    //---
    ,'directive/share_directive'
]
,function
(
    angular
)
{
    var mod = angular.module('service/ui',['directive/share_directive']);

    mod.factory('service/ui/prompt',
    [
         '$modal'
        ,'service/ui/alert'
    ,function(
         $modal
        ,alert_service
    ){
        return function(message,prefill,is_null_allow,is_float){
            var template = 
            '<form name="form" novalidate>' +
                '<div id="service/ui/prompt/dialog" class="modal-header alert alert-info">' +
                    '<h3 class="modal-title">' + message + '</h3>' +
                '</div>' +
                '<div class="modal-body">' +
                    // '<form name="form" novalidate>' +
                        '<input id="service/ui/prompt/prompt_txt" name="answer" ng-model="$parent.answer" type="text" ng-required="!is_null_allow" focus-me={{true}}>' +
                        '<label class="error" ng-show="form.answer.$error.required">require</label>' +
                    // '</form>' +
                '</div>' +
                '<div class="modal-footer">' +
                    '<button id="service/ui/prompt/cancel_btn" class="btn btn-warning" ng-click="cancel()" type="button">cancel</button>' +           
                    '<button ng-show="$parent.prefill!=null" ng-disabled="is_unchange()" ng-click="reset()" class="btn btn-primary" type="button">reset</button>' +
                    '<button id="service/ui/prompt/ok_btn" ng-disabled="form.$invalid || is_unchange()" type="submit" class="btn btn-success" ng-click="ok()">ok</button>' +
                '</div>'
            '</form>'             
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
                        alert_service('invalid number');
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

    mod.factory('service/ui/_3_option',['$modal',function($modal){
        return function(message,title,color_1,color_2,color_3,caption_1,caption_2,caption_3){
            var template = 
                '<div id="service/ui/_3_option/dialog" class="modal-header alert alert-info">' +
                    '<h3 class="modal-title">{{title}}</h3>' +
                '</div>' +
                '<div class="modal-body">' +
                    '<h1 id="service/ui/_3_option/message_txt">{{message}}</h1>' +
                '</div>' +
                '<div class="modal-footer">' +
                    '<button id="service/ui/_3_option/_1_btn" class="btn" ng-class="color_1" ng-click="exit(1)" type="button">{{caption_1}}</button>' +                
                    '<button id="service/ui/_3_option/_2_btn" class="btn" ng-class="color_2" ng-click="exit(2)" type="button">{{caption_2}}</button>' +                         
                    '<button id="service/ui/_3_option/_3_btn" class="btn" ng-class="color_3" ng-click="exit(3)" type="button">{{caption_3}}</button>' +                          
                '</div>'
            ;

            var ModalCtrl = function($scope,$modalInstance,message,title,color_1,color_2,color_3,caption_1,caption_2,caption_3){
                $scope.message = message;
                $scope.title = title;
                $scope.color_1 = color_1;
                $scope.color_2 = color_2;
                $scope.color_3 = color_3;
                $scope.caption_1 = caption_1;
                $scope.caption_2 = caption_2;
                $scope.caption_3 = caption_3;
                $scope.exit = function(option){
                    $modalInstance.close(option);
                }             
            }
            ModalCtrl.$inject = ['$scope','$modalInstance','message','title','color_1','color_2','color_3','caption_1','caption_2','caption_3'];
            var dlg = $modal.open({
                template : template,
                controller : ModalCtrl,
                size : 'md',
                resolve:{ 
                     message : function(){ return message }
                    ,title : function(){ return title }                    
                    ,color_1 : function(){ return color_1 }
                    ,color_2 : function(){ return color_2 }
                    ,color_3 : function(){ return color_3 }
                    ,caption_1 : function(){ return caption_1 }
                    ,caption_2 : function(){ return caption_2 }
                    ,caption_3 : function(){ return caption_3 }                    
                }
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

    // mod.factory('service/ui/alert',['$modal',function($modal){
    //     return function(alert_obj,title,color){
    //         if(title === undefined){
    //             title = 'alert';
    //         }
    //         if(color === undefined){
    //             color = 'red';
    //         }
    //         var message;
    //         if(typeof(alert_obj) === 'string'){
    //             message = alert_obj;
    //             if(message === '_cancel_' || message === undefined/*cancel click*/ || message === 'backdrop click' || message === 'escape key press'){
    //                 return;
    //             }
    //         }else{
    //             if(alert_obj.constructor.name === 'PouchError' || alert_obj.constructor.name === 'Error'){
    //                 title = 'Pouch error: ' + alert_obj.name;
    //                 message = alert_obj.message;
    //             }else{
    //                 if(alert_obj.status === 0){
    //                     message = 'internet is disconnected!'
    //                 }else{
    //                     title = 'please report ajax bug:'
    //                     message = 'url: ' + alert_obj.config.url;
    //                 }                    
    //             }
    //         }

    //         var warning_class = ""
    //         if(color == 'green'){
    //             warning_class = 'alert alert-success'
    //         }else if(color == 'blue'){
    //             warning_class = 'alert alert-info'
    //         }else if(color == 'orange'){
    //             warning_class = 'alert alert-warning'
    //         }else if(color == 'red'){
    //             warning_class = 'alert alert-danger'
    //         }

    //         var template = 
    //         '<form name="form" novalidate>' +
    //             '<div id="service/ui/prompt/dialog" class="modal-header alert alert-info">' +
    //                 '<h3 class="modal-title">' + message + '</h3>' +
    //             '</div>' +
    //             '<div class="modal-body">' +
    //                 '<input id="service/ui/prompt/prompt_txt" name="answer" ng-model="$parent.answer" type="text">' +
    //             '</div>' +
    //             '<div class="modal-footer">' +
    //                 '<button id="service/ui/prompt/ok_btn" type="submit" class="btn btn-success" ng-click="ok()">ok</button>' +
    //             '</div>'
    //         '</form>'             
    //         ;

    //         // '<form name="form" novalidate>' +
    //         //     '<div id="service/ui/alert/dialog" class="modal-header ' + warning_class + '">' +
    //         //         '<h3 class="modal-title">' + title + '</h3>' +
    //         //     '</div>' +
    //         //     '<div class="modal-body">' +
    //         //         '<h1 id="service/ui/alert/message_lbl">' + message + '</h1>' +
    //         //     '</div>' +
    //         //     '<div class="modal-footer">' +
    //         //         '<button id="service/ui/alert/ok_btn" type="submit" class="btn btn-success" ng-click="ok()">ok</button>' +
    //         //     '</div>' +
    //         // '</form>'
    //         // ;


    //         var ModalCtrl = function($scope,$modalInstance){
    //             $scope.ok = function(){
    //                 $modalInstance.close();
    //             }
    //         }
    //         ModalCtrl.$inject = ['$scope','$modalInstance'];
    //         var dlg = $modal.open({
    //             template : template,
    //             controller : ModalCtrl,
    //             size : 'md'
    //         });         
    //     }
    // }]);
})