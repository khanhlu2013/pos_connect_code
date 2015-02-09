var mod = angular.module('model.group');
mod.requires.push.apply(mod.requires,[
    'share.ui',
    'share.util.offline_db'
]);

mod.factory('model.group.execute',
[
    '$modal',
    'model.group.rest',
function(
    $modal,
    group_rest
){
    return function(group_id){

        var template_price =
            '<div class="form-group">' +
                '<label class="col-sm-5 control-label">Price:</label>' +   
                '<div class="col-sm-7">' +
                    '<input id="group_app/service/execute/enable_price_check" ng-click="checkbox_click(\'price\')" ng-model="enable_price" type="checkbox"></input>' +                
                    '<input id="group_app/service/execute/price_txt" ng-disabled="!enable_price" ng-required="enable_price" ng-model="option.price" name="price" type="number" min="0.01">' +
                    '<label ng-show="form.price.$error.required && !form.price.$error.number && !form.price.$error.min" class="error">required</label>' +                        
                    '<label ng-show="form.price.$error.number" class="error">invalid number</label>' +
                    '<label ng-show="form.price.$error.min" class="error">minimum error</label>' +
                '</div>' +
            '</div>'
        ;

        var template_crv =
            '<div class="form-group">' +
                '<label class="col-sm-5 control-label">Crv:</label>' +
                '<div class="col-sm-7">' +
                    '<input id="group_app/service/execute/enable_crv_check" ng-click="checkbox_click(\'crv\')" ng-model="enable_crv" type="checkbox"></input>' +
                    '<input id="group_app/service/execute/crv_txt" ng-disabled="!enable_crv" ng-model="option.crv" name="crv" type="number" min="0.01">' +
                    '<label ng-show="form.crv.$error.number" class="error">invalid number</label>' +
                    '<label ng-show="form.crv.$error.min" class="error">minimum error</label>' +
                '</div>' +
            '</div>'
        ; 

        var template_is_taxable =
            '<div class="form-group">' +
                '<label class="col-sm-5 control-label">Tax:</label>' +
                '<div class="col-sm-7">' +
                    '<input id="group_app/service/execute/enable_is_taxable_check" ng-click="checkbox_click(\'is_taxable\')" ng-model="enable_is_taxable" type="checkbox"></input>' +
                    '<input id="group_app/service/execute/is_taxable_check" ng-disabled="!enable_is_taxable" ng-model="option.is_taxable" name="is_taxable" type="checkbox">' +
                '</div>' +
            '</div>'
        ; 

        var template_cost =
            '<div class="form-group">' +
                '<label class="col-sm-5 control-label">Cost:</label>' +
                '<div class="col-sm-7">' +
                    '<input id="group_app/service/execute/enable_cost_check" ng-click="checkbox_click(\'cost\')" ng-model="enable_cost" type="checkbox"></input>' +
                    '<input id="group_app/service/execute/cost_txt" ng-disabled="!enable_cost" ng-model="option.cost" name="cost" type="number" min="0.01">' +
                    '<label ng-show="form.cost.$error.number" class="error">invalid number</label>' +
                    '<label ng-show="form.cost.$error.min" class="error">minimum error</label>' +
                '</div>' +
            '</div>'
        ; 

        var template_is_sale_report =
            '<div class="form-group">' +
                '<label class="col-sm-5 control-label">sale report:</label>' +
                '<div class="col-sm-7">' +
                    '<input id="group_app/service/execute/enable_is_sale_report_check" ng-click="checkbox_click(\'is_sale_report\')" ng-model="enable_is_sale_report" type="checkbox"></input>' +
                    '<input id="group_app/service/execute/is_sale_report_check" ng-disabled="!enable_is_sale_report" ng-model="option.is_sale_report" name="is_sale_report" type="checkbox">' +
                '</div>' +
            '</div>'
        ; 

        var template_p_type =
            '<div class="form-group">' +
                '<label class="col-sm-5 control-label">Type:</label>' +
                '<div class="col-sm-7">' +
                    '<input id="group_app/service/execute/enable_p_type_check" ng-click="checkbox_click(\'p_type\')" ng-model="enable_p_type" type="checkbox"></input>' +
                    '<input id="group_app/service/execute/p_type_txt" ng-disabled="!enable_p_type" ng-model="option.p_type" name="p_type" type="text">' +
                '</div>' +
            '</div>'
        ; 

        var template_p_tag =
            '<div class="form-group">' +
                '<label class="col-sm-5 control-label">Tag:</label>' +
                '<div class="col-sm-7">' +
                    '<input id="group_app/service/execute/enable_p_tag_check" ng-click="checkbox_click(\'p_tag\')" ng-model="enable_p_tag" type="checkbox"></input>' +
                    '<input id="group_app/service/execute/p_tag_txt" ng-disabled="!enable_p_tag" ng-model="option.p_tag" name="p_tag" type="text">' +
                '</div>' +
            '</div>'
        ; 
        var template_vendor =
            '<div class="form-group">' +
                '<label class="col-sm-5 control-label">Vendor:</label>' +
                '<div class="col-sm-7">' +
                    '<input id="group_app/service/execute/enable_vendor_check" ng-click="checkbox_click(\'vendor\')" ng-model="enable_vendor" type="checkbox"></input>' +
                    '<input id="group_app/service/execute/vendor_txt" ng-disabled="!enable_vendor" ng-model="option.vendor" name="vendor" type="text">' +
                '</div>' +
            '</div>'
        ; 
        var template_buydown =
            '<div class="form-group">' +
                '<label class="col-sm-5 control-label">Buydown:</label>' +
                '<div class="col-sm-7">' +
                    '<input id="group_app/service/execute/enable_buydown_check" ng-click="checkbox_click(\'buydown\')" ng-model="enable_buydown" type="checkbox"></input>' +
                    '<input id="group_app/service/execute/buydown_txt" ng-disabled="!enable_buydown" ng-model="option.buydown" name="buydown" type="number" min="0.01">' +
                    '<label ng-show="form.buydown.$error.number" class="error">invalid number</label>' +
                    '<label ng-show="form.buydown.$error.min" class="error">minimum error</label>' +
                '</div>' +
            '</div>'
        ; 

        var template_value_customer_price =
            '<div class="form-group">' +
                '<label class="col-sm-5 control-label">value_cus_price:</label>' +
                '<div class="col-sm-7">' +
                    '<input id="group_app/service/execute/enable_value_customer_price_check" ng-click="checkbox_click(\'value_customer_price\')" ng-model="enable_value_customer_price" type="checkbox"></input>' +
                    '<input id="group_app/service/execute/value_customer_price_txt" ng-disabled="!enable_value_customer_price" ng-model="option.value_customer_price" name="value_customer_price" type="number" min="0.01">' +
                    '<label ng-show="form.value_customer_price.$error.number" class="error">invalid number</label>' +
                    '<label ng-show="form.value_customer_price.$error.min" class="error">minimum error</label>' +
                '</div>' +
            '</div>'
        ;             
        var edit_form_template =
            '<form name="form" novalidate role="form">' +
                '<div class="form-horizontal" >' +
                    template_price +
                    template_crv +
                    template_is_taxable +
                    template_cost +
                    template_is_sale_report +
                    template_p_type +                        
                    template_p_tag +
                    template_vendor +
                    template_buydown +
                    template_value_customer_price +
                '</div>' + /* end form horizontal*/
            '</form>' /* end modal body*/  
        ;
        var template = 
            '<div class="modal-header"><h3>{{group.name}} - execute</h3></div>' +
            
            '<div class="modal-body">' +
                '<div ng-hide="group.sp_lst.length === 0">' +
                    '<div class="col-sm-5">' + 
                        edit_form_template +     
                        '<div ng-hide="is_option_empty()">' +
                            '<hr>' +                   
                            '<h3>actions</h3>' +
                            '<ul>' +
                                '<li ng-show="value!== undefined" ng-repeat="(key,value) in option">{{key}} : <span ng-class="value===null?\'error\':\'\'">{{value !== null ? value : \'empty\'}}</span></li>' +
                            '</ul>' +
                        '</div>' +                            
                    '</div>' +
                    '<div class="col-sm-7">' + 
                        '<table class="table table-hover table-bordered table-condensed table-striped">' +
                            '<tr>' +
                                '<th>product</th>' +
                                '<th>price</th>' +
                                '<th>crv</th>' +
                                '<th>tax</th>' +
                                '<th>cost</th>' +
                            '</tr>' +

                            '<tr ng-repeat="sp in group.sp_lst">' +
                                '<td>{{sp.name}}</td>' +
                                '<td>{{sp.price|currency}}</td>' +
                                '<td>{{sp.crv|currency}}</td>' +
                                '<td class="alncenter"><span class="glyphicon" ng-class="sp.is_taxable? \'glyphicon-check\' : \'glyphicon-unchecked\'"></span></td>' +
                                '<td>{{sp.cost|currency}}</td>' +
                            '</tr>' +
                        '</table>' +
                    '</div>' +                        
                    '<div class="clear"></div>' +
                '</div>' +
                '<pre id="group_app/service/execute/empty_group_warning_lbl" ng-show="group.sp_lst.length === 0" class="error">there is no product in this group</pre>' +              
            '</div>' +

            '<div class="modal-footer">' + 
                '<button id="group_app/service/execute/ok_btn" ng-disabled="is_option_empty() || form.$invalid" ng-click="ok() || group.sp_lst.length === 0" class="btn btn-success">ok</button>' +
                '<button id="group_app/service/execute/exit_btn" ng-click="exit()" class="btn btn-warning">exit</button>' +
            '</div>'
        ;
        
        var result = $modal.open({
             template:template
            ,controller:'model.group.execute.modalCtrl'
            ,size:'lg'
            ,resolve:{
                group : function(){
                    return group_rest.get_item(group_id);
                }
            }
        });
        return result;
    }
}]);

mod.controller('model.group.execute.modalCtrl',
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
        if(is_enable === undefined){ is_enable = false; }
        is_enable = !is_enable;//when this click handler is call, this enable field is not yet update. it is only update when this click handler is executed

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
