define(
[
    'angular'
    //
    ,'service/ui'
    ,'app/shortcut_app/service/edit'
    ,'app/shortcut_app/service/create'
    ,'app/shortcut_app/service/set_child'
]
,function
(
    angular
)
{
    var mod = angular.module('shortcut_app/service/manage',['service.ui','shortcut_app/service/edit','shortcut_app/service/create','shortcut_app/service/set_child']);
    mod.factory('shortcut_app/service/manage',
    [
        '$modal',
        '$http',
        'service.ui.alert',
        'shortcut_app/service/edit',
        'shortcut_app/service/create',
        'shortcut_app/service/set_child',
    function(
        $modal,
        $http,
        alert_service,
        edit_service,
        create_service,
        set_child_service
    ){
        return function(){
            var template = 
                '<div class="modal-header">' +
                    '<h3 class="modal-title">manage shortcut</h3>' +
                '</div>' +
                '<div class="modal-body">' +
                    '<table class="table table-bordered table-condensed sale_shortcut_tbl">' +
                        '<tr>' +
                            '<th>left folder</th>' +
                            '<th class="alncenter">edit</th>' +
                            '<th ng-repeat="col in col_lst"></th>' + //this execute column_count times
                            '<th class="alncenter">edit</th>' +   
                            '<th>right folder</th>' +                                                   
                        '</tr>' +
                        '<tr ng-repeat="row in row_lst">' +
                            '<td ng-class="current_parent_pos==row?\'warning\':\'success\'" ng-click="parent_click(row)">{{get_parent_caption(true,row)}}</td>' +
                            '<td ng-click="parent_click(row)" ng-class="current_parent_pos==row?\'warning\':\'success\'" class="alncenter"><button ng-click="edit_parent(row)" class="btn btn-primary glyphicon glyphicon-pencil"></button></td>' +

                            '<td ng-repeat="col in col_lst" ng-click="child_click(row,col)">{{get_child_caption_of_cur_parent(row,col)}}</td>' +

                            '<td ng-click="parent_click(row+row_count)" ng-class="current_parent_pos==row+row_count?\'warning\':\'success\'" class="alncenter"><button ng-click="edit_parent(row+row_count)" class="btn btn-primary glyphicon glyphicon-pencil"></button></td>' +
                            '<td ng-class="current_parent_pos==row+row_count?\'warning\':\'success\'" ng-click="parent_click(row+row_count)">{{get_parent_caption(false,row)}}</td>' +
                        '</tr>'+
                    '</table>' +
                '</div>' +
                '<div class="modal-footer">' +
                    '<button id="shortcut_app/service/manage/exit_btn" ng-click="exit()" class="btn btn-warning glyphicon glyphicon-remove"></button>' +
                '</div>'                          
            ;
            var ModalCtrl = function($scope,$modalInstance,$http,$q,shortcut_lst){
                //configuration
                $scope.row_count = 5;
                $scope.column_count = 3;

                //init
                $scope.shortcut_lst = shortcut_lst;
                $scope.current_parent_pos = 0;
                $scope.row_lst = [];
                for(var i = 0;i<$scope.row_count;i++){
                    $scope.row_lst.push(i);
                }
                $scope.col_lst = [];
                for(var i = 0;i<$scope.column_count;i++){
                    $scope.col_lst.push(i);
                }

                //method
                function get_child_position(row,col){
                    return row * $scope.column_count + col;
                }
                $scope.child_click = function(row,col){
                    var child_pos = get_child_position(row,col);
                    var child = get_child_of_cur_parent(row,col);
                    var promise = set_child_service($scope.current_parent_pos,child_pos,child)
                    promise.then(
                        function(data){
                            var cur_parent = get_parent($scope.current_parent_pos);
                            if(cur_parent == null){
                                $scope.shortcut_lst.push(data);
                            }else{
                                angular.copy(data,cur_parent);
                            }
                        },
                        function(reason){
                            alert_service('alert',reason,'red');
                        }
                    )
                }
                $scope.edit_parent = function(position){
                    $scope.current_parent_pos = position;
                    var parent = get_parent(position);
                    if(parent != null){
                        var promise = edit_service(parent);
                        promise.then(
                            function(data){
                                angular.copy(data,parent);
                            },
                            function(reason){
                                alert_service('alert',reason,'red');
                            }
                        )
                    }else{
                        var promise = create_service(position);
                        promise.then(
                            function(data){
                                $scope.shortcut_lst.push(data);
                            },
                            function(reason){
                                alert_service('alert',reason,'red')
                            }
                        )
                    }
                }
                $scope.parent_click = function(position){
                    $scope.current_parent_pos = position;
                }
                function get_child_of_cur_parent(row,col){
                    var child = null;
                    var parent = get_parent($scope.current_parent_pos);
                    if(parent != null){
                        var position = get_child_position(row,col);
                        for(var i = 0;i<parent.child_set.length;i++){
                            if(parent.child_set[i].position == position){
                                child = parent.child_set[i];
                                break;
                            }
                        }                        
                    }
                    return child;
                }
                function get_parent(pos){
                    var parent = null;
                    for(var i = 0;i<$scope.shortcut_lst.length;i++){
                        if($scope.shortcut_lst[i].position == pos){
                            parent = $scope.shortcut_lst[i];
                            break;
                        }
                    }
                    return parent;
                }
                $scope.get_parent_caption = function(is_left,row){
                    var caption = null;
                    var position = row;
                    if(!is_left){
                        position += $scope.row_count;
                    }
                    var parent = get_parent(position);
                    if(parent !=null){
                        caption = parent.caption;
                    }
                    return caption;
                }
                $scope.get_child_caption_of_cur_parent = function(row,col){
                    var caption = null;
                    var child = get_child_of_cur_parent(row,col);
                    if(child != null){
                        caption = child.caption;
                    }
                    return caption;
                }
                $scope.exit = function(){
                    $modalInstance.close($scope.shortcut_lst);
                }
            }
            var dlg = $modal.open({
                template:template,
                controller:ModalCtrl,
                size:'lg',
                windowClass : 'xlg-dialog',
                resolve:{
                    shortcut_lst:function(){
                        var promise_ing = $http({
                            url:'/sale_shortcut/get',
                            method:'GET',
                        })
                        var promise_ed = promise_ing.then(
                            function(data){
                                return data.data;
                            },
                            function(reason){
                                var message = 'get shortcut list ajax error'
                                alert_service('alert',message,'red');
                                return $q.reject(message);
                            }
                        )
                        return promise_ed;
                    }
                }
            })
        }
    }])
})