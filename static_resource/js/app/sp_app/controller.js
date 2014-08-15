define(
[
	 'angular'
    //---------------
	,'app/sp_app/service/info'
    ,'app/sp_app/service/create'
    ,'app/sp_app/service/duplicate'    
    ,'app/sp_app/filter'    
    ,'directive/share_directive'    
    ,'service/ui'
    ,'service/db'
    ,'app/sp_app/service/convert'
    ,'app/sp_app/service/api'
    ,'blockUI'
], function 
(
	 angular
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
        'service/db',
        'sp_app/service/convert',
        'sp_app/service/api',
        'blockUI'
    ]);

    mod.controller('MainCtrl',
    [
        '$scope',
        '$filter',
        '$window',
        'sp_app/service/info',
        'sp_app.service.create',
        'sp_app.service.duplicate',
        'service.ui.alert',
        'service.ui.confirm',
        'sp_app/service/convert/lst',
        'sp_app/service/api',
        'service/db/is_db_exist',
        'blockUI',

    function(
        $scope,
        $filter,
        $window,
        sp_info_service,
        create_service,
        duplicate_service,
        alert_service,
        confirm_service,
        convert_sp_lst,
        api,
        is_db_exist,
        blockUI
    ){
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

        function launch_pos_url(){
            $window.open('sale/index_angular/');
        }

        $scope.launch_pos = function(){
            is_db_exist(STORE_ID).then(
                 function(is_db_exist){
                    if(is_db_exist){
                        launch_pos_url();
                    }else{
                        confirm_service('you are about to download your product database offline. continue?').then(function(){
                            launch_pos_url()
                        });
                    }
                 }
                ,function(reason){alert_service('alert',reason,'red')}
            )
        }
    }]);
    return mod;
});




