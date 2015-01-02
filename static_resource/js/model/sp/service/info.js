define(
[
	'angular'
    //---
    ,'filter/filter'    
    ,'service/ui'
    ,'model/sp/service/edit/group'
    ,'model/sp/service/edit/report'    
    ,'model/sp/service/edit/kit'   
    ,'model/sp/service/edit/sku'      
    ,'model/sp/service/edit/sp'       
    ,'model/sp/api_search'
    ,'model/product/network_product_api'
    ,'model/product/network_product_module'

]
,function
(
	angular
)
{
    var mod = angular.module('sp/service/info',
    [
         'filter'
        ,'service/ui'        
        ,'sp/service/edit/group'
        ,'sp/service/edit/report'         
        ,'sp/service/edit/kit'
        ,'sp/service/edit/sp'
        ,'sp/service/edit/sku'
        ,'sp/api_search'
        ,'sp/network_product_api'
        ,'product/network_product'
    ]);
    
    mod.factory('sp/service/info',
    [
         '$modal'
        ,'sp/service/edit/group'
        ,'sp/service/edit/report'        
        ,'sp/service/edit/kit'
        ,'sp/service/edit/sp'
        ,'sp/service/edit/sku'
        ,'sp/api_search'
        ,'service/ui/alert'
        ,'sp/network_product_api'
    ,function (
         $modal
        ,edit_group
        ,edit_report
        ,edit_kit
        ,edit_sp
        ,edit_sku
        ,search_api
        ,alert_service
        ,network_product_api
    ){
        var main_tab = 
            '<tab id="sp_app/service/info/tab/product" heading="product" select="switch_tab(\'product\')">' +
                '<h1></h1>' +
                '<div class="form-horizontal" >' +
                    '<div class="form-group">' +
                        '<label class="col-sm-4 control-label">Name:</label>' +
                        '<p class="col-sm-8 form-control-static">{{sp.name}}</p>' +
                    '</div>' +

                    '<div class="form-group">' +                            
                        '<label class="col-sm-4 control-label">Price:</label>' +
                        '<p class="col-sm-8 form-control-static">{{sp.price | currency}}</p>' +
                    '</div>' +

                    '<div class="form-group">' +
                        '<label class="col-sm-4 control-label">Crv:</label>' +
                        '<p class="col-sm-8 form-control-static">{{sp.get_crv()|currency}}</p>' +
                    '</div>' +

                    '<div class="form-group">' +
                        '<label class="col-sm-4 control-label">Taxable:</label>' +
                        '<p class="form-control-static col-sm-8">' +
                            '<span class="glyphicon" ng-class="sp.is_taxable ? \'glyphicon-check\' : \'glyphicon-unchecked\'"></span>' +
                        '</p>' +
                    '</div>' +

                    '<div class="form-group">' +
                        '<label class="col-sm-4 control-label">Cost:</label>' +
                        '<p class="col-sm-8 form-control-static">{{sp.get_cost()|currency}}<span ng-show="$parent.sp.get_markup()!== null && $parent.sp.get_markup()!== NaN"> (mark up:{{$parent.sp.get_markup()}}%)</span></p>' +
                    '</div>' +

                    '<hr>' +

                    '<div class="form-group">' +
                        '<label class="col-sm-4 control-label">Sale report:</label>' +
                        '<p class="form-control-static col-sm-8">' +
                            '<span class="glyphicon" ng-class="sp.is_sale_report ? \'glyphicon-check\' : \'glyphicon-unchecked\'"></span>' +
                        '</p>' +
                    '</div>' +

                    '<div class="form-group">' +
                        '<label class="col-sm-4 control-label">Type:</label>' +
                        '<p class="col-sm-8 form-control-static">{{sp.p_type}}</p>' +
                    '</div>' +

                    '<div class="form-group">' +                            
                        '<label class="col-sm-4 control-label">Tag:</label>' +
                        '<p class="col-sm-8 form-control-static">{{sp.p_tag}}</p>' +
                    '</div>' +

                    '<div class="form-group">' +                                   
                        '<label class="col-sm-4 control-label">Vendor:</label>' +
                        '<p class="col-sm-8 form-control-static">{{sp.vendor}}</p>' +
                    '</div>' +

                    '<div class="form-group">' +                               
                        '<label class="col-sm-4 control-label">Buydown:</label>' +
                        '<p class="col-sm-8 form-control-static">{{sp.get_buydown()|currency}}</p>' +
                    '</div>' +

                    '<div class="form-group">' +                               
                        '<label class="col-sm-4 control-label">Value customer price:</label>' +
                        '<p class="col-sm-8 form-control-static">{{sp.value_customer_price|currency}}</p>' +
                    '</div>' +

                '</div>' + /* end form horizontal*/
            '</tab>' 
        ;        
        var group_tab = 
            '<tab id="sp_app/service/info/tab/group" heading="group" select="switch_tab(\'group\')">' +
                '<h1></h1>' +
                '<table ng-hide="sp.group_lst.length==0" class="table table-hover table-bordered table-condensed table-striped">' +
                    '<tr>' +
                        '<th>group</th>' +                
                    '</tr>' +    
                    '<tr ng-repeat="group_info in sp.group_lst">' +
                        '<td>{{group_info.name}}</td>' +                    
                    '</tr>' +                                                  
                '</table>' +      
                '<pre ng-show="sp.group_lst.length==0">there is no group</pre>' +         
            '</tab>' 
        ;   
        var report_tab = 
            '<tab id="sp_app/service/info/tab/report" heading="custom report" select="switch_tab(\'report\')">' +
                '<h1></h1>' +
                '<table ng-hide="sp.report_lst.length==0" class="table table-hover table-bordered table-condensed table-striped">' +
                    '<tr>' +
                        '<th>report</th>' +                
                    '</tr>' +    
                    '<tr ng-repeat="report_info in sp.report_lst">' +
                        '<td>{{report_info.name}}</td>' +                    
                    '</tr>' +                                                  
                '</table>' +      
                '<pre ng-show="sp.report_lst.length==0">there is no custom report</pre>' +         
            '</tab>' 
        ;               
        var kit_tab = 
            '<tab id="sp_app/service/info/tab/kit" heading="kit" select="switch_tab(\'kit\')">' +
                '<h1></h1>' +
                '<table ng-hide="sp.breakdown_assoc_lst.length==0" class="table table-hover table-bordered table-condensed table-striped">' +
                    '<tr>' +
                        '<th>kit</th>' +              
                        '<th>qty</th>' +  
                    '</tr>' +
                    '<tr ng-repeat="assoc_info in sp.breakdown_assoc_lst | orderBy : \'breakdown.name\'">' +
                        '<td>{{assoc_info.breakdown.name}}</td>' +      
                        '<td>{{assoc_info.qty}}</td>' +                                                  
                    '</tr>' +                         
                '</table>' +  
                '<pre ng-show="sp.breakdown_assoc_lst.length==0">there is no kit</pre>' +                 
            '</tab>'
        ;            
        var sku_tab = 
            '<tab id="sp_app/service/info/tab/sku" heading="sku" select="switch_tab(\'sku\')">' +
                '<h1></h1>' +
                '<table ng-show="sp.get_my_sku_assoc_lst().length != 0" class="table table-hover table-bordered table-condensed table-striped">' +
                    '<tr>' +
                        '<th>sku</th>' +              
                    '</tr>' +
                    '<tr ng-repeat="sku_assoc_info in sp.get_my_sku_assoc_lst() | orderBy:\'sku_str\'">' +
                        '<td>{{sku_assoc_info.sku_str}}</td>' +      
                    '</tr>' +
                '</table>' +  
                '<pre ng-show="sp.get_my_sku_assoc_lst().length == 0">there is no sku</pre>' +                 
            '</tab>' 
        ;       
        var inventory_tab = 
            '<tab id="sp_app/service/info/tab/inventory" heading="purchase history" select="switch_tab(\'inventory\')">' +
                '<h1></h1>' +
                '<h1>purchase history:under construction</h1>' +                
            '</tab>' 
        ;         
        var network_info_tab = 
            '<tab id="sp_app/service/info/tab/network_product" heading="network info" select="switch_tab(\'network_product\')">' +
                '<h1></h1>' +
                '<button id="sp_app/service/info/tab/network_product/get_btn" class="btn btn-primary" ng-click="get_network_info()">get info</button>' +    
                '<div id="sp/info/network_product" ng-hide="network_product === null" ng-controller="product/network_product/controller" ng-include="$root.GLOBAL_SETTING.PARTIAL_URL.product.network_product.index"></div>' +
            '</tab>'
        ;                  
        var template =
            '<div id="sp_app/service/info/dialog" class="modal-header">' +
                '<h3 class="modal-title">Info: {{sp.name}}</h3>' +
            '</div>' +

            '<div class="modal-body">' +
                '<tabset>' +
                    main_tab +
                    group_tab +
                    kit_tab +    
                    sku_tab +       
                    inventory_tab + 
                    report_tab +                    
                    network_info_tab +                                                 
                '</tabset>' +
            '</div>' + /* end modal body*/

            '<div class="modal-footer">' +
                '<button ng-hide="cur_tab===\'network_product\'" id="sp_app/service/info/edit_btn" class="btn btn-primary btn-float-left" ng-click="edit()">edit {{cur_tab}}</button>' +
                '<button id="sp_app/service/info/duplicate_btn" ng-click="duplicate()" ng-show="cur_tab==\'product\'" class="btn btn-primary btn-float-left" ng-click="duplicate()">duplicate</button>' +
                '<button id="sp_app/service/info/exit_btn" class="btn btn-warning" ng-click="exit()">exit</button>' +
            '</div>'
        ;      

        var ModalCtrl = function($scope,$modalInstance,sp,GLOBAL_SETTING){
            $scope.sp = sp;
            $scope.cur_tab = "product";

            $scope.edit = function(){
                if($scope.cur_tab == 'product'){
                    edit_sp($scope.sp,GLOBAL_SETTING).then(
                        function(updated_sp){ 
                            angular.copy(updated_sp,$scope.sp); 
                        }
                        ,function(reason){ 
                            alert_service(reason); 
                        }
                    )
                }else if($scope.cur_tab == 'group'){
                    edit_group($scope.sp);
                }else if($scope.cur_tab == 'report'){
                    edit_report($scope.sp);
                }else if($scope.cur_tab == 'kit'){
                    edit_kit($scope.sp,GLOBAL_SETTING).then(
                        function(updated_sp){ 
                            angular.copy(updated_sp,$scope.sp); 
                        }
                        ,function(reason){ 
                            alert_service(reason); 
                        }
                    )
                }else if($scope.cur_tab == 'sku'){
                    edit_sku($scope.sp,GLOBAL_SETTING);
                }
            }
            $scope.get_network_info = function(){
                network_product_api($scope.sp.product_id).then(
                    function(product){
                        $scope.$broadcast('network_product_is_updated',product);
                    },function(reason){
                        alert_service(reason);
                    }
                )
            }
            $scope.switch_tab = function(name){
                $scope.cur_tab = name;
            }
            $scope.exit = function(){
                $modalInstance.close($scope.sp);
            }
            $scope.duplicate = function(){
                $modalInstance.dismiss('_duplicate_');
            }
        }
        ModalCtrl.$inject = ['$scope','$modalInstance','sp','GLOBAL_SETTING'];

        return function(sp,GLOBAL_SETTING){
            var dlg = $modal.open({
                template: template,
                controller: ModalCtrl,
                size: 'lg',
                resolve : { 
                    sp : function(){
                        if(sp.is_instantiate_offline()){ 
                            return search_api.product_id_search(sp.product_id); 
                        }
                        else{ 
                            return sp; 
                        }
                    }
                    ,GLOBAL_SETTING: function(){
                        return GLOBAL_SETTING
                    }
                }
            });
            return dlg.result;
        } 
    }]);	
})