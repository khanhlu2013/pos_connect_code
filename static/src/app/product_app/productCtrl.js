var app = angular.module('app.productApp');
app.requires.push.apply(app.requires,[
    'model.store_product',
    'share.ui'
])

app.controller('app.productApp.productCtrl',
[
    '$scope',
    'model.store_product.rest',
    'share.ui.alert',
function(
    $scope,
    store_product_rest,
    alert_service
){
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
        store_product_rest.by_name($scope.name_search_str,after).then(
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
                }else{
                    $scope.is_blur_name_search_text_box = true;
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
    $scope.is_blur_name_search_text_box = false;
    $scope.name_search_busy = false; 
}])