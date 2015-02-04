var mod = angular.module('model.store_product');
mod.requires.push.apply(mod.requires,[
    'share.ui',
    'share.util'
])
mod.factory('model.store_product.search.online.multiple',
[
    '$modal',
    'share.ui.alert',
    'model.store_product.rest_search',
    'share.util.misc',
function(
    $modal,
    alert_service,
    rest_search_service,
    misc_util
){
    var template = 
        '<div class="modal-header">' +
            '<h3 class="modal-title">search</h3>' +
        '</div>'+

        '<div class="modal-body">' + 
            '<input' +
                ' id="sp_ll_app/service/search/name_sku_online_dlg/multiple/search_txt"' +
                ' type="text"' +
                ' ng-model="search_str"' +
                ' ng-enter="search()"' +
                ' placeholder="name/sku"' +
                ' focus-me="{{true}}"' +
            '>' + 
            '<input ng-model="local_filter" type="text" placeholder="local filter">' + 
            '<div>' +
                '<div class="col-sm-6">' +
                    '<div ng-hide="message.length == 0">' +
                        '<pre>{{message}}</pre>' +
                    '</div>' +  
                    '<table class="table table-hover table-bordered table-condensed table-striped">' +
                        '<tr>' +
                            '<th>name</th>' +
                            '<th>price</th>' +
                            '<th>select</th>' +                 
                        '</tr>' +

                        '<tr ng-repeat="sp_multiple in sp_lst | orderBy:\'name\' | filter:local_filter">' + 
                            '<td>{{sp_multiple.name}}</td>' +
                            '<td class="alnright">{{sp_multiple.price | currency}}</td>' +
                            '<td class="alncenter"><button ng-class="is_sp_selected(sp_multiple) ? \'btn-warning glyphicon-check\' : \'btn-primary glyphicon-unchecked\'" class="btn glyphicon" ng-click="toggle_select(sp_multiple)" onclick="this.blur()"></button></td>' +
                        '</tr>' +
                    '</table>' +
                '</div>' +

                '<div class="col-sm-6">' +
                    '<table class="table table-hover table-bordered table-condensed table-striped">' +
                        '<tr>' +
                            '<th>name</th>' +
                            '<th>price</th>' +                              
                            '<th>remove</th>' +                 
                        '</tr>' +

                        '<tr ng-repeat="sp_select in result_sp_lst | orderBy:\'name\'">' + 
                            '<td>{{sp_select.name}}</td>' +
                            '<td class="alnright">{{sp_select.price|currency}}</td>' +
                            '<td class="alncenter"><button class="btn btn-warning glyphicon glyphicon-trash" ng-click="remove(sp_select)"></button></td>' +
                        '</tr>' +                           
                    '</table>' +
                '</div>' +                  
            '</div>' +
            '<div class="clear"></div>' +
        '</div>' +

        '<div class="modal-footer">' + 
            '<button class="btn btn-warning" ng-click="cancel()">cancel</button>' +
            '<button ng-disabled="result_sp_lst.length==0" class="btn btn-primary" ng-click="reset()">reset</button>' +             
            '<button id="sp_ll_app/service/search/name_sku_online_dlg/multiple/ok_btn" ng-disabled="result_sp_lst.length==0" class="btn btn-success" ng-click="ok()">ok</button>' +
        '</div>'
    ;
    var ModalCtrl = function($scope,$modalInstance,$http){
        $scope.message = "";
        $scope.sp_lst = "";
        $scope.result_sp_lst = [];
        $scope.query = "";

        $scope.ok = function(){
            $modalInstance.close($scope.result_sp_lst)
        }
        $scope.is_sp_selected = function(sp){
            return misc_util.get_item_from_lst_base_on_id(sp.id,$scope.result_sp_lst) !=null;
        }
        $scope.reset = function(){
            $scope.result_sp_lst = [];
        }
        $scope.toggle_select = function(sp){
            if($scope.is_sp_selected(sp)){
                $scope.remove(sp);
            }else{
                $scope.result_sp_lst.push(sp);
            }
        }
        $scope.remove = function(sp){
            var index = null;
            for(var i = 0;i<$scope.result_sp_lst.length;i++){
                if(sp.id == $scope.result_sp_lst[i].id){
                    index = i;
                    break;
                }
            }
            $scope.result_sp_lst.splice(index,1);
        }

        $scope.search = function(){
            $scope.query = "";
            $scope.search_str = $scope.search_str.trim();
            $scope.last_search_str = $scope.search_str;

            if($scope.search_str.length == 0){
                $scope.sp_lst = [];
                $scope.message = "";
                return;
            }
            var after = 0;
            rest_search_service.by_name_sku($scope.search_str,after).then(
                function(result_lst){
                    $scope.sp_lst = result_lst;
                    if($scope.sp_lst.length == 0){ $scope.message = "no result for " + "'" + $scope.search_str + "'";}
                    else{ $scope.message = ""; }
                }
                ,function(reason){ $scope.message = reason; }
            )
        }
        $scope.cancel = function(){
            $modalInstance.dismiss('_cancel_');
        }
    }
    ModalCtrl.$inject = ['$scope','$modalInstance','$http'];        
    return function(){
        var dlg = $modal.open({
            template:template,
            controller:ModalCtrl,
            size:'lg'
        });
        return dlg.result
    }
}]);
