define(
[
     'angular'
    //-------
    ,'app/sale_app/service/search/name_sku_api'
]
,function
(
    angular
)
{
    var mod = angular.module('sale_app/service/search/name_sku_dlg',
    [
        'sale_app/service/search/name_sku_api'
    ]);
    mod.factory('sale_app/service/search/name_sku_dlg',
    [
         '$modal'
        ,'sale_app/service/search/name_sku_api'
    ,function(
         $modal
        ,name_sku_api
    ){
        return function(){
            var template = 
                '<div class="modal-header"><h3>search sku or name</h3></div>' +

                '<div class="modal-body">' +
                    '<input ng-enter="search()" ng-model="name_sku_search_str" type="text" placeholder="name/sku"></input>' +
                    '<table class="table table-hover table-bordered table-condensed table-striped">' +
                        '<tr>' +
                            '<th>name</th>' +
                        '</tr>' +

                        '<tr ng-repeat="doc in doc_lst">' +
                            '<td>{{doc.name}}</td>'
                        '</tr>' +
                    '</table>' +
                '</div>' +

                '<div class="modal-footer">' +
                    '<button ng-click="exit()" class="btn btn-warning">exit</button>' +
                '</div>'
            ;
            var controller = function($scope,$modalInstance){
                $scope.doc_lst = [];

                $scope.search = function(){
                    name_sku_api($scope.name_sku_search_str)
                    .then(function(doc_lst){$scope.doc_lst = doc_lst});
                }
                $scope.exit = function(){$modalInstance.dismiss('_cancel_')};
            }
            var dlg = $modal.open({
                template: template,
                controller : controller,
                size: 'lg',
            })
            return dlg.result;
        }
    }])
})