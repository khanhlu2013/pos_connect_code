define(
[
     'angular'
    //--------
    ,'app/sale_app/service/scan/preprocess'
    ,'app/sale_app/service/scan/append_pending_scan'
    ,'app/sale_app/service/scan/get_pending_scan'
    ,'app/sale_app/service/scan/calculate_displaying_scan'
    ,'app/sale_app/service/search/name_sku_dlg'
    ,'app/shortcut_app/shortcut_ui'
    ,'service/ui'
    ,'lib/ngStorage'

], function
(
     angular
)
{
    'use strict';
    
    var mod =  angular.module('sale_app/controller', 
    [
         'sale_app/service/scan/preprocess'
        ,'sale_app/service/scan/append_pending_scan'
        ,'sale_app/service/scan/get_pending_scan'
        ,'sale_app/service/scan/calculate_displaying_scan'
        ,'sale_app/service/search/name_sku_dlg'
        ,'shortcut_app/shortcut_ui'
        ,'service/ui'
        ,'ngStorage'
    ]);
    mod.controller('MainCtrl', 
    [
         '$scope'
        ,'sale_app/service/scan/preprocess'
        ,'sale_app/service/scan/append_pending_scan'
        ,'sale_app/service/scan/get_pending_scan'
        ,'sale_app/service/scan/calculate_displaying_scan'
        ,'sale_app/service/search/name_sku_dlg'
        ,'shortcut_app/shortcut_ui'
        ,'service/ui/alert'
        ,'$localStorage'
    ,function(
         $scope
        ,preprocess
        ,append_pending_scan
        ,get_pending_scan
        ,calculate_ds
        ,search_name_sku_dlg
        ,shortcut_ui
        ,alert_service
        ,$localStorage
    ){
        shortcut_ui.init($scope);    
        // $scope.$watchGroup(
        //     [
        //          function(){return $localStorage.pending_scan_lst}
        //         //,we will need to add mm list here
        //     ]
        //     ,$scope.refresh_ds
        // )
        $scope.void = function(){

        }
        $scope.exe_shortcut_child = function(row,col){
            var child_shortcut = shortcut_ui.get_child_of_cur_parent(row,col,$scope);
            if(child_shortcut == null){ return; }
            append_pending_scan(child_shortcut.store_product.product_id,1/*qty*/,null/*non product name*/,null/*override price*/)
            // $scope.refresh_ds();
        }
        $scope.refresh_ds = function(){
            calculate_ds(get_pending_scan(),null/*mm_lst*/).then(
                 function(data){$scope.ds_lst = data;}
                ,function(reason){alert_service('alert',reason,'red');}
            )            
        }
        $scope.sku_scan = function(){
            $scope.sku_search_str = $scope.sku_search_str.trim();
            preprocess($scope.sku_search_str).then(
                function(data){
                    append_pending_scan(data.sp.product_id,data.qty,null/*non product name*/,null/*override price*/);
                    // $scope.refresh_ds();
                }
                ,function(reason){ alert_service('alert',reason,'red');}
            )
        }
        $scope.search = function(){
            search_name_sku_dlg();
        }

        //init code        
    
        $scope.refresh_ds();
    }]);
});
