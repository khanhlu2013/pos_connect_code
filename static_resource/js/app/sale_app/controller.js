define(
[
     'angular'
    //--------
    ,'app/sp_app/service/info'
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
    ,'service/db'
    ,'blockUI'
    ,'app/sp_app/service/api/search'
    ,'app/sp_app/service/create'
], function
(
     angular
)
{
    'use strict';
    
    var mod =  angular.module('sale_app/controller', 
    [
         'sp_app/service/info'
        ,'sale_app/service/scan/preprocess'
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
        ,'service/db'
        ,'sp_app/service/api/search'
        ,'sp_app/service/create'
    ]);
    mod.controller('Sale_page_ctrl', 
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
        ,'service/db/sync'
        ,'blockUI'   
        ,'sp_app/service/info'    
        ,'sp_app/service/api/search' 
        ,'sp_app/service/create'        
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
        ,sync_db_service
        ,blockUI     
        ,sp_info_service   
        ,search_sp_api   
        ,create_sp_service     
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
        $scope.get_tender_amount = function(){
            var result = 0.0;
            for(var i = 0;i<$scope.ds_lst.length;i++){
                result += $scope.ds_lst[i].get_line_total($rootScope.GLOBAL_SETTING.tax_rate);
            }
            return result;
        }
        $scope.info = function(ds){
            if(ds.store_product == null){return;}
            info_dlg(ds).then(function(new_ds){
                var instruction = new Modify_ds_instruction(
                     undefined/*is_delete*/
                    ,undefined/*new_qty*/
                    ,new_ds.override_price/*new_price*/
                    ,undefined/*new_discount*/
                );
                modify_ds(get_ds_index(ds),instruction,$scope.ds_lst);                      
            })
        }
        $scope.remove_ds = function(ds){
            var instruction = new Modify_ds_instruction(
                 true/*is_delete*/
                ,undefined/*new_qty*/
                ,undefined/*new_price*/
                ,undefined/*new_discount*/
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
                        ,undefined/*new_price*/
                        ,undefined/*new_discount*/
                    );
                    modify_ds(get_ds_index(ds),instruction,$scope.ds_lst);
                }
            )
        }
        $scope.edit_sp = function(ds){
            if(ds.store_product == null){return;}
            if(ds.store_product.product_id == null){alert('edit offline product is under construction');return;}
            var sp_copy = angular.copy(ds.store_product);
            sp_info_service(sp_copy).then(
                function(){
                    sync_db_service($rootScope.GLOBAL_SETTING.store_id).then(function(){
                        $scope.refresh_ds();
                    })                    
                }
            )
        }
        $scope.void = function(){
            set_ps_lst([]);
        }
        $scope.exe_shortcut_child = function(row,col){
            var child_shortcut = shortcut_ui.get_child_of_cur_parent(row,col,$scope);
            if(child_shortcut == null){ return; }
            
            append_pending_scan.by_product_id(child_shortcut.store_product.product_id,1/*qty*/,null/*non product name*/,null/*override price*/);
        }
        $scope.refresh_ds = function(){
            console.log('refresh ds lst ...');
            blockUI.start();
            calculate_ds(get_ps_lst(),$rootScope.GLOBAL_SETTING.mix_match_lst).then(
                 function(data){
                    $scope.ds_lst = data;
                    blockUI.stop();
                }
                ,function(reason){alert_service('alert',reason,'red');blockUI.stop()}
            )            
        }
        $scope.sku_scan = function(){
            $scope.sku_search_str = $scope.sku_search_str.trim();
            preprocess.exe($scope.sku_search_str).then(
                 function(data){ append_pending_scan.by_doc_id(data.sp.sp_doc_id,data.qty,null/*non product name*/,null/*override price*/); }
                ,function(reason){ 
                    if(reason != preprocess.SKU_NOT_FOUND){ alert_service('alert',reason,'red');return; }

                    //SKU NOT FOUND HANDLER
                    preprocess.extract_qty_sku($scope.sku_search_str).then(
                        function(data){
                            var sku = data.sku;var qty = data.qty;
                            search_sp_api.sku_search(sku).then(
                                function(data){
                                    if(data.prod_store__prod_sku__1_1.length == 0){
                                        var promise = create_sp_service(data.prod_store__prod_sku__0_0,data.prod_store__prod_sku__1_0,$scope.sku_search_str).then
                                        (
                                             function(created_sp){ 
                                                sync_db_service($rootScope.GLOBAL_SETTING.store_id).then(function(){
                                                    $scope.sku_scan();
                                                })                                                   
                                            }
                                            ,function(reason){alert_service('alert',reason,'red');}
                                        );
                                    }else{
                                        alert('something is wrong. just try to refresh the page and scan again');                                        
                                    }
                                }
                                ,function(reason){ alert_service('alert',reason,'red') }
                            )

                        }
                    )
                }
            )
        }
        $scope.search = function(){
            search_name_sku_dlg();
        }

        //init code
        $scope.ds_lst = [];
        sync_db_service($rootScope.GLOBAL_SETTING.store_id).then(
            function(){
                shortcut_ui.init($scope);  
                if(get_ps_lst() == undefined){
                    set_ps_lst([]);
                }
                
                $scope.refresh_ds();
                $scope.$watchGroup(
                    [
                         function(){return JSON.stringify(get_ps_lst());}//the reason i return a string representation of ps_lst is that get_ps_lst() always return a new created ps_lst which have a new identity all the time. This cause the watch to do infinite loop
                        ,function(){return $rootScope.GLOBAL_SETTING.mix_match_lst;}
                    ]
                    ,function(newVal,oldVal,scope){$scope.refresh_ds();}
                );
            }
        )
    }]);
});