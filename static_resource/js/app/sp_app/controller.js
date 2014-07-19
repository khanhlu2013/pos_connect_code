define(
[
	 'angular'
    ,'app/store_product/sp_online_searcher'
    ,'lib/ui/ui'
    //---------------
	,'app/sp_app/service/edit/entry'
    ,'app/sp_app/service/create'
    ,'app/sp_app/service/duplicate'    
    ,'app/sp_app/filter'    
    ,'directive/share_directive'    
    ,'service/ui'
], function 
(
	 angular
    ,sp_online_searcher
    ,ui
)
{
	'use strict';
    var mod =  angular.module('sp_app.controller', 
    [
        'sp_app.service.edit.entry',
        'sp_app.service.create',
        'sp_app.service.duplicate',
        'sp_app.filter',
        'share_directive',
        'service.ui',
    ]);

    mod.controller('MainCtrl',
    [
        '$scope',
        '$http',
        '$modal',
        '$filter',
        'sp_app.service.edit.entry',
        'sp_app.service.create',
        'sp_app.service.duplicate',
        'service.ui.alert',
    function(
        $scope,
        $http,
        $modal,
        $filter,
        sp_info_service,
        create_service,
        duplicate_service,
        alert_service
    ){
        $scope.currentPage = 1;

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
                $scope.sp_lst = $filter('sp_lst_str_2_float')(data['prod_store__prod_sku__1_1']);
                if($scope.sp_lst.length == 0){
                    var prod_store__prod_sku__0_0 = data['prod_store__prod_sku__0_0']
                    var prod_store__prod_sku__1_0 = data['prod_store__prod_sku__1_0']

                    var promise = create_service(prod_store__prod_sku__0_0,prod_store__prod_sku__1_0,$scope.sku_search_str);
                    promise.then(
                        function(data){
                            $scope.sp_lst = [data];
                        },
                        function(reason){
                            alert_service('alert',reason,'red');
                        }
                    );
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
                    $scope.sp_lst = $filter('sp_lst_str_2_float')(data);
                }                                
            });
            promise.error(function(data, status, headers, config){
                ui.angular_alert($modal,'error!','ajax error!',4);
            });
        }

        //SHOW SP INFO
        $scope.display_product_info = function(sp){
            var promise = sp_info_service(sp);
            promise.then(
                function(data){
                    if(typeof(data) == 'string' && data == 'duplicate'){
                        var promise = duplicate_service(sp);
                        promise.then
                        (
                            function(data){
                                $scope.sp_lst=[data];
                            },
                            function(reason){
                                alert_service('alert',reason,'red');
                            }
                        )
                    }
                },
                function(reason){
                    alert_service('alert',reason,'red');
                }
            )
        }
    }]);

	return mod;
});




