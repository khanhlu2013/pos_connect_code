var mod = angular.module('model.store_product');
mod.requires.push.apply(mod.requires,[
    'share.util'
])
mod.controller('model.store_product.search.online.multiple.controller',
[
    '$scope',
    '$modalInstance',
    'model.store_product.rest_search',
    'share.util.misc',    
    'model.store_product.search.online.infinite_scroll_handler',
function(
    $scope,
    $modalInstance,
    rest_search_service,
    misc_util,
    search_online_infinite_scroll_handler    
){
    $scope.message = "";
    $scope.sp_lst = "";
    $scope.result_sp_lst = [];
    $scope.infinite_scroll_reach_the_end = false;
    $scope.is_blur_infinite_scroll_triggerer_textbox = false;
    $scope.search_str = '';

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
        $scope.search_str = $scope.search_str.trim();

        if($scope.search_str.length == 0){
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
    $scope.cancel = function(){
        $modalInstance.dismiss('_cancel_');
    }

    $scope.infinite_scroll_handler = function(){
        if($scope.search_str === ''){
            return;//somehow infinite-scroll-handler is trigger on first load. This is how i ignore falsy infinite-scroll trigger.
        }
        search_online_infinite_scroll_handler($scope,$scope.search_str,false/*is_name_only_or_name_sku*/,$scope.sp_lst);
    }
}])