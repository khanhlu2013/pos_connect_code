var mod = angular.module('model.group');
mod.requires.push.apply(mod.requires,[
    'share.ui',
    'share.util.offline_db'
]);

mod.controller('model.group.execute.controller',
[
    '$scope',
    '$modalInstance',


    '$http',
    'share.ui.alert',
    'model.group.Group',
    'model.group.rest',
    'share.util.offline_db.download_product',    
    'group',
function(
    $scope,
    $modalInstance,
    $http,
    alert_service,
    Group,
    group_rest,
    download_product,
    group    
){
    $scope.group = group;
    $scope.option = {};

    $scope.checkbox_click = function(field_name){
        var enable_field_name = 'enable_' + field_name;
        var is_enable = $scope[enable_field_name];
        // if(is_enable === undefined){ is_enable = false; }
        // is_enable = !is_enable;//when this click handler is call, this enable field is not yet update. it is only update when this click handler is executed

        if(is_enable === false){
            delete $scope.option[field_name];
        }else{
            //we are enabling, we need to init value
            if(field_name === 'is_taxable' || field_name === 'is_sale_report'){
                $scope.option[field_name] = false;
            }else if(field_name === 'price'){
                //price does not allow null value. we do nothing
            }else{
                $scope.option[field_name] = null;
            }
        }
    }
    $scope.is_option_empty = function(){
        for(key in $scope.option){
            if($scope.option.hasOwnProperty(key)){
                return false;
            }
        }
        return true;
    }
    $scope.ok = function(){
        group_rest.execute_item($scope.group.id,$scope.option).then(
            function(group_response_data){
                download_product(false/*is_force*/).then(
                    function(){
                        $scope.group = Group.build(group_response_data);
                        alert_service('execute is complete successfully','info','green');
                        $scope.option = {};
                        $scope.enable_price = false;
                        $scope.enable_crv = false;
                        $scope.enable_is_taxable = false;
                        $scope.enable_cost = false;
                        $scope.enable_is_sale_report = false;
                        $scope.enable_p_tag = false;
                        $scope.enable_p_tag = false;
                        $scope.enable_vendor = false;
                        $scope.enable_buydown = false;
                        $scope.enable_value_customer_price = false;
                    }
                    ,function(reason){
                        alert_service(reason);
                    }
                )
            }
            ,function(reason){
                alert_service(reason);
            }
        )
    }
    $scope.exit = function(){ 
        $modalInstance.dismiss('_cancel_');
    }
}]);
