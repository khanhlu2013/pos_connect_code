define(
[
     'angular'
    //---------------
    ,'app/sp_app/service/info'
    ,'app/sp_app/service/create'
    ,'app/sp_app/service/duplicate'    
    ,'filter/filter'    
    ,'directive/share_directive'    
    ,'service/ui'
    ,'app/sp_app/service/api/search'
    ,'service/db'
    ,'app/group_app/service/manage'
], function 
(
     angular
)
{
    'use strict';
    var mod =  angular.module('sp_app.controller', 
    [
         'sp_app/service/info'
        ,'sp_app/service/create'
        ,'sp_app/service/duplicate'
        ,'filter'
        ,'directive/share_directive'
        ,'service/ui'
        ,'sp_app/service/api/search'
        ,'service/db'
        ,'group_app/service/manage'
    ]);

    mod.controller('MainCtrl',
    [
         '$window'
        ,'$scope'
        ,'$rootScope'
        ,'$filter'
        ,'sp_app/service/info'
        ,'sp_app/service/create'
        ,'sp_app/service/duplicate'
        ,'service/ui/alert'
        ,'service/ui/confirm'
        ,'sp_app/service/api/search'
        ,'blockUI'
        ,'service/db/is_pouch_exist'
        ,'group_app/service/manage'
    ,function(
         $window
        ,$scope
        ,$rootScope
        ,$filter
        ,sp_info_service
        ,create_service
        ,duplicate_service
        ,alert_service
        ,confirm_service
        ,search_api
        ,blockUI
        ,is_pouch_exist
        ,manage_group_service
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
            search_api.sku_search($scope.sku_search_str).then(
                function(data){
                    $scope.sp_lst = data.prod_store__prod_sku__1_1;
                    if($scope.sp_lst.length == 0){
                        var promise = create_service(data.prod_store__prod_sku__0_0,data.prod_store__prod_sku__1_0,$scope.sku_search_str).then
                        (
                             function(created_sp){ 
                                $scope.sp_lst = [created_sp];
                            }
                            ,function(reason){
                                alert_service(reason);
                            }
                        );
                    } 
                }
                ,function(reason){ 
                    alert_service(reason) 
                }
            )
        }
        //NAME SEARCH
        $scope.name_search = function(search_by){
            /*
                EXPLAIN is_programmatically_call

                    There are 2 way the user can call this method: either enter on the search box, or scroll down to the end. 
                        . if we scroll down in the search box, name search str will be the same and thus we going to get the next page
                        . if we hit enter in the search box, with a same name, we will also go to the next page. (WE NEED TO FIX THIS BY DOING NOTHING)

                    There is 1 way the code will call this method: after group execution, the code will call this method with the same name (if we are currently search by name)
                        . in this case we want to reset the whole thing to refresh all data.


            */
            
            if($scope.name_search_busy === true){
                return;
            }

            $scope.sku_search_str = "";
            $scope.local_filter = "";
            $scope.name_search_str = $scope.name_search_str.trim();
            
            if($scope.name_search_str.length === 0){
                $scope.sp_lst = [];
                return;
            }
            var after = null;
            if($scope.old_name_search_str === null){
                //first time search, we will init the search
                after = 0;
                $scope.sp_lst = [];
                $scope.old_name_search_str = $scope.name_search_str;
                $scope.name_search_reach_the_end = false;
            }else{//this is not the first time search
                if($scope.old_name_search_str !== $scope.name_search_str){
                    //if search str is different than previous search, we will init the search
                    after = 0;
                    $scope.sp_lst = [];
                    $scope.old_name_search_str = $scope.name_search_str;
                    $scope.name_search_reach_the_end = false;
                }else{
                    //the search str is the same
                    if(search_by === 'user'){
                        return;
                    }else if(search_by === 'infinite_scroll'){
                        if($scope.name_search_reach_the_end){
                            return;
                        }else{
                            after = $scope.sp_lst.length;
                        }                        
                    }else if(search_by === 'code'){
                        //if search str is different than previous search, we will init the search
                        after = 0;
                        $scope.sp_lst = [];
                        $scope.old_name_search_str = $scope.name_search_str;
                        $scope.name_search_reach_the_end = false;                        
                    }
                }
            }
            $scope.name_search_busy = true;
            search_api.name_search($scope.name_search_str,after).then(
                function(data){
                    if(data.length === 0){
                        $scope.name_search_reach_the_end = true;
                    }else{
                        for(var i = 0;i<data.length;i++){
                            $scope.sp_lst.push(data[i]);
                        }                        
                    }

                    if($scope.sp_lst.length == 0){ 
                        alert_service('no result found for ' + '"' + $scope.name_search_str + '"','info','blue');
                    }else{
                        $scope.is_blur_name_search_text_box = true;
                    }
                    $scope.name_search_busy = false;
                }
                ,function(reason){ 
                    alert_service(reason); 
                }
            )
        }
        //SHOW SP INFO
        $scope.display_product_info = function(sp){
            sp_info_service(sp).then(
                function(data){
                    if(typeof(data) == 'string' && data == 'duplicate'){
                        duplicate_service(sp).then
                        (
                            function(data){ 
                                $scope.sp_lst=[data]; 
                            }
                            ,function(reason){ 
                                alert_service(reason);
                            }
                        )
                    }
                }
                ,function(reason){ 
                    alert_service(reason);
                }
            )
        }
        function launch_pos_url(){
            $window.open('sale/index_angular/');
        }
        $scope.launch_pos = function(){
            is_pouch_exist().then(
                 function(db_exitance){
                    if(db_exitance){
                        confirm_service('launch pos?').then(function(){
                            launch_pos_url();
                        });                        
                    }else{
                        confirm_service('first time download database. continue?').then(function(){
                            launch_pos_url();
                        });
                    }
                 }
                ,function(reason){
                    alert_service(reason)
                }
            )
        }
        $scope.menu_setting_group_in_sp_page = function(){
            manage_group_service().then(
                function(){
                    if($scope.name_search_str.length !== 0){
                        $scope.name_search('code');
                    }else if($scope.sku_search_str.length !== 0){
                        $scope.sku_search();
                    }
                }
                ,function(reason){
                    alert_service(reason);
                }
            );
        }

        $scope.name_search_reach_the_end = false;
        $scope.name_search_str = '';
        $scope.is_blur_name_search_text_box = false;
        $scope.name_search_busy = false;
        $scope.old_name_search_str = null;
    }]);
    return mod;
});




