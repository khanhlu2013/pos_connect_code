define(
[
    'angular'
    //
    ,'service/ui'
    ,'app/shortcut_app/service/edit'
    ,'app/shortcut_app/service/create'
    ,'app/shortcut_app/service/set_child'
    ,'app/shortcut_app/shortcut_ui'
]
,function
(
    angular
)
{
    var mod = angular.module('shortcut_app/service/manage',
    [
         'service/ui'
        ,'shortcut_app/service/edit'
        ,'shortcut_app/service/create'
        ,'shortcut_app/service/set_child'
        ,'shortcut_app/shortcut_ui'
    ]);
    mod.factory('shortcut_app/service/manage',
    [
        '$modal',
        '$http',
        'service/ui/alert',
        'shortcut_app/service/edit',
        'shortcut_app/service/create',
        'shortcut_app/service/set_child',
        'shortcut_app/shortcut_ui',
    function(
        $modal,
        $http,
        alert_service,
        edit_service,
        create_service,
        set_child_service,
        shortcut_ui
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
                            '<td ng-class="current_parent_pos==row?\'warning\':\'success\'" ng-click="set_cur_parent_position(row)">{{get_parent_caption(true,row)}}</td>' +
                            '<td ng-click="set_cur_parent_position(row)" ng-class="current_parent_pos==row?\'warning\':\'success\'" class="alncenter"><button ng-click="edit_shortcut(row)" class="btn btn-primary glyphicon glyphicon-pencil"></button></td>' +

                            '<td ng-repeat="col in col_lst" ng-click="edit_shortcut_child(row,col)">{{get_child_caption_of_cur_parent(row,col)}}</td>' +

                            '<td ng-click="set_cur_parent_position(row+row_count)" ng-class="current_parent_pos==row+row_count?\'warning\':\'success\'" class="alncenter"><button ng-click="edit_shortcut(row+row_count)" class="btn btn-primary glyphicon glyphicon-pencil"></button></td>' +
                            '<td ng-class="current_parent_pos==row+row_count?\'warning\':\'success\'" ng-click="set_cur_parent_position(row+row_count)">{{get_parent_caption(false,row)}}</td>' +
                        '</tr>'+
                    '</table>' +
                '</div>' +
                '<div class="modal-footer">' +
                    '<button id="shortcut_app/service/manage/exit_btn" ng-click="exit()" class="btn btn-warning glyphicon glyphicon-remove"></button>' +
                '</div>'                          
            ;

            var ModalCtrl = function($scope,$modalInstance,$http,$q,shortcut_lst){
                //init shortcut_ui module
                shortcut_ui.init($scope,shortcut_lst);
                $scope.exit = function(){
                    $modalInstance.close();
                }

                //helper to trigger shortcut and shortcut_child api on server.
                $scope.edit_shortcut_child = function(row,col){
                    //trigger shortcut_child api and update ui (hint:2 way binding taking care of actual display)
                    var child_pos = shortcut_ui.calculate_child_position(row,col);
                    var child = shortcut_ui.get_child_of_cur_parent(row,col);
                    var promise = set_child_service(shortcut_ui.get_cur_parent_position(),child_pos,child)
                    promise.then(
                        function(shortcut){
                            var cur_parent = shortcut_ui.get_cur_parent();
                            if(cur_parent == null){ shortcut_ui.add_shortcut(shortcut); }
                            else{ angular.copy(shortcut,cur_parent); }
                        },
                        function(reason){
                            alert_service('alert',reason,'red');
                        }
                    )
                }
                $scope.edit_shortcut = function(position){
                    //trigger shortcut api (hint:2 way binding taking care of actual display)
                    shortcut_ui.set_cur_parent_position(position);
                    var parent = shortcut_ui.get_cur_parent();
                    if(parent != null){
                        //edit
                        var promise = edit_service(parent);
                        promise.then(
                             function(data){ angular.copy(data,parent); }
                            ,function(reason){ alert_service('alert',reason,'red'); }
                        )
                    }else{
                        //create
                        var promise = create_service(position);
                        promise.then(
                             function(shortcut){ shortcut_ui.add_shortcut(shortcut); }
                            ,function(reason){ alert_service('alert',reason,'red'); }
                        )
                    }
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