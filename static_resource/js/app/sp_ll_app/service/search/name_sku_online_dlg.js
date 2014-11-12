define(
[
     'angular'
    ,'directive/share_directive'       
    ,'app/sp_app/service/api/search'
    ,'service/misc'
]
,function
(
    angular
)
{
    var mod = angular.module('sp_ll_app/service/search/name_sku_online_dlg',
    [
        'directive/share_directive',
        'sp_app/service/api/search',
        'service/misc'
    ]);

    mod.factory('sp_ll_app/service/search/name_sku_online_dlg/multiple',
    [
        '$modal',
        'sp_app/service/api/search',
        'service/misc',
    function(
        $modal,
        api,
        misc_service
    ){
        var template = 
            '<div class="modal-header">' +
                '<h3 class="modal-title">search</h3>' +
            '</div>'+

            '<div class="modal-body">' + 
                '<input' +
                    ' id="sp_ll_app/service/search/name_sku_online_dlg/multiple/search_txt"' +
                    ' type="text"' +
                    ' ng-model="$parent.search_str"' +
                    ' ng-enter="search()"' +
                    ' placeholder="name/sku"' +
                    ' focus-me="{{true}}"' +
                '>' + 
                '<input ng-model="$parent.query" type="text" placeholder="local filter">' + 
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

                            '<tr ng-repeat="sp_multiple in sp_lst | orderBy:\'name\' | filter:$parent.query">' + 
                                '<td>{{sp_multiple.name}}</td>' +
                                '<td class="alnright">{{sp_multiple.price | currency}}</td>' +
                                '<td class="alncenter"><button ng-class="is_sp_selected(sp_multiple) ? \'btn-warning glyphicon-check\' : \'btn-primary glyphicon-unchecked\'" class="btn glyphicon" ng-click="toggle_select(sp_multiple)"></button></td>' +
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
                return misc_service.get_item_from_lst_base_on_id(sp.id,$scope.result_sp_lst) !=null;
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
                api.name_sku_search($scope.search_str,after).then(
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

    mod.factory('sp_ll_app/service/search/name_sku_online_dlg/single',
    [
         '$modal'
        ,'sp_app/service/api/search'
    ,function(
         $modal
        ,api
    ){
        var template = 
            '<div class="modal-header">' +
                '<h3 class="modal-title">search</h3>' +
            '</div>'+

            '<div class="modal-body" infinite-scroll="search(\'infinite_scroll\')" infinite-scroll-distance="0">' + 
                '<input' +
                    ' id="sp_ll_app/service/search/name_sku_online_dlg/single/search_txt"' +
                    ' type="text"' +
                    ' ng-model="$parent.search_str"' +
                    ' ng-enter="search(\'user\')"' +
                    ' placeholder="name/sku"' +
                    ' focus-me={{true}}' +
                    ' blur-me="is_blur_search_text_box"' +
                '>' +
                '<table ng-hide="sp_lst.length==0" class="table table-hover table-bordered table-condensed table-striped">' +
                    '<tr>' +
                        '<th>name</th>' +
                        '<th>price</th>' +
                        '<th>select</th>' +                 
                    '</tr>' +

                    '<tr ng-repeat="search_sp_single in sp_lst">' + 
                        '<td>{{search_sp_single.name}}</td>' +
                        '<td>{{search_sp_single.price}}</td>' +
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
                api.name_sku_search($scope.search_str,after).then(
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
                        $scope.name_search_busy = false;
                    }
                    ,function(reason){ 
                        $scope.message = reason;
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
})