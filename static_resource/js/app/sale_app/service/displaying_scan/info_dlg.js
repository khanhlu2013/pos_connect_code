define(
[
     'angular'
    //-------
    ,'filter/filter'
]
,function
(
    angular
)
{
    var mod = angular.module('sale_app/service/displaying_scan/info_dlg',['filter']);
    mod.factory('sale_app/service/displaying_scan/info_dlg',['$modal',function($modal){
        return function(ds){
            var template = 
                '<div class="modal-header"><h3>{{ds.store_product.name}}</h3></div>' +
                '<div class="modal-body">' +

                    '<div class="form-horizontal">' +
                        '<div class="form-group">' +
                            '<label class="col-sm-5 control-label">regular price:</label>' +
                            '<p class="col-sm-7 form-control-static">{{ds.store_product.price|currency}}</p>' +
                        '</div>' +

                        //override price
                        '<div ng-hide="ds.override_price==null" class="form-group">' +
                            '<label class="col-sm-5 control-label">override price:</label>' +
                            '<p class="col-sm-7 form-control-static">{{ds.override_price|currency}}</p>' +                            
                        '</div>' +

                        //mix match deal discount
                        '<div ng-hide="ds.mm_deal_info==null" class="form-group">' +
                            '<label class="col-sm-5 control-label">{{ds.mm_deal_info.mm_deal.name}} (discount):</label>' +
                            '<p class="col-sm-7 form-control-static">{{ds.mm_deal_info.get_unit_discount(GLOBAL_SETTING.tax_rate)|currency}}</p>' +  
                        '</div>' +

                        //total discount price
                        '<div ng-hide="ds.mm_deal_info==null" class="form-group">' +
                            '<label class="col-sm-5 control-label">total discount price:</label>' +
                            '<p class="col-sm-7 form-control-static"><u>{{ds.get_total_discount_price(GLOBAL_SETTING.tax_rate)|currency}}</u></p>' +  
                        '</div>' +

                        //crv
                        '<div class="form-group">' +
                            '<label class="col-sm-5 control-label">crv:</label>' +
                            '<p class="col-sm-7 form-control-static">{{ds.store_product.get_crv()|currency|not_show_zero}}</p>' +  
                        '</div>' +

                        //buydown
                        '<div ng-hide="!ds.store_product.get_buydown()" class="form-group">' +
                            '<label class="col-sm-5 control-label">buydown:</label>' +
                            '<p class="col-sm-7 form-control-static">{{ds.store_product.get_buydown()|currency|not_show_zero}}</p>' +  
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
                    '<button ng-click="exit()" class="btn btn-warning">exit</button>' +
                '</div>'                
            ;

            var controller = function($scope,$modalInstance,$filter,ds){
                $scope.ds = ds;
                $scope.exit = function(){
                    $modalInstance.dismiss('_cancel_');
                }
            }
            var dlg = $modal.open({
                template:template,
                controller:controller,
                size:'md',
                resolve:{ ds : function(){return ds}}
            })
            return dlg.result;
        }
    }])
})