define(
[
	 'angular'
    ,'app/store_product/sp_online_searcher'
    ,'lib/ui/ui'
    //---------------
	,'app/store_product_angular_app/services'
    ,'app/store_product_angular_app/filters'    
], function 
(
	 angular
    ,sp_online_searcher
    ,ui
)
{
	'use strict';
	
	var mod =  angular.module('store_product_app.controllers', ['store_product_app.services','store_product_app.filters']);

    mod.controller('SpInfoCtrl',['$scope'],function($scope){












        //STORE PRODUCT CRUD
        var sp_info_template_str =
            '<div class="modal-header">' +
                '<h3 class="modal-title">Info: {{sp}}</h3>' +
            '</div>' +

            '<div ng-model="sp" class="modal-body">' +
                '<div class="form-horizontal" >' +
                    '<div class="form-group">' +
                        '<label for="product_name_txt" class="col-sm-4 control-label" >Name:</label>' +
                        '<div class="col-sm-8">' +
                            '<input ng-disabled="is_disable_field(false)" type="text" id ="product_name_txt" value="{{sp.name||sp_duplicate.name}}">' +
                            '<input ng-hide="sp_suggest==null" type="button" id="suggest_name_btn" value="{{sp_suggest.name}}">' +                            
                        '</div>' +
                    '</div>' +

                    '<div class="form-group">' +
                        '<label for="product_price_txt" class="col-sm-4 control-label">Price:</label>' +
                        '<div class="col-sm-8">' +
                            '<input ng-disabled="is_disable_field(false)" type="text" id="product_price_txt" value="{{sp.price}}">' +
                            '<input ng-hide="suggest==null" type="button" id="suggest_price_btn" value="{{suggest.price}}">' +                                 
                        '</div>' +
                    '</div>' +

                    '<div class="form-group">' +
                        '<label for="product_crv_txt" class="col-sm-4 control-label">Crv:</label>' +
                        '<div class="col-sm-8">' +
                            '<input ng-disabled="is_disable_field(true)" type="text" id="product_crv_txt" value="{{sp.crv}}">' +
                            '<input ng-hide="suggest==null" type="button" id="suggest_crv_btn">' +     
                            '<label id="_compute_crv_lbl">{{sp | compute_sp_kit_field:\'crv\':false | currency | not_show_zero}}</label>' +                             
                        '</div>' +
                    '</div>' +

                    '<div class="form-group">' +
                        '<label for="product_taxable_check" class="col-sm-4 control-label">Taxable:</label>' +
                        '<div class="col-sm-8">' +
                            '<input ng-disabled="is_disable_field(false)" type="checkbox" id="product_taxable_check" ng-checked="{{sp.is_taxable}}">' +
                        '</div>' +
                    '</div>' +

                    '<div class="form-group">' +
                        '<label for="product_cost_txt" class="col-sm-4 control-label">Cost:</label>' +
                        '<div class="col-sm-8">' +
                            '<input ng-disabled="is_disable_field(false)" type="text" id="product_cost_txt" value="{{sp.cost}}"">' +
                            '<input ng-hide="suggest==null" type="button" id = "suggest_cost_btn">' +     
                            '<label id="_compute_cost_lbl">{{sp | compute_sp_kit_field:\'cost\':false | currency | not_show_zero}}</label>' +                             
                        '</div>' +
                    '</div>' +

                    '<div class="form-group">' +
                        '<label for="product_sale_report_check" class="col-sm-4 control-label">Sale report:</label>' +
                        '<div class="col-sm-8">' +
                            '<input ng-disabled="is_disable_field(false)" type="checkbox" id="product_sale_report_check" ng-checked={{sp.is_sale_report}}>' +
                        '</div>' +
                    '</div>' +

                    '<div class="form-group">' +
                        '<label for="product_type_txt" class="col-sm-4 control-label">Type:</label>' +
                        '<div class="col-sm-8">' +
                            '<input ng-disabled="is_disable_field(false)" type="text" id="product_type_txt" value="{{sp.p_type}}">' +
                        '</div>' +
                    '</div>' +

                    '<div class="form-group">' +
                        '<label for="product_tag_txt" class="col-sm-4 control-label">Tag:</label>' +
                        '<div class="col-sm-8">' +
                            '<input ng-disabled="is_disable_field(false)" type="text" id="product_tag_txt" value="{{sp.p_tag}}">' +
                        '</div>' +
                    '</div>' +

                    '<div class="form-group">' +
                        '<label for="product_vendor_txt" class="col-sm-4 control-label">Vendor:</label>' +
                        '<div class="col-sm-8">' +
                            '<input ng-disabled="is_disable_field(false)" type="text" id="product_vendor_txt" value="{{sp.vendor}}">' +
                        '</div>' +    
                    '</div>' +

                    '<div class="form-group">' +
                        '<label for="product_buydown_txt" class="col-sm-4 control-label">Buydown:</label>' +
                        '<div class="col-sm-8">' +
                            '<input ng-disabled="is_disable_field(true)" type="text" id="product_buydown_txt" value="{{sp.buydown}}">' +
                            '<label id="_compute_buydown_lbl">{{sp | compute_sp_kit_field:\'buydown\':false | currency | not_show_zero}}</label>' +                     
                        '</div>' +
                    '</div>' +

                    '<div class="form-group">' +
                        '<label for="product_value_customer_price_txt" class="col-sm-4 control-label">value customer price:</label>' +
                        '<div class="col-sm-8">' +
                            '<input ng-disabled="is_disable_field(false)" type="text" id="product_value_customer_price_txt" value="{{sp.value_customer_price}}">' +
                        '</div>' +
                    '</div>' +

                    '<div ng-show="sp==null" class="form-group">' +
                        '<label for="product_sku_txt" class="col-sm-4 control-label">Sku:</label>' +
                        '<div class="col-sm-8">' +
                            '<input type="text" id = "product_sku_txt">' +
                        '</div>' +
                    '</div>' +

                    '<div ng-hide="sp==null">' +
                        '<table id="group_tbl" class="table table-hover table-bordered table-condensed table-striped table-side-by-side"></table>' +
                        '<table id="kit_tbl" class="table table-hover table-bordered table-condensed table-striped table-side-by-side"></table>' +                    
                    '</div>' +
                '</div>' +
            '</div>' +                  


            '<div class="modal-footer">' +
                '<button ng-show="sp!=null && is_display_only"class="btn btn-primary btn-float-left" ng-click="edit()">edit</button>' +            
                '<button class="btn btn-warning" ng-click="exit()">exit</button>' +
            '</div>'
        ;      

        var SpCrudCtrl = function($scope,$modalInstance,sp,is_display_only,suggest_sp,duplicate_sp){
            $scope.sp = sp;
            $scope.is_display_only = is_display_only;
            $scope.suggest_sp = suggest_sp;
            $scope.duplicate_sp = duplicate_sp;

            $scope.is_disable_field = function(is_kit_related_field){
                if($scope.is_display_only){
                    return true;
                }else if(is_kit_related_field){
                    return $scope.sp.breakdown_assoc_lst.length != 0;
                }
            }

            $scope.edit = function(){
                $scope.sp_crud($scope.sp,false/*we are editing this sp*/,null/*suggest_sp*/,null/*duplicate_sp*/);
            }
            $scope.exit = function(){
                $modalInstance.dismiss('cancel');
            }
            $scope.ok = function(){
                $modalInstance.close($scope.sp);
            }
        }

        $scope.sp_crud = function(sp,is_display_only,suggest_sp,duplicate_sp){
            var dlg = $modal.open({
                template: sp_info_template_str,
                controller: SpCrudCtrl,
                scope:$scope,
                size: 'lg',
                resolve : {
                     sp : function(){return sp}
                    ,is_display_only : function(){return is_display_only}
                    ,suggest_sp : function(){return suggest_sp}
                    ,duplicate_sp : function(){return duplicate_sp}
                }
            });
            dlg.result.then(
                function(sp){
                    alert('return sp : ' + sp);
                },
                function(){

                }
            );
        }   












    });


    //MAIN PRODUCT SEARCH PAGE CTRL
    mod.controller('ProductCtrl',['$scope','$http','$modal','sp_lst_float_2_strFilter' ,function($scope,$http,$modal,sp_lst_float_2_strFilter){

        //PRODUCT PAGE SORT --------------------------------------------------------------------------------------------------------
        $scope.cur_sort_column = 'name';
        $scope.cur_sort_desc = false;
        $scope.column_click = function(column_name){
            if($scope.cur_sort_column == column_name){
                $scope.cur_sort_desc = !$scope.cur_sort_desc;
            }else{
                $scope.cur_sort_column = column_name;
                $scope.cur_sort_desc = false;
            }
        }
        $scope.get_sort_class = function(column_name){
            if(column_name == $scope.cur_sort_column){
                return "glyphicon glyphicon-arrow-" + ($scope.cur_sort_desc ? 'down' : 'up');
            }else{
                return '';
            }
            
        }

        //PRODUCT PAGE SEARCH --------------------------------------------------------------------------------------------------------
        $scope.sp_lst = [];
        $scope.sku_search = function(){
            $scope.name_search_str = "";
            $scope.sku_search_str = $scope.sku_search_str.trim().toLowerCase();

            var result = sp_online_searcher.sku_search_angular($scope.sku_search_str,$http);
            var error = result.error;
            if(error){
                if(error == sp_online_searcher.SKU_SEARCH_ERROR_EMPTY){
                    $scope.sp_lst = [];
                }else if(error == sp_online_searcher.SKU_SEARCH_ERROR_CONTAIN_SPACE){
                    ui.angular_alert($modal,'error!','sku can not contain space.',3);
                }else{
                    ui.angular_alert($modal,'error!',error,4);
                }
                return;
            }

            var promise = result.promise;
            promise.success(function(data, status, headers, config){
                $scope.sp_lst = sp_lst_float_2_strFilter(data['prod_store__prod_sku__1_1']);
                if($scope.sp_lst.length == 0){
                    ui.angular_alert($modal,'under construction','no result, product creator to be implemented',2);
                }                            
            });
            promise.error(function(data, status, headers, config){
                ui.angular_alert($modal,'error!','ajax error!',4);
            });
        }

        $scope.name_search = function(){
            $scope.sku_search_str = "";
            $scope.name_search_str = $scope.name_search_str.trim();
            
            var result = sp_online_searcher.name_search_angular($scope.name_search_str,$http);
            var error = result.error;
            if(error){
                if(error == sp_online_searcher.NAME_SEARCH_ERROR_EMPTY){
                    $scope.sp_lst = [];
                }else if(error == sp_online_searcher.NAME_SEARCH_ERROR_2_WORDS_MAX){
                    ui.angular_alert($modal,'error!','2 words search maximum.',3);
                }else{
                    ui.angular_alert($modal,'error!',error,4);
                }
                return;
            }

            var promise = result.promise;
            promise.success(function(data, status, headers, config){
                if(data.length == 0){
                    ui.angular_alert($modal,'info','no result found for ' + '"' + $scope.name_search_str + '"',2);
                }else{
                    $scope.sp_lst = sp_lst_float_2_strFilter(data);
                }                                
            });
            promise.error(function(data, status, headers, config){
                ui.angular_alert($modal,'error!','ajax error!',4);
            });
        }
    }]);

	return mod;
});




