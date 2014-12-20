define(
[
    'angular'
    //
    ,'model/shortcut/service/shortcut_ui'
]
,function
(
    angular
)
{
    var mod = angular.module('shortcut/service/usage',
    [
        'shortcut/service/shortcut_ui'
    ]);
    mod.factory('shortcut/service/usage',
    [
         '$modal'
        ,'shortcut/service/shortcut_ui'
    ,function(
         $modal
        ,shortcut_ui
    ){
        return function(shortcut_lst){
            var template = 
                '<div class="modal-header">' +
                    '<h3 class="modal-title">shortcut</h3>' +
                '</div>' +
                '<div class="modal-body">' +
                    '<table class="table table-bordered table-condensed sale_shortcut_tbl">' +
                        '<tr>' +
                            '<th>left folder</th>' +
                            '<th ng-repeat="col in col_lst"></th>' + //this execute column_count times  
                            '<th>right folder</th>' +                                                   
                        '</tr>' +
                        '<tr ng-repeat="row_usage in row_lst">' +
                            '<td' +
                                ' ng-class="current_parent_pos==row_usage?\'warning\':\'success\'"' +
                                ' ng-click="set_cur_parent_position(row_usage)">' +
                                    '{{get_parent_caption(true,row_usage)}}' +
                            '</td>' +

                            '<td ng-repeat="col in col_lst" ng-click="click_shortcut_child(row_usage,col)">{{get_child_caption_of_cur_parent(row_usage,col)}}</td>' +

                            '<td' +
                                ' ng-class="current_parent_pos==row_usage+row_count?\'warning\':\'success\'"' +
                                ' ng-click="set_cur_parent_position(row_usage+row_count)">' +
                                    '{{get_parent_caption(false,row_usage)}}' +
                            '</td>' +
                        '</tr>'+
                    '</table>' +
                '</div>' +
                '<div class="modal-footer">' +
                    '<button ng-click="exit()" class="btn btn-warning">exit</button>' +
                '</div>'                          
            ;
 
            var ModalCtrl = function($scope,$modalInstance){
                shortcut_ui.init($scope);
                $scope.exit = function(){ 
                    $modalInstance.dismiss('_cancel_'); 
                } 
                $scope.click_shortcut_child = function(row,col){
                    var child_pos = shortcut_ui.calculate_child_position(row,col,$scope);
                    var child = shortcut_ui.get_child_of_cur_parent(row,col,$scope);
                    if(child!==null){
                        $modalInstance.close(child); 
                    }
                }
            }
            ModalCtrl.$inject = ['$scope','$modalInstance'];
            var dlg = $modal.open({
                template:template,
                controller:ModalCtrl,
                size:'lg',
            })
            return dlg.result;
        }
    }])
})