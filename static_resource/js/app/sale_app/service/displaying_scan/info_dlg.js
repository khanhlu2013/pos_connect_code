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
    var mod = angular.module('sale_app/service/displaying_scan/info_dlg',
    [
         'filter'
        ,'service/ui'
    ]);
    mod.factory('sale_app/service/displaying_scan/info_dlg',
    [
         '$modal'
        ,'service/ui/prompt'
    ,function(
         $modal
        ,prompt_service
    ){
        return function(ds_original){
            var template = 
                '<div class="modal-header"><h3>{{ds.store_product.name}}</h3></div>' +
                '<div class="modal-body">' +

                    '<div class="form-horizontal">' +
                        '<div class="form-group">' +
                            '<label class="col-sm-5 control-label">regular price:</label>' +
                            '<p class="col-sm-7 form-control-static">{{ds.store_product.price|currency}}</p>' +
                        '</div>' +

                        //override price
                        '<div class="form-group">' +
                            '<label class="col-sm-5 control-label">override price:</label>' +
                            '<p class="col-sm-7 form-control-static">{{ds.override_price ? (ds.override_price|currency) : \'None\'}} ' + 
                                '<button id="sale_app/service/displaying_scan/info_dlg/override_price_btn" ng-click="override_price()" class="btn btn-primary">override</button>' +
                            '</p>' +                            
                        '</div>' +

                        //mix match deal discount
                        '<div ng-hide="ds.mm_deal_info==null" class="form-group">' +
                            '<label class="col-sm-5 control-label">{{ds.mm_deal_info.mm_deal.name}} (discount):</label>' +
                            '<p class="col-sm-7 form-control-static">{{ds.mm_deal_info.get_unit_discount(GLOBAL_SETTING.tax_rate)|currency}}</p>' +  
                        '</div>' +

                        //buydown
                        '<div ng-hide="!ds.store_product.get_buydown()" class="form-group">' +
                            '<label class="col-sm-5 control-label">buydown (discount):</label>' +
                            '<p class="col-sm-7 form-control-static">{{ds.store_product.get_buydown()|currency|not_show_zero}}</p>' +  
                        '</div>' +

                        //total discount price
                        '<div class="form-group">' +
                            '<label class="col-sm-5 control-label">total discount price:</label>' +
                            '<p class="col-sm-7 form-control-static"><mark>{{ds.get_total_discount_price(GLOBAL_SETTING.tax_rate)|currency}}</mark></p>' +  
                        '</div>' +

                        //crv
                        '<div class="form-group">' +
                            '<label class="col-sm-5 control-label">crv:</label>' +
                            '<p class="col-sm-7 form-control-static">{{ds.store_product.get_crv()|currency|not_show_zero}}</p>' +  
                        '</div>' +

                        //buydown tax
                        '<div ng-hide="!ds.store_product.get_buydown()" class="form-group">' +
                            '<label class="col-sm-5 control-label">buydown tax:</label>' +
                            '<p class="col-sm-7 form-control-static">{{ds.get_buydown_tax(GLOBAL_SETTING.tax_rate)|currency|not_show_zero}}</p>' +  
                        '</div>' +

                        //tax
                        '<div class="form-group">' +
                            '<label class="col-sm-5 control-label">tax:</label>' +
                            '<p class="col-sm-7 form-control-static">{{ds.get_tax(GLOBAL_SETTING.tax_rate)|currency|not_show_zero}}</p>' +  
                        '</div>' +

                        //out the door
                        '<div class="form-group">' +
                            '<label class="col-sm-5 control-label">out the door $:</label>' +
                            '<p class="col-sm-7 form-control-static">{{ds.get_otd_wt_price(GLOBAL_SETTING.tax_rate)|currency}}</p>' +  
                        '</div>' +                    
                    '</div>' +

                '</div>' +
                '<div class="modal-footer">' +
                    '<button ng-click="cancel()" class="btn btn-warning">cancel</button>' +
                    '<button ng-disabled="is_unchange()" ng-click="reset()" class="btn btn-primary">reset</button>' +
                    '<button id="sale_app/service/displaying_scan/info_dlg/ok_btn" ng-disabled="is_unchange()" ng-click="ok()" class="btn btn-success">ok</button>' +
                '</div>'
            ;

            var controller = function($scope,$modalInstance,$filter,ds_original){
                $scope.ds = angular.copy(ds_original);

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
                resolve:{ ds_original : function(){return ds_original}}
            })
            return dlg.result;
        }
    }])
})