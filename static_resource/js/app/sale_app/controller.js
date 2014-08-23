define(
[
     'angular'
    //--------
    ,'app/sale_app/service/scan/preprocess'
    ,'app/sale_app/service/scan/append_pending_scan'
    ,'app/sale_app/service/pending_scan/get_ps_lst'
    ,'app/sale_app/service/scan/calculate_displaying_scan'
    ,'app/sale_app/service/search/name_sku_dlg'
    ,'app/sale_app/service/pending_scan/set_ps_lst'
    ,'app/sale_app/service/displaying_scan/modify_ds'
    ,'app/sale_app/service/displaying_scan/info_dlg'
    ,'app/shortcut_app/shortcut_ui'
    ,'service/ui'

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
        ,'sale_app/service/pending_scan/get_ps_lst'
        ,'sale_app/service/scan/calculate_displaying_scan'
        ,'sale_app/service/search/name_sku_dlg'
        ,'sale_app/service/pending_scan/set_ps_lst'
        ,'sale_app/service/displaying_scan/modify_ds'
        ,'sale_app/service/displaying_scan/info_dlg'
        ,'sale_app/model'
        ,'shortcut_app/shortcut_ui'
        ,'service/ui'
    ]);
    mod.controller('MainCtrl', 
    [
         '$scope'
        ,'$rootScope'
        ,'sale_app/service/scan/preprocess'
        ,'sale_app/service/scan/append_pending_scan'
        ,'sale_app/service/pending_scan/get_ps_lst'
        ,'sale_app/service/scan/calculate_displaying_scan'
        ,'sale_app/service/search/name_sku_dlg'
        ,'sale_app/service/pending_scan/set_ps_lst'
        ,'sale_app/model/Modify_ds_instruction'
        ,'sale_app/service/displaying_scan/modify_ds'
        ,'sale_app/service/displaying_scan/info_dlg'
        ,'shortcut_app/shortcut_ui'
        ,'service/ui/alert'
        ,'service/ui/prompt'
    ,function(
         $scope
        ,$rootScope
        ,preprocess
        ,append_pending_scan
        ,get_ps_lst
        ,calculate_ds
        ,search_name_sku_dlg
        ,set_ps_lst
        ,Modify_ds_instruction
        ,modify_ds
        ,info_dlg
        ,shortcut_ui
        ,alert_service
        ,prompt_service
    ){
        function get_ds_index(ds){
            var index = -1;
            for(var i = 0;i<$scope.ds_lst.length;i++){
                if($scope.ds_lst[i] == ds){
                    index = i;
                    break;
                }
            }
            return index;
        }
        $scope.info = function(ds){
            if(ds.store_product == null){return;}
            info_dlg(ds);
        }
        $scope.one_time_price_change = function(ds){
            prompt_service('one time price change',ds.get_regular_price()/*prefill*/,false/*is_null_allow*/,true/*is_float*/)
            .then(function(new_price_str){
                var new_price = parseFloat(new_price_str);
                if(isNaN(new_price)){return;}
                if(new_price < 0){return;}

                var instruction = new Modify_ds_instruction(
                     false/*is_delete*/
                    ,null/*new_qty*/
                    ,new_price/*new_price*/
                    ,null/*new_discount*/
                );
                modify_ds(get_ds_index(ds),instruction,$scope.ds_lst);                      
            })
        }
        $scope.remove_ds = function(ds){
            var instruction = new Modify_ds_instruction(
                 true/*is_delete*/
                ,null/*new_qty*/
                ,null/*new_price*/
                ,null/*new_discount*/
            );
            modify_ds(get_ds_index(ds),instruction,$scope.ds_lst);            
        }
        $scope.edit_qty = function(ds){
            prompt_service('change qty',ds.qty,false/*is null allow*/,false/*is float*/).then(
                function(new_qty_str){
                    var new_qty = parseInt(new_qty_str);
                    if(isNaN(new_qty)){return;}
                    if(new_qty<0){return;}

                    var instruction = new Modify_ds_instruction(
                         new_qty==0/*is_delete*/
                        ,new_qty
                        ,null/*new_price*/
                        ,null/*new_discount*/
                    );
                    modify_ds(get_ds_index(ds),instruction,$scope.ds_lst);
                }
            )
        }
        $scope.void = function(){
            set_ps_lst([]);
        }
        $scope.exe_shortcut_child = function(row,col){
            var child_shortcut = shortcut_ui.get_child_of_cur_parent(row,col,$scope);
            if(child_shortcut == null){ return; }
            append_pending_scan(child_shortcut.store_product.product_id,1/*qty*/,null/*non product name*/,null/*override price*/)
        }
        $scope.refresh_ds = function(){
            console.log('refresh ds lst called...');
            calculate_ds(get_ps_lst(),$rootScope.GLOBAL_SETTING.mix_match_lst).then(
                 function(data){$scope.ds_lst = data;}
                ,function(reason){alert_service('alert',reason,'red');}
            )            
        }
        $scope.sku_scan = function(){
            $scope.sku_search_str = $scope.sku_search_str.trim();
            preprocess($scope.sku_search_str).then(
                function(data){
                    append_pending_scan(data.sp.product_id,data.qty,null/*non product name*/,null/*override price*/);
                }
                ,function(reason){ alert_service('alert',reason,'red');}
            )
        }
        $scope.search = function(){
            search_name_sku_dlg();
        }
        //init code
        shortcut_ui.init($scope);  
        if(get_ps_lst() == undefined){
            set_ps_lst([]);
        }
        $scope.refresh_ds();

        $scope.$watchGroup(
             [
                 function(){return JSON.stringify(get_ps_lst());/*the reason i return a string representation of ps_lst is that get_ps_lst() always return a new created ps_lst which have a new identity all the time. This cause the watch to do infinite loop*/}
                ,function(){return $rootScope.GLOBAL_SETTING.mix_match_lst;}]
            ,function(newVal,oldVal,scope){$scope.refresh_ds();}
        );  


    }]);
});
