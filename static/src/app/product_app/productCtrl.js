var app = angular.module('app.productApp');
app.requires.push.apply(app.requires,[
    'model.store_product',
    'share.ui'
]);
app.controller('app.productApp.productCtrl',
[
    '$scope',
    '$rootScope',
    '$q',
    'model.store_product.rest_search',
    'share.ui.alert',
    'model.store_product.sku_not_found_handler',
function(
    $scope,
    $rootScope,
    $q,
    sp_rest_search,
    alert_service,
    sku_not_found_handler
){
    var un_subscribe_group = $rootScope.$on('model.group.manage',function(event,data){
        _refresh_current_sp_lst();
    })
    $scope.$on('$destroy',un_subscribe_group);

    $scope.sku_search = function(){
        $scope.name_search_str = "";
        $scope.local_filter = "";
        $scope.sku_search_str = $scope.sku_search_str.trim().toLowerCase();

        if($scope.sku_search_str.length === 0){
            $scope.sp_lst = [];
            return;
        }
        sp_rest_search.by_sku($scope.sku_search_str).then(
            function(data){
                $scope.sp_lst = data.prod_store__prod_sku__1_1;
                if($scope.sp_lst.length === 0){
                    var promise = sku_not_found_handler(data.prod_store__prod_sku__0_0,data.prod_store__prod_sku__1_0,$scope.sku_search_str).then
                    (
                        function(created_sp){ 
                            $scope.sp_lst = [created_sp];
                        }
                        ,function(reason){
                            alert_service(reason);
                        }
                    );
                } 
            }
            ,function(reason){ 
                alert_service(reason);
            }
        )
    }
    function _refresh_current_sp_lst(){
        if($scope.name_search_str.length !== 0){
            $scope.name_search(false/*is_get_next_page*/,false/*ignore_same_search_str*/);
        }else if($scope.sku_search_str.length !== 0){
            $scope.sku_search();
        }              
    }    
    $scope.column_click = function(column_name){
        if($scope.cur_sort_column === column_name){
            $scope.cur_sort_desc = !$scope.cur_sort_desc;
        }else{
            $scope.cur_sort_column = column_name;
            $scope.cur_sort_desc = false;
        }
    }
    $scope.get_sort_class = function(column_name){
        if(column_name === $scope.cur_sort_column){
            return "glyphicon glyphicon-arrow-" + ($scope.cur_sort_desc ? 'down' : 'up');
        }else{
            return '';
        }
    }    
    $scope.name_search = function(is_infinite_scroll){
       
        //return if busy
        if($scope.name_search_busy === true){
            return;
        }

        //clear out search form
        $scope.sku_search_str = "";
        $scope.local_filter = "";
        $scope.name_search_str = $scope.name_search_str.trim();
        if($scope.name_search_str.length === 0){
            $scope.sp_lst = [];
            return;
        }

        var after = null;
        if(is_infinite_scroll === true){
            if($scope.name_search_reach_the_end){
                return;
            }else{
                after = $scope.sp_lst.length;
            }                        
        }else{
            after = 0;
            $scope.sp_lst = [];
            $scope.name_search_reach_the_end = false;                        
        }

        $scope.name_search_busy = true;
        sp_rest_search.by_name($scope.name_search_str,after).then(
            function(data){
                if(data.length === 0){
                    $scope.name_search_reach_the_end = true;
                }else{
                    for(var i = 0;i<data.length;i++){
                        $scope.sp_lst.push(data[i]);
                    }                        
                }

                if($scope.sp_lst.length === 0){ 
                    alert_service('no result found for ' + '"' + $scope.name_search_str + '"','info','blue');
                }
                $scope.name_search_busy = false;
            }
            ,function(reason){ 
                alert_service(reason); 
            }
        )
    }

    //SORT
    $scope.cur_sort_column = 'name';
    $scope.cur_sort_desc = false;        

    $scope.sp_lst = [];        
    $scope.name_search_reach_the_end = false;
    $scope.name_search_str = '';
    $scope.sku_search_str = '';
    $scope.name_search_busy = false; 
}]);