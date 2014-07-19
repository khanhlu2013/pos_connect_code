define(
[
    'angular'
]
,function
(
    angular
)
{
    var mod = angular.module('sp_app.service.prompt',[]);
    mod.factory('sp_app.service.prompt',['$modal', function($modal){
        var template_name = 
            '<div class="form-group">' +
                '<label class="col-sm-4 control-label" >Name:</label>' +
                '<div class="col-sm-8">' +
                    '<input name="name" ng-model="$parent.sp.name" type="text" required>' +
                    '<div ng-hide="$parent.suggest_product==null" class="btn-group" dropdown>' +
                        '<button class="btn btn-primary dropdown-toggle">suggest <span class="caret"></span></button>' +
                        '<ul class="dropdown-menu" role="menu">' +
                            '<li ng-repeat="sp in $parent.suggest_product.store_product_set | orderBy:\'name\'"><a ng-click="$parent.sp.name=sp.name" href="#">{{sp.name}}</a></li>' +
                        '</ul>' +
                    '</div>' + 
                    '<label class="error" ng-show="form.name.$error.required">require</label>' +
                '</div>' +
            '</div>' 
        ;
        
        var template_price = 
            '<div class="form-group">' +
                '<label class="col-sm-4 control-label">Price:</label>' +
                '<div class="col-sm-8">' +
                    '<input name="price" ng-model="$parent.sp.price" type="number" required>' +
                    '<div ng-hide="$parent.suggest_product==null" class="btn-group" dropdown>' +    
                        '<button ng-click="$parent.sp.price=get_suggest(\'price\')" class="btn btn-primary">{{get_suggest(\'price\')|currency}}</button>' +
                        '<button ng-hide="$parent.suggest_product.store_product_set.length <= 1" class="btn btn-primary dropdown-toggle"><span class="caret"></span><span class="sr-only">split button</span></button>' +
                        '<ul class="dropdown-menu" role="menu">' +
                            '<li ng-repeat="sp in $parent.suggest_product.store_product_set | orderBy:\'price\'"><a ng-click="$parent.sp.price=sp.price" href="#">{{sp.price|currency}}</a></li>' +
                        '</ul>' +
                    '</div>' +
                    '<label class="error" ng-show="form.price.$invalid">require</label>' +
                '</div>' +
            '</div>'
        ;

        var template_crv = 
            '<div class="form-group">' +
                '<label class="col-sm-4 control-label">Crv:</label>' +
                '<div class="col-sm-8">' +
                    '<input name="crv" ng-model="$parent.sp.crv" ng-disabled="{{sp|is_kit}}" type="number">' +
                    '<div ng-hide="$parent.suggest_product==null" class="btn-group" dropdown>' +
                        '<button ng-click="$parent.sp.crv=get_suggest(\'crv\')" class="btn btn-primary">{{get_suggest(\'crv\')|currency}}</button>' +
                        '<button ng-hide="$parent.suggest_product.store_product_set.length <=1" class="btn btn-primary dropdown-toggle" ><span class="caret"></span></button>' +
                        '<ul class="dropdown-menu" role="menu">' +
                            '<li ng-repeat="sp in $parent.suggest_product.store_product_set | orderBy:\'crv\'">' + 
                                '<a ng-click="$parent.sp.crv=sp.crv" href="#">{{sp.crv|currency}}</a>' +
                            '</li>' +
                        '</ul>' +
                    '</div>' +

                    '<label class="error" ng-show="form.crv.$invalid">' +
                        'invalid input' +
                    '</label>' +                                                            
                '</div>' +
            '</div>'
        ;

        var template_taxable = 
            '<div class="form-group">' +
                '<label class="col-sm-4 control-label">Taxable:</label>' +
                '<div class="col-sm-8">' +
                    '<input ng-model="$parent.sp.is_taxable" type="checkbox">' +
                '</div>' +
            '</div>'
        ;        

        var template_cost = 
            '<div class="form-group">' +
                '<label class="col-sm-4 control-label">Cost:</label>' +
                '<div class="col-sm-8">' +
                    '<input name="cost" ng-model="$parent.sp.cost" ng-disabled="{{sp|is_kit}}" type="number" value="{{sp|compute_sp_kit_field:\'cost\'}}"">' +
                    '<div ng-hide="$parent.suggest_product==null" class="btn-group" dropdown>' +
                        '<button ng-click="$parent.sp.cost=get_suggest(\'cost\')" class="btn btn-primary">{{get_suggest(\'cost\')|currency}}</button>' +
                        '<button class="btn btn-primary dropdown-toggle" ng-hide="$parent.suggest_product.store_product_set.length<=1"><span class="caret"></span></button>' +
                        '<ul class="dropdown-menu" role="menu">' +
                            '<li ng-repeat="sp in $parent.suggest_product.store_product_set">' +
                                '<a ng-click="$parent.sp.cost=sp.cost" href="#">{{sp.cost|currency}}</a>' +
                            '</li>' +
                        '</ul>' +
                    '</div>' +
                    '<label class="error" ng-show="form.cost.$invalid">' +
                        'invalid number' +
                    '</label>' +
                '</div>' +
            '</div>'
        ;        

        var template_sale_report =
            '<div class="form-group">' +
                '<label class="col-sm-4 control-label">Sale report:</label>' +
                '<div class="col-sm-8">' +
                    '<input ng-model="$parent.sp.is_sale_report" type="checkbox">' +
                '</div>' +
            '</div>'
        ;

        var template_type_tag = 
            '<div class="form-group">' +
                '<label class="col-sm-4 control-label">Type:</label>' +
                '<div class="col-sm-8">' +
                    '<input ng-model="$parent.sp.p_type" type="text">' +
                '</div>' +
            '</div>' +

            '<div class="form-group">' +
                '<label class="col-sm-4 control-label">Tag:</label>' +
                '<div class="col-sm-8">' +
                    '<input ng-model="$parent.sp.p_tag" type="text">' +
                '</div>' +
            '</div>'
        ;

        var template_vendor =
            '<div class="form-group">' +
                '<label class="col-sm-4 control-label">Vendor:</label>' +
                '<div class="col-sm-8">' +
                    '<input ng-model="$parent.sp.vendor" type="text">' +
                '</div>' +    
            '</div>'
        ;

        var template_buydown = 
            '<div class="form-group">' +
                '<label class="col-sm-4 control-label">Buydown:</label>' +
                '<div class="col-sm-8">' +
                    '<input name="buydown" ng-disabled="{{sp|is_kit}}" ng-model="$parent.sp.buydown" type="number" value="{{sp|compute_sp_kit_field:\'buydown\'}}">' +    
                    '<label class="error" ng-show="form.buydown.$invalid">' +
                        'invalid input' +
                    '</label>' +                                     
                '</div>' +
            '</div>'
        ;

        var template_value_customer_price =
            '<div class="form-group">' +
                '<label class="col-sm-4 control-label">value customer price:</label>' +
                '<div class="col-sm-8">' +
                    '<input name="value_customer_price" ng-model="$parent.sp.value_customer_price" type="number" />' +
                    '<label class="error" ng-show="form.value_customer_price.$invalid">' +
                        'invalid number' +
                    '</label>' +
                '</div>' +
            '</div>' 
        ;

        var template_sku = 
            '<div ng-show="is_create_new_sp()" class="form-group">' +
                '<label class="col-sm-4 control-label">Sku:</label>' +
                '<div class="col-sm-8">' +
                    '<input name="sku" ng-model="$parent.sku" ng-disabled="can_not_change_sku()" type="text" ng-required="is_create_new_sp()">' +
                    '<label class="error" ng-show="form.sku.$error.required">require</label>' +
                '</div>' +
            '</div>'
        ;

        var template =
            '<div class="modal-header">' +
                '<h3 class="modal-title">{{calculate_title()}}</h3>' +
            '</div>' +

            '<div class="modal-body">' +
                '<form name="form" novalidate>' +
                    '<div class="form-horizontal" >' +
                        template_name +
                        template_price +
                        template_crv +
                        template_taxable +
                        template_cost +
                        template_sale_report +
                        template_type_tag +
                        template_vendor +
                        template_buydown +
                        template_value_customer_price +
                        template_sku + 
                    '</div>' + /* end form horizontal*/
                '</form>' + /* end modal body*/   
            '</div>' +

            '<div class="modal-footer">' +          
                '<button class="btn btn-warning" ng-click="cancel()">cancel</button>' + 
                '<button ng-disabled="is_unchange()" class="btn btn-primary" ng-click="reset()">reset</button>' +                               
                '<button ng-disabled="is_unchange()||form.$invalid" class="btn btn-success" ng-click="save()">save</button>' +
            '</div>'
        ;      

        var ModalCtrl = function($scope,$modalInstance,$filter,$http,original_sp,suggest_product,duplicate_sp,original_sku){
            $scope.suggest_product = suggest_product;
            $scope.duplicate_sp = duplicate_sp;
            $scope.original_sku = original_sku;
            $scope.original_sp = original_sp;
            $scope.initial_blank_sp = {is_sale_report:true,is_taxable:false};

            //pending data for storing prompt
            $scope.sku = original_sku;            
            $scope.sp = angular.copy(original_sp);
            if($scope.sp == null){
                if($scope.duplicate_sp == null){
                    $scope.sp = angular.copy($scope.initial_blank_sp);
                }else{
                    $scope.sp = angular.copy($scope.duplicate_sp);
                }
                
            }

            //init kit value: we need this because what we store inside sp.kit_field could be different that the current calculated kid field. Thus, we init sp.kit_field to be the actual currently calculated field sp that it will display correctly 
            if($filter('is_kit')($scope.sp)){
                $scope.sp.crv = $filter('compute_sp_kit_field')($scope.sp,'crv');
                $scope.sp.cost = $filter('compute_sp_kit_field')($scope.sp,'cost');
                $scope.sp.buydown = $filter('compute_sp_kit_field')($scope.sp,'buydown');
            }
            $scope.reset = function(){
                if($scope.original_sp == null){
                    if($scope.duplicate_sp == null){
                        $scope.sp = angular.copy($scope.initial_blank_sp);
                    }else{
                        $scope.sp = angular.copy($scope.duplicate_sp);
                    }
                }else{
                    $scope.sp = angular.copy($scope.original_sp);
                }
                
                $scope.sku = angular.copy($scope.original_sku);
            };             
            $scope.is_unchange = function() {
                var is_unchange_sku = angular.equals($scope.original_sku,$scope.sku);
                var is_unchange_sp = undefined;
                if($scope.original_sp == null){
                    if($scope.duplicate_sp == null){
                        is_unchange_sp = angular.equals($scope.sp,$scope.initial_blank_sp);
                    }else{
                        is_unchange_sp = angular.equals($scope.sp,$scope.duplicate_sp);
                    }
                    
                }else{
                    is_unchange_sp = angular.equals($scope.sp,$scope.original_sp);
                }
                return is_unchange_sp && is_unchange_sku;
            };    
            $scope.can_not_change_sku = function(){
                /*
                    sku input only visible when we are creating a new sp. there is 2 cases to create a new sp. 
                        when we scan a sku that is not exist    -> can NOT change sku prefill
                        when we duplicate  product              -> no sku prefill and we CAN change sku (negate this: dup_sp == null -> CANT change sku)
                */
                
                return $scope.duplicate_sp==null;
            }
            $scope.is_create_new_sp = function(){
                return $scope.original_sp == null;
            }
            $scope.get_suggest = function(field){
                if($scope.suggest_product == null){
                    return null;
                }
                return $filter('get_product_suggest_info')($scope.suggest_product,field);
            }
            $scope.calculate_title = function(){
                if($scope.suggest_product != null){
                    return 'Add: ' + $scope.suggest_product.name;
                }else if($scope.duplicate_sp != null){
                    return 'Duplicate: ' + $scope.duplicate_sp.name;
                }else if($scope.original_sp == null){
                    return 'Create new product';
                }else{
                    return 'Edit: ' + $scope.original_sp.name;
                }
            };
            $scope.cancel = function(){
                $modalInstance.dismiss('_cancel_');
            };
            $scope.save = function(){
                $modalInstance.close({sku:$scope.sku,sp:$scope.sp});
            };
        }

        return function(original_sp,suggest_product,duplicate_sp,sku){
            var dlg = $modal.open({
                template: template,
                controller: ModalCtrl,
                backdrop:'static',
                windowClass:'xlg-dialog',
                size: 'lg',
                resolve : {
                     original_sp : function(){return original_sp}
                    ,suggest_product : function(){return suggest_product}
                    ,duplicate_sp : function(){return duplicate_sp}
                    ,original_sku : function(){return sku}
                }
            });
            return dlg.result;
        }   
    }]);
})