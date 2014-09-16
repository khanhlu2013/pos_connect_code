define(
[
     'angular'
    //-------
    ,'filter/filter'
    ,'service/ui'
]
,function
(
    angular
)
{
    var mod = angular.module('sale_app/service/sale_able_info_dlg',
    [
         'filter'
        ,'service/ui'
    ]);
    mod.factory('sale_app/service/sale_able_info_dlg',
    [
         '$modal'
        ,'service/ui/prompt'
    ,function(
         $modal
        ,prompt_service
    ){
        return function(ds_original,is_enable_override_price){
            var template = 
                '<div id="sale_app/service/sale_able_info_dlg" class="modal-header"><h3>{{ds.get_name()}}</h3></div>' +
                '<div class="modal-body">' +

                    '<div class="form-horizontal">' +
                        '<div class="form-group">' +
                            '<label class="col-sm-5 control-label">regular price:</label>' +
                            '<p id="sale_app/service/sale_able_info_dlg/preset_price" class="col-sm-7 form-control-static">{{ds.get_preset_price()|currency}}</p>' +
                        '</div>' +

                        //override price
                        '<div class="form-group">' +
                            '<label class="col-sm-5 control-label">override price:</label>' +
                            '<p id="sale_app/service/sale_able_info_dlg/override_price" class="col-sm-7 form-control-static">{{ds.get_override_price() ? (ds.get_override_price()|currency) : \'None\'}} ' + 
                                '<button ng-show="is_enable_override_price" id="sale_app/service/sale_able_info_dlg/override_price_btn" ng-click="override_price()" class="btn btn-primary glyphicon glyphicon-pencil"></button>' +
                                '<button ng-hide="ds.get_override_price()===null || !is_enable_override_price" id="sale_app/service/sale_able_info_dlg/remove_override_price_btn" ng-click="remove_override_price()" class="btn btn-danger glyphicon glyphicon-trash"></button>' +
                            '</p>' +                            
                        '</div>' +

                        //mix match deal discount
                        '<div ng-hide="ds.get_mm_deal_info()===null" class="form-group">' +
                            '<label id="sale_app/service/sale_able_info_dlg/mm_deal_name" class="col-sm-5 control-label">{{ds.get_mm_deal_info().get_name()}} (discount):</label>' +
                            '<p id="sale_app/service/sale_able_info_dlg/mm_deal_unit_discount" class="col-sm-7 form-control-static">{{ds.get_mm_deal_info().get_unit_discount()|currency}}</p>' +  
                        '</div>' +

                        //buydown
                        '<div ng-hide="ds.get_buydown()===null" class="form-group">' +
                            '<label class="col-sm-5 control-label">buydown (discount):</label>' +
                            '<p id="sale_app/service/sale_able_info_dlg/buydown" class="col-sm-7 form-control-static">{{ds.get_buydown()|currency|not_show_zero}}</p>' +  
                        '</div>' +

                        //advertise price
                        '<div class="form-group">' +
                            '<label class="col-sm-5 control-label">total discount price:</label>' +
                            '<p id="sale_app/service/sale_able_info_dlg/advertise_price" class="col-sm-7 form-control-static"><mark>{{ds.get_advertise_price()|currency}}</mark></p>' +  
                        '</div>' +

                        //crv
                        '<div class="form-group">' +
                            '<label class="col-sm-5 control-label">crv:</label>' +
                            '<p id="sale_app/service/sale_able_info_dlg/crv" class="col-sm-7 form-control-static">{{ds.get_crv()|currency|not_show_zero}}</p>' +  
                        '</div>' +

                        //buydown tax
                        '<div ng-hide="ds.get_buydown()===null" class="form-group">' +
                            '<label class="col-sm-5 control-label">buydown tax:</label>' +
                            '<p id="sale_app/service/sale_able_info_dlg/buydown_tax" class="col-sm-7 form-control-static">{{ds.get_buydown_tax(GLOBAL_SETTING.tax_rate)|currency|not_show_zero}}</p>' +  
                        '</div>' +

                        //tax
                        '<div class="form-group">' +
                            '<label class="col-sm-5 control-label">tax ({{tax_rate}}%) :</label>' +
                            '<p id="sale_app/service/sale_able_info_dlg/tax" class="col-sm-7 form-control-static">{{ds.get_product_tax(GLOBAL_SETTING.tax_rate)|currency|not_show_zero}}</p>' +  
                        '</div>' +

                        //out the door
                        '<div class="form-group">' +
                            '<label class="col-sm-5 control-label">out the door $:</label>' +
                            '<p id="sale_app/service/sale_able_info_dlg/otd_price" class="col-sm-7 form-control-static">{{ds.get_otd_price(GLOBAL_SETTING.tax_rate)|currency}}</p>' +  
                        '</div>' +                 
                    '</div>' +

                '</div>' +
                '<div class="modal-footer">' +
                    '<button id= "sale_app/service/sale_able_info_dlg/cancel_btn" ng-click="cancel()" class="btn btn-warning">cancel</button>' +
                    '<button ng-disabled="is_unchange()" ng-click="reset()" class="btn btn-primary">reset</button>' +
                    '<button id="sale_app/service/sale_able_info_dlg/ok_btn" ng-disabled="is_unchange()" ng-click="ok()" class="btn btn-success">ok</button>' +
                '</div>'
            ;

            var controller = function($scope,$modalInstance,$filter,$rootScope,ds_original,is_enable_override_price){
                $scope.ds = angular.copy(ds_original);
                $scope.tax_rate = $rootScope.GLOBAL_SETTING.tax_rate;
                $scope.is_enable_override_price = is_enable_override_price;

                $scope.remove_override_price = function(){
                    $scope.ds.override_price = null;
                }
                $scope.override_price = function(){
                    prompt_service('one time override price',$scope.ds.override_price/*prefill*/,true/*is_null_allow*/,true/*is_float*/)
                    .then(function(override_price){
                        $scope.ds.override_price = override_price;
                    })
                }
                $scope.reset = function(){
                    angular.copy(ds_original,$scope.ds);
                }
                $scope.is_unchange = function(){
                    return angular.equals(ds_original,$scope.ds);
                }
                $scope.ok = function(){
                    $modalInstance.close($scope.ds);
                }
                $scope.cancel = function(){
                    $modalInstance.dismiss('_cancel_');
                }
            }
            var dlg = $modal.open({
                template:template,
                controller:controller,
                size:'md',
                resolve:{ 
                     ds_original : function(){ return ds_original }
                    ,is_enable_override_price : function(){ return is_enable_override_price }
                }
            })
            return dlg.result;
        }
    }])
})