define(
[
    'angular'
    //------
    ,'model/sp/model'
    ,'directive/share_directive'
]
,function
(
    angular
)
{
    var mod = angular.module('sp/service/non_inventory_prompt',
    [
         'sp/model'
        ,'directive/share_directive'
    ]);
    mod.factory('sp/service/non_inventory_prompt',
    [
         '$modal'
        ,'sp/model/Non_inventory'
    ,function(
         $modal
        ,Non_inventory
    ){
        return function(original_non_inventory){
            var template_name = 
                '<div class="form-group">' +
                    '<label class="col-sm-4 control-label" >Name:</label>' +
                    '<div class="col-sm-8">' +
                        '<input id="sp_app/service/non_inventory_prompt/name_txt" name="product_name" ng-model="$parent.ni.name" type="text" required>' +
                        '<label class="error" ng-show="form.product_name.$error.required">require</label>' +
                    '</div>' +
                '</div>' 
            ;        
            var template_price =
                '<div class="form-group">' +
                    '<label class="col-sm-4 control-label">Price:</label>' +
                    '<div class="col-sm-8">' +
                        '<input id="sp_app/service/non_inventory_prompt/price_txt" focus-me="true" name="price" ng-model="$parent.ni.price" type="number" required>' +
                        '<label class="error" ng-show="form.price.$invalid">require</label>' +
                    '</div>' +
                '</div>'
            ;     
            var template_crv = 
                '<div class="form-group">' +
                    '<label class="col-sm-4 control-label">Crv:</label>' +
                    '<div class="col-sm-8">' +
                        '<input id="sp_app/service/non_inventory_prompt/crv_txt" name="crv" ng-model="$parent.ni.crv" type="number">' +
                        '<label class="error" ng-show="form.crv.$invalid">invalid input</label>' +
                    '</div>' +
                '</div>'
            ;
            var template_taxable = 
                '<div class="form-group">' +
                    '<label class="col-sm-4 control-label">Taxable:</label>' +
                    '<div class="col-sm-8">' +
                        '<input id="sp_app/service/non_inventory_prompt/is_taxable_check" ng-model="$parent.ni.is_taxable" type="checkbox">' +
                    '</div>' +
                '</div>'
            ;
            var template_cost =
                '<div class="form-group">' +
                    '<label class="col-sm-4 control-label">Cost:</label>' +
                    '<div class="col-sm-8">' +
                        '<input id="sp_app/service/non_inventory_prompt/cost_txt" name="cost" ng-model="$parent.ni.cost" type="number"}}"">' +
                        '<label class="error" ng-show="form.cost.$invalid">invalid number</label>' +
                    '</div>' +
                '</div>'
            ;                                                          
            var template =
                '<form name="form" novalidate role="form">' +
                    '<div id="sp_app/service/non_inventory_prompt/self" class="modal-header"><h3>none inventory {{get_otd_price()|currency}}</h3></div>'+
                    '<div class="modal-body">' +
                        '<div class="form-horizontal" >' +
                            template_name +
                            template_price +
                            template_crv +
                            template_taxable +
                            template_cost +                            
                        '</div>' + /* end form horizontal*/
                    '</div>'+
                    '<div class="modal-footer">' +
                        '<button id="sp_app/service/non_inventory_prompt/cancel_btn" ng-click="cancel()" class="btn btn-warning" type="button">cancel</button>' +
                        '<button id="sp_app/service/non_inventory_prompt/reset_btn" ng-click="reset()" class="btn btn-primary" type="button">reset</button>' +                        
                        '<button id="sp_app/service/non_inventory_prompt/ok_btn" ng-click="ok()" ng-disabled="form.$invalid || is_unchange()" class="btn btn-success" type="submit">ok</button>' +
                    '</div>' +
                '</form>'
            ;
            var ModalCtrl = function($scope,$modalInstance,$rootScope,original_non_inventory){
                if(original_non_inventory === null){
                    $scope.ni = new Non_inventory(
                         'none inventory'//name
                        ,null//price
                        ,false//is_taxable
                        ,null//crv
                        ,null//cost
                    )                    
                }else{
                    $scope.ni = angular.copy(original_non_inventory);
                }
                $scope.is_unchange = function(){
                    return angular.equals($scope.ni,original_non_inventory);                    
                }
                $scope.reset = function(){
                    $scope.ni = angular.copy(original_non_inventory)
                }
                $scope.get_otd_price = function(){
                    return $scope.ni.get_otd_price($rootScope.GLOBAL_SETTING.tax_rate);
                }
                $scope.cancel = function(){
                    $modalInstance.dismiss('_cancel_');
                }
                $scope.ok = function(){
                    $modalInstance.close($scope.ni)
                }
            }
            ModalCtrl.$inject = ['$scope','$modalInstance','$rootScope','original_non_inventory'];
            var dlg = $modal.open({
                 template:template
                ,controller:ModalCtrl
                ,backdrop:'static'
                ,size:'lg'
                ,resolve: {original_non_inventory:function(){return original_non_inventory}}

            })
            return dlg.result;
        }
    }])
})