define(
[
	 'angular'
    ,'app/store_product/sp_online_searcher'
    ,'lib/ui/ui'
    //---------------
	,'app/store_product_angular_app/service/service'
    ,'app/store_product_angular_app/filters'    
    ,'lib/directive/share_directive'        
], function 
(
	 angular
    ,sp_online_searcher
    ,ui
)
{
	'use strict';
    var mod =  angular.module('store_product_app.controllers', ['store_product_app.services','store_product_app.filters','share_directive']);
    mod.controller('MainCtrl',['$scope','$http','$modal','sp_lst_float_2_strFilter','sp_info_service',function($scope,$http,$modal,sp_lst_float_2_strFilter,sp_info_service){
        //SORT
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

        //SKU SEARCH 
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

        //NAME SEARCH
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

        //SHOW SP INFO
        $scope.display_product_info = function(sp){
            var promise = sp_info_service(sp);
        }
    }]);

	return mod;
});




