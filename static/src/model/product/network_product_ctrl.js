var mod = angular.module('model.product');

mod.controller('model.product.network_product_controller',
[
    '$scope'
,function(
    $scope
){
    function _is_display_sale_data(network_product){
        var result = false;

        if(network_product.sp_lst.length!==0){
            result = network_product.sp_lst[0].sale !== undefined;
        }

        return result;
    }

    $scope.init = function(network_product){
        $scope.network_product = network_product;
        $scope.network_product_summary_lbl_class = 'col-xs-4 control-label';
        $scope.network_product_summary_value_class = 'col-xs-8 form-control-static';   
        $scope.suggest_extra_crv = $scope.network_product.get_suggest_extra('crv');
        $scope.suggest_extra_name = $scope.network_product.get_suggest_extra('name');
        $scope.is_sale_data = _is_display_sale_data(network_product);
        
        //SORT
        $scope.cur_sort_column = 'get_cost()';
        $scope.cur_sort_desc = false;
        $scope.column_click = function(column_name){
            if($scope.cur_sort_column == column_name){
                $scope.cur_sort_desc = !$scope.cur_sort_desc;
            }else{
                $scope.cur_sort_column = column_name;
                $scope.cur_sort_desc = false;
            }
        }
        $scope.get_sort_class = function(column_name){
            if(column_name == $scope.cur_sort_column){
                return "glyphicon glyphicon-arrow-" + ($scope.cur_sort_desc ? 'down' : 'up');
            }else{
                return '';
            }
        }             
    }

    $scope.$on('network_product_is_updated',function(event,network_product){
        /*
            there are 2 way network_product_ctrl is used: sp->info->network_info and sku_not_found_handler. In the former case, we dont want to get network_info everytime we are
            viewing sp.info. so we make it lazy with a button to ajax get network product so we need hook to update network product for this controller.
        */        
        $scope.init(network_product);
    })
}]);