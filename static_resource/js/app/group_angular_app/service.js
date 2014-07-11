define(
[
    'angular'
]
,function
(
    angular
)
{
    var mod = angular.module('group_app.service',[]);
    mod.factory('group_app.group.select.service',['$modal','$http',function($modal,$http){
        var template = 
            '<div class="modal-header">' +
                '<h3 class="modal-title">{{is_select_multiple?"select one or many groups" : "select a group"}}</h3>' +
            '</div>' +

            '<div class="modal-body">' +  
                '<table ng-hide="group_lst.length==0" class="table table-hover table-bordered table-condensed table-striped">' +
                    '<tr>' +
                        '<th>group</th>' +         
                        '<th>select</th>' +                
                    '</tr>' +    
                    '<tr ng-repeat="group in group_lst | orderBy:name">' +
                        '<td>{{group.name}}</td>' +    
                        '<td><label class="btn btn-primary" ng-model="result_lst[$index]" btn-checkbox>' +
                            '<span ng-class="result_lst[$index] ? \'glyphicon glyphicon-check\' : \'glyphicon glyphicon-unchecked\'"></span>' +
                        '</label></td>' +                                            
                    '</tr>' +                                                  
                '</table>' +
                '<pre ng-show="group_lst.length==0">There is no group to select.</pre>' +
            '</div>' +

            '<div class="modal-footer">' +          
                '<button class="btn btn-warning" ng-click="cancel()">cancel</button>' +                           
                '<button ng-disabled="!is_select_any()" class="btn btn-success" ng-click="ok()">ok</button>' +
            '</div>'        
        ; 

        var ModalCtrl = function($scope,$modalInstance,is_select_multiple,group_lst_promise){  
            if(group_lst_promise.status != 200){
                alert('there is error getting group data');
            }else{
                $scope.group_lst = group_lst_promise.data;
                //init result_lst
                $scope.result_lst = {};
                for(var i = 0;i<$scope.group_lst.length;i++){
                    $scope.result_lst[i] = false;
                }
            }
            $scope.is_select_multiple = is_select_multiple;

            function get_select_group_lst(){
                var result = [];
                for(var index in $scope.result_lst){
                    if ($scope.result_lst.hasOwnProperty(index) && $scope.result_lst[index]==true) {
                        result.push($scope.group_lst[index])
                    }
                }          
                return result;      
            }
            $scope.is_select_any = function(){
                return get_select_group_lst().length != 0;
            }
            $scope.cancel = function(){
                $modalInstance.dismiss('cancel');
            };
            $scope.ok = function(){
                $modalInstance.close(get_select_group_lst());    
            };
        }

        return function(is_select_multiple){
            var dlg = $modal.open({
                template: template,
                controller: ModalCtrl,
                // backdrop:'static',
                // scope:$scope,
                size: 'lg',
                resolve : {
                    is_select_multiple : function(){return is_select_multiple},
                    group_lst_promise : function(){
                        return $http({
                            url:'/group/get_lst',
                            method:'GET',
                        });
                    }
                }
            });
            return dlg.result;
        }                    
    }]);
})