define(
[
     'angular'
    //--------
    ,'app/sale_app/service/scan/preprocess'
    ,'app/sale_app/service/scan/append_pending_scan'
    ,'app/sale_app/service/scan/get_pending_scan'
    ,'app/sale_app/service/scan/calculate_displaying_scan'
    ,'app/shortcut_app/shortcut_ui'
    ,'service/ui'
], function
(
     angular
)
{
    'use strict';
    var MY_SHORTCUT_LST = SHORTCUT_LST;
    
    var mod =  angular.module('sale_app/controller', 
    [
         'sale_app/service/scan/preprocess'
        ,'sale_app/service/scan/append_pending_scan'
        ,'sale_app/service/scan/get_pending_scan'
        ,'sale_app/service/scan/calculate_displaying_scan'
        ,'shortcut_app/shortcut_ui_new'
        ,'service/ui'
    ]);
    mod.controller('MainCtrl', 
    [
         '$scope'
        ,'sale_app/service/scan/preprocess'
        ,'sale_app/service/scan/append_pending_scan'
        ,'sale_app/service/scan/get_pending_scan'
        ,'sale_app/service/scan/calculate_displaying_scan'
        ,'shortcut_app/shortcut_ui_new'
        ,'service/ui/alert'
    ,function(
         $scope
        ,preprocess
        ,append_pending_scan
        ,get_pending_scan
        ,calculate_ds
        ,shortcut_ui_new
        ,alert_service
    ){
        var ui_instance = shortcut_ui_new($scope,MY_SHORTCUT_LST);

        $scope.exe_shortcut_child = function(row,col){
            alert(row + ', ' + col);
        }
        $scope.get_ds = function(){
            calculate_ds(get_pending_scan(),null/*mm_lst*/).then(
                 function(data){$scope.ds_lst = data;}
                ,function(reason){alert_service('alert',reason,'red');}
            )            
        }
        $scope.sku_search = function(){
            $scope.sku_search_str = $scope.sku_search_str.trim();
            preprocess($scope.sku_search_str).then(
                function(data){
                    append_pending_scan(data.sp.product_id,null/*non product name*/,data.qty,null/*overide price*/);
                    $scope.get_ds();
                }
                ,function(reason){ alert_service('alert',reason,'red');}
            )
        }
        //init code
        $scope.get_ds();
    }]);
});
