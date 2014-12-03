define(
[
    'angular'
    //
    ,'service/ui'
    ,'model/shortcut/service/edit'
    ,'model/shortcut/service/create'
    ,'model/shortcut/service/set_child'
    ,'model/shortcut/service/shortcut_ui'
    ,'model/shortcut/api'
]
,function
(
    angular
)
{
    var mod = angular.module('shortcut/service/manage',
    [
         'service/ui'
        ,'shortcut/service/edit'
        ,'shortcut/service/create'
        ,'shortcut/service/set_child'
        ,'shortcut/service/shortcut_ui'
        ,'shortcut/api'
    ]);
    mod.factory('shortcut/service/manage',
    [
        '$modal',
        '$http',
        'service/ui/alert',
        'shortcut/service/edit',
        'shortcut/service/create',
        'shortcut/service/set_child',
        'shortcut/service/shortcut_ui',
        'shortcut/api',
    function(
        $modal,
        $http,
        alert_service,
        edit_service,
        create_service,
        set_child_service,
        shortcut_ui,
        shortcut_api
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
                        '<tr ng-repeat="row_setup in row_lst">' +
                            '<td' +
                                ' ng-class="current_parent_pos==row_setup?\'warning\':\'success\'"' +
                                ' ng-click="set_cur_parent_position(row_setup)">' +
                                    '{{get_parent_caption(true,row_setup)}}' +
                            '</td>' +
                            '<td' +
                                ' ng-click="set_cur_parent_position(row_setup)"' +
                                ' ng-class="current_parent_pos==row_setup?\'warning\':\'success\'" class="alncenter">' +
                                    '<button ng-click="edit_shortcut(row_setup)" class="btn btn-primary glyphicon glyphicon-pencil"></button>' +
                            '</td>' +

                            '<td ng-repeat="col in col_lst" ng-click="edit_shortcut_child(row_setup,col)">{{get_child_caption_of_cur_parent(row_setup,col)}}</td>' +

                            '<td' +
                                ' ng-click="set_cur_parent_position(row_setup+row_count)"' + 
                                ' ng-class="current_parent_pos==row_setup+row_count?\'warning\':\'success\'"' +
                                ' class="alncenter">' +
                                    '<button ng-click="edit_shortcut(row_setup+row_count)" class="btn btn-primary glyphicon glyphicon-pencil"></button>' +
                            '</td>' +
                            '<td' +
                                ' ng-class="current_parent_pos==row_setup+row_count?\'warning\':\'success\'"' +
                                ' ng-click="set_cur_parent_position(row_setup+row_count)">' +
                                    '{{get_parent_caption(false,row_setup)}}' +
                            '</td>' +
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
                $scope.exit = function(){ $modalInstance.close(); }

                function add_shortcut(shortcut){
                    $scope.shortcut_lst.push(shortcut)
                }     
                //helper to trigger shortcut and shortcut_child api on server.
                $scope.edit_shortcut_child = function(row,col){
                    //trigger shortcut_child api and update ui (hint:2 way binding taking care of actual display)
                    var child_pos = shortcut_ui.calculate_child_position(row,col,$scope);
                    var child = shortcut_ui.get_child_of_cur_parent(row,col,$scope);
                    var promise = set_child_service(shortcut_ui.get_cur_parent_position($scope),child_pos,child)
                    promise.then(
                        function(shortcut){
                            var cur_parent = shortcut_ui.get_cur_parent($scope);
                            if(cur_parent == null){ add_shortcut(shortcut); }
                            else{ angular.copy(shortcut,cur_parent); }
                        },
                        function(reason){
                            alert_service(reason);
                        }
                    )
                }
                $scope.edit_shortcut = function(position){
                    //trigger shortcut api (hint:2 way binding taking care of actual display)
                    $scope.current_parent_pos = position;
                    var parent = shortcut_ui.get_cur_parent($scope);
                    if(parent != null){
                        //edit
                        var promise = edit_service(parent);
                        promise.then(
                            function(data){ 
                                angular.copy(data,parent); 
                            }
                            ,function(reason){ 
                                alert_service(reason); 
                            }
                        )
                    }else{
                        //create
                        var promise = create_service(position);
                        promise.then(
                            function(shortcut){ 
                                add_shortcut(shortcut); 
                            }
                            ,function(reason){ 
                                alert_service(reason); 
                            }
                        )
                    }
                }
            }
            ModalCtrl.$inject = ['$scope','$modalInstance','$http','$q','shortcut_lst'];
            var dlg = $modal.open({
                template:template,
                controller:ModalCtrl,
                size:'lg',
                resolve:{ shortcut_lst:function(){return shortcut_api.get()}}
            })
        }
    }])
})