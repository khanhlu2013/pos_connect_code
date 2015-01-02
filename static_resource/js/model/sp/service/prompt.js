define(
[
    'angular'
    //-------
    ,'model/sp/service/search/name_sku_online_dlg'
    ,'model/sp/model'
    ,'service/ui'
]
,function
(
    angular
)
{
    var mod = angular.module('sp/service/prompt',
    [
         'sp/service/search/name_sku_online_dlg'
        ,'service/ui'
        ,'sp/model'
    ]);
    mod.factory('sp/service/prompt',
    [
         '$modal'
        ,'$http'
        ,'$q'
        ,'sp/service/search/name_sku_online_dlg/single'
        ,'sp/model/Store_product'
        ,'service/ui/alert'
    ,function(
         $modal
        ,$http
        ,$q
        ,search_single_sp_dlg
        ,Store_product
        ,alert_service
    ){
        //- NAME -------------------------------------------------------------------------------------------------------------------------------------------------------
        var template_name_main_suggestion = 
            '<button' + 
                ' id="sp_app/service/prompt/suggest/main/name"' +
                ' ng-click="$parent.sp.name=get_suggest_main(\'name\').value"' +
                ' type="button"' +
                ' class="btn btn-primary">' +
                    '{{get_suggest_main(\'name\').value}}' +
            '</button>'
        ;
        var template_name_extra_suggestion =
            '<button ' +
                ' id="sp_app/service/prompt/suggest/extra/name"' +
                ' ng-disabled="!is_many_suggestion(\'name\')"' +
                ' type="button"' +
                ' class="btn btn-primary dropdown-toggle">' + 
                    '<span class="caret"></span>' +
            '</button type="button">' +
            '<ul class="dropdown-menu" role="menu">' +
                '<li ng-repeat="extra in get_suggest_extra(\'name\')|orderBy:\'percent\':true"><a ng-click="$parent.sp.name=extra.value" href="#">{{extra.value}} - ({{extra.percent}}%)</a></li>' +
            '</ul>'      
        ;
        var template_name_suggestion = 
            '<div ng-hide="is_no_suggestion(\'name\')" class="btn-group" dropdown>' +
                template_name_main_suggestion +
                template_name_extra_suggestion +
            '</div>'
        ;
        var template_name = 
            '<div class="form-group">' +
                '<label class="col-sm-4 control-label" >Name:</label>' +
                '<div class="col-sm-8">' +
                    '<input id="sp_app/service/prompt/name_txt" name="product_name" ng-model="$parent.sp.name" type="text" size="45" required>' +
                    template_name_suggestion +
                    '<label class="error" ng-show="form.product_name.$error.required">require</label>' +
                '</div>' +
            '</div>' 
        ;

        //- PRICE -------------------------------------------------------------------------------------------------------------------------------------------------------
        var template_price_main_suggestion = 
            '<button' + 
                ' id="sp_app/service/prompt/suggest/main/price"' +
                ' ng-click="$parent.sp.price=get_suggest_main(\'price\')"' +
                ' type="button"' +
                ' class="btn btn-primary">' + 

                    '{{get_suggest_main(\'price\')|currency}}' + 
            '</button>'
        ;
        var template_price_extra_suggestion = 
            '<button' +
                ' id="sp_app/service/prompt/suggest/extra/price"' +
                ' ng-disabled="!is_many_suggestion(\'price\')"' +
                ' type="button"' +
                ' class="btn btn-primary dropdown-toggle">' + 
                    '<span class="caret"></span>' +
            '</button>' +
            '<ul class="dropdown-menu" role="menu">' +
                '<li ng-repeat="extra in get_suggest_extra(\'price\')|orderBy:\'valueOf()\'"><a ng-click="$parent.sp.price=extra" href="#">{{extra|currency}}</a></li>' +
            '</ul>'
        ;  
        var template_price_suggestion = 
            '<div ng-hide="is_no_suggestion(\'price\')" class="btn-group" dropdown>' +   
                template_price_main_suggestion +
                template_price_extra_suggestion +
            '</div>'
        ;
        var template_price =
            '<div class="form-group">' +
                '<label class="col-sm-4 control-label">Price:</label>' +
                '<div class="col-sm-8">' +
                    '<input id="sp_app/service/prompt/price_txt" name="price" ng-model="$parent.sp.price" type="number" size="45" required>' +
                    template_price_suggestion +
                    '<label class="error" ng-show="form.price.$invalid">require</label>' +
                '</div>' +
            '</div>'
        ;

        //- CRV -------------------------------------------------------------------------------------------------------------------------------------------------------
        var template_crv_main_suggestion = 
            '<button' +
                ' id="sp_app/service/prompt/suggest/main/crv"' +
                ' ng-click="$parent.sp.crv=get_suggest_main(\'crv\').value"' +
                ' type="button"' +
                ' class="btn btn-primary">' +
                    '{{get_suggest_main(\'crv\').value|currency}}' +
            '</button>'         
        ;
        var template_crv_extra_suggestion = 
            '<button' +
                ' id="sp_app/service/prompt/suggest/extra/crv"' +
                ' ng-disabled="!is_many_suggestion(\'crv\')"' +
                ' type="button"' +
                ' class="btn btn-primary dropdown-toggle">' +
                    '<span class="caret"></span>' + 
            '</button>' +
            '<ul class="dropdown-menu" role="menu">' +
                '<li ng-repeat="extra in get_suggest_extra(\'crv\')|orderBy:\'percent\':true"><a ng-click="$parent.sp.crv=extra.value" href="#">{{extra.value|currency}} - ({{extra.percent}}%)</a></li>' +
            '</ul>'
        ;
        var template_crv_suggestion = 
            '<div ng-hide="is_no_suggestion(\'crv\')" class="btn-group" dropdown>' +
                template_crv_main_suggestion +
                template_crv_extra_suggestion +
            '</div>'
        ;      
        var template_crv = 
            '<div class="form-group">' +
                '<label class="col-sm-4 control-label">Crv:</label>' +
                '<div class="col-sm-8">' +
                    '<input id="sp_app/service/prompt/crv_txt" name="crv" ng-model="$parent.sp.crv" ng-disabled="{{sp.is_kit()}}" type="number" size="45">' +
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
                ' id="sp_app/service/prompt/suggest/main/is_taxable"' +
                ' ng-click="$parent.sp.is_taxable=get_suggest_main(\'is_taxable\').value"' +
                ' type="button"' +
                ' class="glyphicon btn btn-primary"' +                
                ' ng-class="get_suggest_main(\'is_taxable\').value ? \'glyphicon-check\' : \'glyphicon-unchecked\'">' +
                    '<span>({{get_suggest_main(\'is_taxable\').percent}}%)</span>' +
            '</button>'         
        ;
        var template_taxable_extra_suggestion =
            '<button' +
                ' id="sp_app/service/prompt/suggest/extra/is_taxable"' +
                ' ng-click="$parent.sp.is_taxable=!get_suggest_main(\'is_taxable\').value"' +
                ' type="button"' +
                ' class="glyphicon btn btn-primary"' +                
                ' ng-class="!get_suggest_main(\'is_taxable\').value ? \'glyphicon-check\' : \'glyphicon-unchecked\'">' +
                    '<span>({{100 - get_suggest_main(\'is_taxable\').percent}}%)</span>' +
            '</button>'    
        ;
        var template_taxable_suggestion = 
            '<div ng-hide="is_no_suggestion(\'is_taxable\')" class="btn-group" dropdown>' +
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
                ' id="sp_app/service/prompt/suggest/main/cost"' +
                ' ng-click="$parent.sp.cost=get_suggest_main(\'cost\')"' +
                ' type="button"' +
                ' class="btn btn-primary">' +
                    '{{get_suggest_main(\'cost\')|currency}}' + 
            '</button>' 
        ;
        var template_cost_extra_suggestion =
            '<button' +
                ' id="sp_app/service/prompt/suggest/extra/cost"' +
                ' ng-disabled="!is_many_suggestion(\'cost\')"' +
                ' type="button"' +
                ' class="btn btn-primary dropdown-toggle">' +
                    '<span class="caret"></span>' +
            '</button>' +
            '<ul class="dropdown-menu" role="menu">' +
                '<li ng-repeat="extra in get_suggest_extra(\'cost\')|orderBy:\'valueOf()\'"><a ng-click="$parent.sp.cost=extra" href="#">{{extra|currency}}</a></li>' +            
                    '<a ng-click="$parent.sp.cost=sp.cost" href="#">{{sp.cost|currency}}</a>' +
                '</li>' +
            '</ul>'
        ;
        var template_cost_suggestion = 
            '<div ng-hide="is_no_suggestion(\'cost\')" class="btn-group" dropdown>' +
                template_cost_main_suggestion +
                template_cost_extra_suggestion +
            '</div>'
        ;
        var template_cost =
            '<div class="form-group">' +
                '<label class="col-sm-4 control-label">Cost:</label>' +
                '<div class="col-sm-8">' +
                    '<input id="sp_app/service/prompt/cost_txt" name="cost" ng-model="$parent.sp.cost" ng-disabled="{{sp.is_kit()}}" type="number" size="45"}}"">' +
                    '<label ng-show="$parent.sp.get_markup()!== null && $parent.sp.get_markup()!== NaN"> markup: {{$parent.sp.get_markup()}}%</label>' +
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
                    '<input id="sp_app/service/prompt/p_type_txt" ng-model="$parent.sp.p_type" typeahead="item.type for item in lookup_type_tag | filter:$viewValue | limitTo:8" type="text" size="45">' +
                '</div>' +
            '</div>' +
            '<div class="form-group">' +
                '<label class="col-sm-4 control-label">Tag:</label>' +
                '<div class="col-sm-8">' +
                    '<input id="sp_app/service/prompt/p_tag_txt" ng-model="$parent.sp.p_tag" type="text" size="45">' +
                '</div>' +
            '</div>'
        ;

        var template_vendor =
            '<div class="form-group">' +
                '<label class="col-sm-4 control-label">Vendor:</label>' +
                '<div class="col-sm-8">' +
                    '<input id="sp_app/service/prompt/vendor_txt" ng-model="$parent.sp.vendor" type="text" size="45">' +
                '</div>' +    
            '</div>'
        ;

        var template_buydown = 
            '<div class="form-group">' +
                '<label class="col-sm-4 control-label">Buydown:</label>' +
                '<div class="col-sm-8">' +
                    '<input id="sp_app/service/prompt/buydown_txt" name="buydown" ng-disabled="{{sp.is_kit()}}" ng-model="$parent.sp.buydown" type="number" size="45"}}">' +    
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
                    '<input id="sp_app/service/prompt/value_customer_price_txt" name="value_customer_price" ng-model="$parent.sp.value_customer_price" type="number" size="45" />' +
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
                '<button' +
                    ' id="sp_app/service/prompt/duplicate_from_btn"' +
                    ' class="btn btn-primary btn-float-left"' +
                    ' ng-click="duplicate_from()"' +
                    ' ng-show="original_sp===null"' +
                    ' type="button">duplicate from</button>' +    
                '<button id="sp_app/service/prompt/cancel_btn" class="btn btn-warning" ng-click="cancel()" type="button">cancel</button>' + 
                '<button ng-disabled="is_unchange()" class="btn btn-primary" ng-click="reset()" type="button">reset</button>' +                               
                '<button id="sp_app/service/prompt/ok_btn" ng-disabled="is_unchange()||form.$invalid" class="btn btn-success" ng-click="ok()" type="button">ok</button>' +
            '</div>'
        ;      

        function process(lookup_type_tag){
            var result = [];
            for(item in lookup_type_tag){
                var obj = {type:item,tag_lst:lookup_type_tag[item]}
                result.push(obj);
            }
            return result;
        }

        var ModalCtrl = function($scope,$modalInstance,$filter,original_sp,suggest_product,duplicate_sp,original_sku,lookup_type_tag){
            $scope.suggest_product = suggest_product;
            $scope.duplicate_sp = duplicate_sp;
            $scope.original_sku = original_sku;
            $scope.original_sp = original_sp;
            // initial_blank_sp = {is_sale_report:true,is_taxable:false};
            initial_blank_sp = new Store_product();
            initial_blank_sp.is_sale_report = true;
            initial_blank_sp.is_taxable = false;
            $scope.lookup_type_tag = process(lookup_type_tag);

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

            //init kit value: we need this because what we store inside - lets say sp.crv - could be different that the current calculated sp.get_crv(). Thus, we init sp.kit_field to be the actual currently calculated field sp that it will display correctly 
            if( !angular.equals($scope.sp,initial_blank_sp) && $scope.sp.is_kit()){
                $scope.sp.crv = $scope.sp.get_crv();
                $scope.sp.cost = $scope.sp.get_cost();
                $scope.sp.buydown = $scope.sp.get_buydown();
            }

            //suggestion
            //we saved statistic calculation into a scope so that we dont have infinite digest cycle
            $scope._suggest_main_name = null;
            $scope._suggest_main_crv = null;
            $scope._suggest_main_is_taxable = null;
            $scope._suggest_main_price = null;
            $scope._suggest_main_cost = null;
            $scope._suggest_extra_name = null;
            $scope._suggest_extra_crv = null;
            $scope._suggest_extra_is_taxable = null;
            $scope._suggest_extra_price = null;
            $scope._suggest_extra_cost = null;
            if($scope.suggest_product !== null){
                $scope._suggest_main_name = $scope.suggest_product.get_suggest_main('name');
                $scope._suggest_main_crv = $scope.suggest_product.get_suggest_main('crv');
                $scope._suggest_main_is_taxable = $scope.suggest_product.get_suggest_main('is_taxable');
                $scope._suggest_main_price = $scope.suggest_product.get_suggest_main('price');
                $scope._suggest_main_cost = $scope.suggest_product.get_suggest_main('cost');
                $scope._suggest_extra_name = $scope.suggest_product.get_suggest_extra('name');
                $scope._suggest_extra_crv = $scope.suggest_product.get_suggest_extra('crv');
                $scope._suggest_extra_is_taxable = $scope.suggest_product.get_suggest_extra('is_taxable');
                $scope._suggest_extra_price = $scope.suggest_product.get_suggest_extra('price');
                $scope._suggest_extra_cost = $scope.suggest_product.get_suggest_extra('cost');           
            }
            $scope.get_suggest_main = function(field){
                if(field === 'name'){
                    return $scope._suggest_main_name;
                }else if(field === 'crv'){
                    return $scope._suggest_main_crv;
                }else if(field === 'is_taxable'){
                    return $scope._suggest_main_is_taxable;
                }else if(field === 'price'){
                    return $scope._suggest_main_price;
                }else if(field === 'cost'){
                    return $scope._suggest_main_cost;
                }
            }        
            $scope.get_suggest_extra = function(field){
                if(field === 'name'){
                    return $scope._suggest_extra_name;
                }else if(field === 'crv'){
                    return $scope._suggest_extra_crv;
                }else if(field === 'is_taxable'){
                    return $scope._suggest_extra_is_taxable;
                }else if(field === 'price'){
                    return $scope._suggest_extra_price;
                }else if(field === 'cost'){
                    return $scope._suggest_extra_cost;
                }
            }              
            $scope.is_no_suggestion = function(field){
                return $scope.get_suggest_main(field) === null;
            }
            $scope.is_many_suggestion = function(field){
                if($scope.suggest_product === null){
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
            $scope.duplicate_from = function(){
                search_single_sp_dlg().then(
                    function(dup_from_sp){
                        $scope.sp.name = dup_from_sp.name;
                        $scope.sp.price = dup_from_sp.price;
                        $scope.sp.crv = dup_from_sp.crv;//if this is a kit product, you have to setup kit manually
                        $scope.sp.is_taxable = dup_from_sp.is_taxable;
                        $scope.sp.cost = dup_from_sp.cost;
                        $scope.sp.is_sale_report = dup_from_sp.is_sale_report;
                        $scope.sp.p_type = dup_from_sp.p_type;
                        $scope.sp.p_tag = dup_from_sp.p_tag;
                        $scope.sp.vendor = dup_from_sp.vendor;
                        $scope.sp.buydown = dup_from_sp.buydown;
                        $scope.sp.value_customer_price = dup_from_sp.value_customer_price;
                    }
                    ,function(reason){
                        alert_service(reason);
                    }
                )
            }
            $scope.cancel = function(){
                $modalInstance.dismiss('_cancel_');
            };
            $scope.ok = function(){
                $modalInstance.close({sku:$scope.sku,sp:$scope.sp});
            };
        }
        ModalCtrl.$inject = ['$scope','$modalInstance','$filter','original_sp','suggest_product','duplicate_sp','original_sku','lookup_type_tag'];

        return function(original_sp,suggest_product,duplicate_sp,sku,is_operate_offline){
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
                    ,lookup_type_tag : function (){
                        var defer = $q.defer();
                        if(is_operate_offline){
                            defer.resolve([]);
                        }else{
                            $http({
                                url:'/sp/get_lookup_type_tag',
                                method:'GET'
                            }).then(
                                 function(data){
                                    defer.resolve(data.data);
                                }
                                ,function(reason){
                                    defer.reject(reason);
                                }
                            )                            
                        }

                        return defer.promise;
                    }                    
                }
            });
            return dlg.result;
        }   
    }]);
})