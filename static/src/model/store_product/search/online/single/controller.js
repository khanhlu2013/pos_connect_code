var mod = angular.module('model.store_product');
mod.requires.push.apply(mod.requires,[
    'share.ui'
]);
mod.controller('model.store_product.search.online.single.controller',
[
    '$scope',
    '$modalInstance',
    '$http',
    'model.store_product.rest_search',
    'share.ui.alert',    
    'model.store_product.search.online.infinite_scroll_handler',
function(
    $scope,
    $modalInstance,
    $http,
    rest_search_service,
    alert_service,
    search_online_infinite_scroll_handler    
){
    $scope.message = "";
    $scope.sp_lst = "";
    $scope.infinite_scroll_reach_the_end = false;
    $scope.search_str = '';
    $scope.is_blur_infinite_scroll_triggerer_textbox = false;

    $scope.select = function(sp){
        $modalInstance.close(sp);
    }
    $scope.cancel = function(){
        $modalInstance.dismiss('_cancel_');
    }            
    $scope.search = function(search_by){
        $scope.search_str = $scope.search_str.trim();
        
        if($scope.search_str.length === 0){
            $scope.sp_lst = [];
            $scope.message = "";                    
            return;
        }
        var after = 0;
        $scope.infinite_scroll_reach_the_end = false;
        rest_search_service.by_name_sku($scope.search_str,after).then(
            function(result_lst){
                $scope.sp_lst = result_lst;
                if($scope.sp_lst.length == 0){ 
                    $scope.message = "no result for " + "'" + $scope.search_str + "'";
                }else{ 
                    $scope.message = ""; 
                    $scope.is_blur_infinite_scroll_triggerer_textbox = true;
                }
            },function(reason){
                $scope.message = reason; 
            }
        )

    }
    $scope.infinite_scroll_handler = function(){
        if($scope.search_str === ''){
            return;//somehow infinite-scroll-handler is trigger on first load. This is how i ignore falsy infinite-scroll trigger.
        }
        search_online_infinite_scroll_handler($scope,$scope.search_str,false/*is_name_only_or_name_sku*/,$scope.sp_lst);
    }    
}]);