var mod = angular.module('model.store_product');
mod.requires.push.apply(mod.requires,[
    'share.ui'
])

mod.factory('model.store_product.search.online.single',
[
     '$modal'
    ,'model.store_product.rest_search'
    ,'share.ui.alert'
,function(
     $modal
    ,rest_search_service
    ,alert_service
){
    var template = 
        '<div class="modal-header">' +
            '<h3 class="modal-title">search</h3>' +
        '</div>'+

        '<div class="modal-body">' + 
            '<input' +
                ' id="sp_ll_app/service/search/name_sku_online_dlg/single/search_txt"' +
                ' type="text"' +
                ' ng-model="search_str"' +
                ' ng-enter="search(\'user\')"' +
                ' placeholder="name/sku"' +
                ' focus-me={{true}}' +
                ' blur-me="is_blur_search_text_box"' +
            '>' +
            '<input ng-model="local_filter" type="text" placeholder="local filter">' +
            '<table ng-hide="sp_lst.length==0" class="table table-hover table-bordered table-condensed table-striped">' +
                '<tr>' +
                    '<th>name</th>' +
                    '<th>price</th>' +
                    '<th>select</th>' +                 
                '</tr>' +

                '<tr ng-repeat="search_sp_single in sp_lst | filter:local_filter">' + 
                    '<td>{{search_sp_single.name}}</td>' +
                    '<td>{{search_sp_single.price|currency}}</td>' +
                    '<td class="alncenter"><button class="btn btn-primary btn-xs" ng-click="select(search_sp_single)">select</button></td>' +
                '</tr>' +
            '</table>' +

            '<div ng-hide="message.length == 0">' +
                '<pre>{{message}}</pre>' +
            '</div>' +
        '</div>' +

        '<div class="modal-footer">' + 
            '<button class="btn btn-warning" ng-click="cancel()">cancel</button>' +
        '</div>'
    ;
    var ModalCtrl = function($scope,$modalInstance,$http){
        $scope.message = "";
        $scope.sp_lst = "";

        $scope.select = function(sp){
            $modalInstance.close(sp);
        }
        $scope.cancel = function(){
            $modalInstance.dismiss('_cancel_');
        }            
        $scope.search = function(search_by){
            if($scope.search_busy === true){
                return;
            }

            $scope.search_str = $scope.search_str.trim();
            
            if($scope.search_str.length === 0){
                $scope.sp_lst = [];
                $scope.message = "";                    
                return;
            }
            var after = null;
            if($scope.old_search_str === null){
                //first time search, we will init the search
                after = 0;
                $scope.sp_lst = [];
                $scope.old_search_str = $scope.search_str;
                $scope.search_reach_the_end = false;
            }else{//this is not the first time search
                if($scope.old_search_str !== $scope.search_str){
                    //if search str is different than previous search, we will init the search
                    after = 0;
                    $scope.sp_lst = [];
                    $scope.old_search_str = $scope.search_str;
                    $scope.search_reach_the_end = false;
                }else{
                    //the search str is the same
                    if(search_by === 'user'){
                        return;
                    }else if(search_by === 'infinite_scroll'){
                        if($scope.search_reach_the_end){
                            return;
                        }else{
                            after = $scope.sp_lst.length;
                        }                        
                    }
                }
            }
            $scope.search_busy = true;
            rest_search_service.name_sku_search($scope.search_str,after).then(
                function(data){
                    if(data.length === 0){
                        $scope.search_reach_the_end = true;
                    }else{
                        for(var i = 0;i<data.length;i++){
                            $scope.sp_lst.push(data[i]);
                        }                        
                    }

                    if($scope.sp_lst.length === 0){ 
                        $scope.message = "no result for " + "'" + $scope.search_str + "'";
                    }else{
                        $scope.message = "";
                        $scope.is_blur_search_text_box = true;
                    }
                    $scope.search_busy = false;
                }
                ,function(reason){ 
                    $scope.message = '';
                    alert_service(reason);
                }
            )
        }

        $scope.search_reach_the_end = false;
        $scope.search_str = '';
        $scope.is_blur_search_text_box = false;
        $scope.search_busy = false;
        $scope.old_search_str = null;            
    }
    ModalCtrl.$inject = ['$scope','$modalInstance','$http'];        
    return function(){
        var dlg = $modal.open({
            template:template,
            controller:ModalCtrl,
            size:'lg',
        });
        return dlg.result
    }
}]); 