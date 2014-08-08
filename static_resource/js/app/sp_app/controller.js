define(
[
	 'angular'
    ,'app/store_product/sp_online_searcher'
    ,'lib/ui/ui'
    //---------------
	,'app/sp_app/service/info'
    ,'app/sp_app/service/create'
    ,'app/sp_app/service/duplicate'    
    ,'app/sp_app/filter'    
    ,'directive/share_directive'    
    ,'service/ui'
    ,'app/sp_app/service/convert'
    ,'app/sp_app/service/api'
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
        'sp_app/service/info',
        'sp_app.service.create',
        'sp_app.service.duplicate',
        'sp_app.filter',
        'share_directive',
        'service.ui',
        'sp_app/service/convert',
        'sp_app/service/api'
    ]);

    mod.controller('MainCtrl',
    [
        '$scope',
        '$http',
        '$modal',
        '$filter',
        'sp_app/service/info',
        'sp_app.service.create',
        'sp_app.service.duplicate',
        'service.ui.alert',
        'sp_app/service/convert/lst',
        'sp_app/service/api',
    function(
        $scope,
        $http,
        $modal,
        $filter,
        sp_info_service,
        create_service,
        duplicate_service,
        alert_service,
        convert_sp_lst,
        api
    ){
        // $scope.local_filter= ""

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
            $scope.local_filter = "";
            $scope.sku_search_str = $scope.sku_search_str.trim().toLowerCase();

            if($scope.sku_search_str.length == 0){
                $scope.sp_lst = [];
                return;
            }
            
            api.sku_search($scope.sku_search_str).then(
                function(data){
                    $scope.sp_lst = data.prod_store__prod_sku__1_1;
                    if($scope.sp_lst.length == 0){
                        var promise = create_service(data.prod_store__prod_sku__0_0,data.prod_store__prod_sku__1_0,$scope.sku_search_str).then
                        (
                             function(created_sp){ 
                                $scope.sp_lst = [created_sp];
                            }
                            ,function(reason){alert_service('alert',reason,'red');}
                        );
                    } 
                }
                ,function(reason){ alert_service('alert',reason,'red') }
            )
        }

        //NAME SEARCH
        $scope.name_search = function(){
            $scope.sku_search_str = "";
            $scope.local_filter = "";
            $scope.name_search_str = $scope.name_search_str.trim();
            
            if($scope.name_search_str.length == 0){
                $scope.sp_lst = [];
                return;
            }

            api.name_search($scope.name_search_str).then(
                function(data){
                    $scope.sp_lst = data;
                    if(data.length == 0){ alert_service('info','no result found for ' + '"' + $scope.name_search_str + '"','blue');}
                }
                ,function(reason){ alert_service('alert',reason,'red'); }
            )
        }

        //SHOW SP INFO
        $scope.display_product_info = function(sp){
            sp_info_service(sp).then(
                function(data){
                    if(typeof(data) == 'string' && data == 'duplicate'){
                        duplicate_service(sp).then
                        (
                             function(data){ $scope.sp_lst=[data]; }
                            ,function(reason){ alert_service('alert',reason,'red');}
                        )
                    }
                }
                ,function(reason){ alert_service('alert',reason,'red');}
            )
        }
    }]);

	return mod;
});




