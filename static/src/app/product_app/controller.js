var app = angular.module('app.productApp');
app.requires.push.apply(app.requires,[
    'model.store_product',
    'share.ui',
    'share.offline_db_util'
]);
app.controller('app.productApp.controller',
[
    '$scope',
    '$rootScope',
    '$q',
    '$window',
    'model.store_product.rest_search',
    'share.ui.alert',
    'share.ui.confirm',
    'model.store_product.sku_not_found_handler',
    'share.offline_db_util',
    'model.store_product.search.online.infinite_scroll_handler',
function(
    $scope,
    $rootScope,
    $q,
    $window,
    sp_rest_search,
    alert_service,
    confirm_service,
    sku_not_found_handler,
    offline_db_util,
    search_online_infinite_scroll_handler
){
    var un_subscribe_group = $rootScope.$on('model.group.manage',function(event,data){
        _refresh_current_sp_lst();
    })
    $scope.$on('$destroy',un_subscribe_group);

    function launch_pos_url(){
        $window.open('sale/index_angular/');
    }
    $scope.launch_pos = function(){
        offline_db_util.is_exist().then(
             function(db_exitance){
                if(db_exitance){
                    confirm_service('launch sale app?').then(function(){
                        launch_pos_url();
                    });                        
                }else{
                    confirm_service('first time download database. continue?').then(function(){
                        launch_pos_url();
                    });
                }
            }
            ,function(reason){
                alert_service(reason)
            }
        )
    }

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
        $scope.sp_lst = [];        
        $scope.name_search_str = '';
        $scope.sku_search_str = '';             
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

    $scope.name_search = function(){
        //clear out search form
        $scope.sku_search_str = "";
        $scope.local_filter = "";
        $scope.infinite_scroll_reach_the_end = false;
        $scope.name_search_str = $scope.name_search_str.trim();
        $scope.sp_lst = [];

        if($scope.name_search_str.length === 0){
            return;
        }
 
        sp_rest_search.by_name($scope.name_search_str,0/*after*/).then(
            function(data){
                $scope.sp_lst = data;

                if(data.length === 0){
                    alert_service('no result found for ' + '"' + $scope.name_search_str + '"','info','blue');
                }else{
                    $scope.is_blur_infinite_scroll_triggerer_textbox = true;
                }
                
            }
            ,function(reason){ 
                alert_service(reason); 
            }
        )
    }

    $scope.infinite_scroll_handler = function(){
        if($scope.name_search_str.length === 0){
            //infinite scroll only apply for name search. because sku search does not have 'after' limit. Thus, when name_serch_str is empty, infinite_scroll_handler will do nothing
            return;
        }
        search_online_infinite_scroll_handler($scope,$scope.name_search_str,true/*is_name_only_or_name_sku*/,$scope.sp_lst);
    }

    //SORT
    $scope.cur_sort_column = 'name';
    $scope.cur_sort_desc = false;        

    $scope.infinite_scroll_reach_the_end = false; //WHY DO WE NEED THIS VAR? read the story inside search_online_infinite_scroll_handler()
    $scope.is_blur_infinite_scroll_triggerer_textbox = false;   

    $scope.sp_lst = [];        
    $scope.name_search_str = '';
    $scope.sku_search_str = '';

}]);