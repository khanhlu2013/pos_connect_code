define(
[
    'angular'
]
,function
(
    angular
)
{
    var mod = angular.module('sp_app/service/prompt',[]);
    mod.factory('sp_app/service/prompt',['$modal', function($modal){

        //- NAME -------------------------------------------------------------------------------------------------------------------------------------------------------
        var template_name_main_suggestion = 
            '<button' + 
                ' id="sp_app/service/prompt/suggest_name_main_btn"' +
                ' ng-click="$parent.sp.name=get_suggest(\'name\')"' +
                ' type="button"' +
                ' class="btn btn-primary">' +
                    '{{get_suggest(\'name\')}}' +
            '</button>'
        ;
        var template_name_extra_suggestion =
            '<button ' +
                ' id="sp_app/service/prompt/suggest_name_extra_btn"' +
                ' ng-disabled="!is_many_suggestion(\'name\')"' +
                ' type="button"' +
                ' class="btn btn-primary dropdown-toggle">' + 
                    '<span class="caret"></span>' +
            '</button type="button">' +
            '<ul class="dropdown-menu" role="menu">' +
                '<li ng-repeat="sp in suggest_product.sp_lst | orderBy:\'name\'"><a ng-click="$parent.sp.name=sp.name" href="#">{{sp.name}}</a></li>' +
            '</ul>'      
        ;
        var template_name_suggestion = 
            '<div id="sp_app/service/prompt/suggest_name" ng-hide="is_no_suggestion(\'name\')" class="btn-group" dropdown>' +
                template_name_main_suggestion +
                template_name_extra_suggestion +
            '</div>'
        ;
        var template_name = 
            '<div class="form-group">' +
                '<label class="col-sm-4 control-label" >Name:</label>' +
                '<div class="col-sm-8">' +
                    '<input id="sp_app/service/prompt/name_txt" name="product_name" ng-model="$parent.sp.name" type="text" required>' +
                    template_name_suggestion +
                    '<label class="error" ng-show="form.product_name.$error.required">require</label>' +
                '</div>' +
            '</div>' 
        ;

        //- PRICE -------------------------------------------------------------------------------------------------------------------------------------------------------
        var template_price_main_suggestion = 
            '<button' + 
                ' id="sp_app/service/prompt/suggest_price_main_btn"' +
                ' ng-click="$parent.sp.price=get_suggest(\'price\')"' +
                ' type="button"' +
                ' class="btn btn-primary">' + 

                    '{{get_suggest(\'price\')|currency}}' + 
            '</button>'
        ;
        var template_price_extra_suggestion = 
            '<button' +
                ' id="sp_app/service/prompt/suggest_price_extra_btn"' +
                ' ng-disabled="!is_many_suggestion(\'price\')"' +
                ' type="button"' +
                ' class="btn btn-primary dropdown-toggle">' + 
                    '<span class="caret"></span>' +
            '</button>' +
            '<ul class="dropdown-menu" role="menu">' +
                '<li ng-repeat="sp in suggest_product.sp_lst | orderBy:\'price\'"><a ng-click="$parent.sp.price=sp.price" href="#">{{sp.price|currency}}</a></li>' +
            '</ul>'
        ;  
        var template_price_suggestion = 
            '<div id="sp_app/service/prompt/suggest_price" ng-hide="is_no_suggestion(\'price\')" class="btn-group" dropdown>' +   
                template_price_main_suggestion +
                template_price_extra_suggestion +
            '</div>'
        ;
        var template_price =
            '<div class="form-group">' +
                '<label class="col-sm-4 control-label">Price:</label>' +
                '<div class="col-sm-8">' +
                    '<input id="sp_app/service/prompt/price_txt" name="price" ng-model="$parent.sp.price" type="number" required>' +
                    template_price_suggestion +
                    '<label class="error" ng-show="form.price.$invalid">require</label>' +
                '</div>' +
            '</div>'
        ;

        //- CRV -------------------------------------------------------------------------------------------------------------------------------------------------------
        var template_crv_main_suggestion = 
            '<button' +
                ' id="sp_app/service/prompt/suggest_crv_main_btn"' +
                ' ng-click="$parent.sp.crv=get_suggest(\'crv\')"' +
                ' type="button"' +
                ' class="btn btn-primary">' +
                    '{{get_suggest(\'crv\')|currency}}' +
            '</button>'         
        ;
        var template_crv_extra_suggestion = 
            '<button' +
                ' id="sp_app/service/prompt/suggest_crv_extra_btn"' +
                ' ng-disabled="!is_many_suggestion(\'crv\')"' +
                ' type="button"' +
                ' class="btn btn-primary dropdown-toggle">' +
                    '<span class="caret"></span>' + 
            '</button>' +
            '<ul class="dropdown-menu" role="menu">' +
                '<li ng-repeat="sp in suggest_product.sp_lst | orderBy:\'get_crv()\'">' + 
                    '<a ng-click="$parent.sp.crv=sp.crv" href="#">{{sp.crv|currency}}</a>' +
                '</li>' +
            '</ul>'
        ;
        var template_crv_suggestion = 
            '<div id="sp_app/service/prompt/suggest_crv" ng-hide="is_no_suggestion(\'crv\')" class="btn-group" dropdown>' +
                template_crv_main_suggestion +
                template_crv_extra_suggestion +
            '</div>'
        ;      
        var template_crv = 
            '<div class="form-group">' +
                '<label class="col-sm-4 control-label">Crv:</label>' +
                '<div class="col-sm-8">' +
                    '<input id="sp_app/service/prompt/crv_txt" name="crv" ng-model="$parent.sp.crv" ng-disabled="{{sp.is_kit()}}" type="number">' +
                    template_crv_suggestion +
                    '<label class="error" ng-show="form.crv.$invalid">' +
                        'invalid input' +
                    '</label>' +                                                            
                '</div>' +
            '</div>'
        ;

        //- TAX -------------------------------------------------------------------------------------------------------------------------------------------------------
        var template_taxable_main_suggestion = 
            '<button' +
                ' id="sp_app/service/prompt/suggest_taxable_main_btn"' +
                ' ng-click="$parent.sp.is_taxable=get_suggest(\'is_taxable\')"' +
                ' type="button"' +
                ' class="btn btn-primary">' +
                    '{{get_suggest(\'is_taxable\')}}' +
            '</button>'         
        ;
        var template_taxable_extra_suggestion = 
            '<button' +
                ' id="sp_app/service/prompt/suggest_taxable_extra_btn"' +
                ' ng-disabled="!is_tax_suggest_has_both_false_and_true()"' +
                ' type="button"' +
                ' class="btn btn-primary dropdown-toggle">' +
                    '<span class="caret"></span>' + 
            '</button>' +
            '<ul class="dropdown-menu" role="menu">' +
                '<li ng-repeat="stat in tax_suggest_statistic">' + 
                    '<a ng-click="$parent.sp.is_taxable=stat.is_taxable" href="#">{{stat.is_taxable + " - " + stat.value + "%"}}</a>' +
                '</li>' +
            '</ul>'
        ;
        var template_taxable_suggestion = 
            '<div id="sp_app/service/prompt/suggest_taxable" ng-hide="is_no_suggestion(\'crv\')" class="btn-group" dropdown>' +
                template_taxable_main_suggestion +
                template_taxable_extra_suggestion +
            '</div>'
        ;             
        var template_taxable = 
            '<div class="form-group">' +
                '<label class="col-sm-4 control-label">Taxable:</label>' +
                '<div class="col-sm-8">' +
                    '<input id="sp_app/service/prompt/is_taxable_check" ng-model="$parent.sp.is_taxable" type="checkbox">' +
                    template_taxable_suggestion +
                '</div>' +
            '</div>'
        ;        

        //- COST -------------------------------------------------------------------------------------------------------------------------------------------------------
        var template_cost_main_suggestion = 
            '<button' +
                ' id="sp_app/service/prompt/suggest_cost_main_btn"' +
                ' ng-click="$parent.sp.cost=get_suggest(\'cost\')"' +
                ' type="button"' +
                ' class="btn btn-primary">' +
                    '{{get_suggest(\'cost\')|currency}}' + 
            '</button>' 
        ;
        var template_cost_extra_suggestion =
            '<button' +
                ' id="sp_app/service/prompt/suggest_cost_extra_btn"' +
                ' ng-disabled="!is_many_suggestion(\'cost\')"' +
                ' type="button"' +
                ' class="btn btn-primary dropdown-toggle">' +
                    '<span class="caret"></span>' +
            '</button>' +
            '<ul class="dropdown-menu" role="menu">' +
                '<li ng-repeat="sp in suggest_product.sp_lst | orderBy:\'get_cost()\'">' +
                    '<a ng-click="$parent.sp.cost=sp.cost" href="#">{{sp.cost|currency}}</a>' +
                '</li>' +
            '</ul>'
        ;
        var template_cost_suggestion = 
            '<div id="sp_app/service/prompt/suggest_cost" ng-hide="is_no_suggestion(\'cost\')" class="btn-group" dropdown>' +
                template_cost_main_suggestion +
                template_cost_extra_suggestion +
            '</div>'
        ;
        var template_cost =
            '<div class="form-group">' +
                '<label class="col-sm-4 control-label">Cost:</label>' +
                '<div class="col-sm-8">' +
                    '<input id="sp_app/service/prompt/cost_txt" name="cost" ng-model="$parent.sp.cost" ng-disabled="{{sp.is_kit()}}" type="number"}}"">' +
                    template_cost_suggestion +
                    '<label class="error" ng-show="form.cost.$invalid">' +
                        'invalid number' +
                    '</label>' +
                '</div>' +
            '</div>'
        ;        


        //- EXTRA -------------------------------------------------------------------------------------------------------------------------------------------------------
        var template_sale_report =
            '<div class="form-group">' +
                '<label class="col-sm-4 control-label">Sale report:</label>' +
                '<div class="col-sm-8">' +
                    '<input id="sp_app/service/prompt/is_sale_report_check" ng-model="$parent.sp.is_sale_report" type="checkbox">' +
                '</div>' +
            '</div>'
        ;

        var template_type_tag = 
            '<div class="form-group">' +
                '<label class="col-sm-4 control-label">Type:</label>' +
                '<div class="col-sm-8">' +
                    '<input id="sp_app/service/prompt/p_type_txt" ng-model="$parent.sp.p_type" type="text">' +
                '</div>' +
            '</div>' +

            '<div class="form-group">' +
                '<label class="col-sm-4 control-label">Tag:</label>' +
                '<div class="col-sm-8">' +
                    '<input id="sp_app/service/prompt/p_tag_txt" ng-model="$parent.sp.p_tag" type="text">' +
                '</div>' +
            '</div>'
        ;

        var template_vendor =
            '<div class="form-group">' +
                '<label class="col-sm-4 control-label">Vendor:</label>' +
                '<div class="col-sm-8">' +
                    '<input id="sp_app/service/prompt/vendor_txt" ng-model="$parent.sp.vendor" type="text">' +
                '</div>' +    
            '</div>'
        ;

        var template_buydown = 
            '<div class="form-group">' +
                '<label class="col-sm-4 control-label">Buydown:</label>' +
                '<div class="col-sm-8">' +
                    '<input id="sp_app/service/prompt/buydown_txt" name="buydown" ng-disabled="{{sp.is_kit()}}" ng-model="$parent.sp.buydown" type="number"}}">' +    
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
                    '<input id="sp_app/service/prompt/value_customer_price_txt" name="value_customer_price" ng-model="$parent.sp.value_customer_price" type="number" />' +
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
                    '<input id="sp_app/service/prompt/sku_txt" name="sku" ng-model="$parent.sku" ng-disabled="can_not_change_sku()" type="text" ng-required="is_create_new_sp()">' +
                    '<label class="error" ng-show="form.sku.$error.required">require</label>' +
                '</div>' +
            '</div>'
        ;

        var template =
            '<div id="sp_app/service/prompt/dialog" class="modal-header">' +
                '<h3 class="modal-title">{{calculate_title()}}</h3>' +
            '</div>' +

            '<div class="modal-body">' +
                '<form name="form" novalidate role="form">' +
                    '<div class="form-horizontal" >' +
                        template_name +
                        template_price +
                        template_crv +
                        template_taxable +
                        template_cost +
                        '<hr>' +
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
                '<button id="sp_app/service/prompt/cancel_btn" class="btn btn-warning" ng-click="cancel()" type="button">cancel</button>' + 
                '<button ng-disabled="is_unchange()" class="btn btn-primary" ng-click="reset()" type="button">reset</button>' +                               
                '<button id="sp_app/service/prompt/ok_btn" ng-disabled="is_unchange()||form.$invalid" class="btn btn-success" ng-click="ok()" type="button">ok</button>' +
            '</div>'
        ;      

        var ModalCtrl = function($scope,$modalInstance,$filter,$http,original_sp,suggest_product,duplicate_sp,original_sku){
            $scope.suggest_product = suggest_product;
            $scope.duplicate_sp = duplicate_sp;
            $scope.original_sku = original_sku;
            $scope.original_sp = original_sp;
            initial_blank_sp = {is_sale_report:true,is_taxable:false};
            $scope.tax_suggest_statistic = (suggest_product == null ? null : suggest_product.get_tax_suggest_statistic())

            //pending data for storing prompt
            $scope.sku = original_sku;            
            $scope.sp = angular.copy(original_sp);
            if($scope.sp == null){
                if($scope.duplicate_sp == null){
                    $scope.sp = angular.copy(initial_blank_sp);
                }else{
                    $scope.sp = angular.copy($scope.duplicate_sp);
                }
            }

            //init kit value: we need this because what we store inside sp.kit_field could be different that the current calculated kid field. Thus, we init sp.kit_field to be the actual currently calculated field sp that it will display correctly 
            if( !angular.equals($scope.sp,initial_blank_sp) && $scope.sp.is_kit()){
                $scope.sp.crv = $scope.sp.get_crv();
                $scope.sp.cost = $scope.sp.get_cost();
                $scope.sp.buydown = $scope.sp.get_buydown();
            }
            $scope.is_tax_suggest_has_both_false_and_true = function(){
                if($scope.tax_suggest_statistic == null){
                    return false;
                }             
                return $scope.tax_suggest_statistic[0].value != 0 && $scope.tax_suggest_statistic[1].value != 0;   
            }
            $scope.is_no_suggestion = function(field){
                if($scope.suggest_product == null){
                    return true;
                }
                return $scope.suggest_product.get_suggest_main(field) == null;
            }
            $scope.is_many_suggestion = function(field){
                if($scope.suggest_product == null){
                    return false;
                }                
                var lst= $scope.suggest_product.get_suggest_extra(field);
                if(lst == null){
                    return false;
                }else{
                    return lst.length >1;
                }
            }
            $scope.reset = function(){
                if($scope.original_sp == null){
                    if($scope.duplicate_sp == null){
                        $scope.sp = angular.copy(initial_blank_sp);
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
                        is_unchange_sp = angular.equals($scope.sp,initial_blank_sp);
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
                return $scope.suggest_product.get_suggest_main(field);
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
            $scope.ok = function(){
                $modalInstance.close({sku:$scope.sku,sp:$scope.sp});
            };
        }

        return function(original_sp,suggest_product,duplicate_sp,sku){
            var dlg = $modal.open({
                template: template,
                controller: ModalCtrl,
                backdrop:'static',
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