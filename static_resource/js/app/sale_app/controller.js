define(
[
     'angular'
    //--------
    ,'app/sp_app/service/info'
    ,'app/sale_app/service/scan/preprocess'
    ,'app/sale_app/service/scan/append_pending_scan'
    ,'app/sale_app/service/pending_scan/get_api'
    ,'app/sp_ll_app/service/search/name_sku_online_dlg'
    ,'app/sp_ll_app/service/api_offline'
    ,'app/sale_app/service/pending_scan/set_api'
    ,'app/sale_app/service/displaying_scan/modify_ds'
    ,'app/sale_app/service/sale_able_info_dlg'
    ,'app/sale_app/service/scan/sku_scan_not_found_handler'
    ,'app/shortcut_app/shortcut_ui'
    ,'service/ui'
    ,'service/db'
    // ,'blockUI'
    ,'app/sale_app/service/hold/api'
    ,'app/sale_app/service/hold/get_hold_ui'
    ,'app/sale_app/service/offline_product'
    ,'app/sale_app/service/scan/toogle_value_customer_price'
    ,'app/sale_app/service/finalize'
    ,'app/sale_app/service/displaying_scan/set_ds_lst'
    ,'app/sale_app/service/displaying_scan/calculate_ds_lst'
    ,'service/misc'
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
        ,'sale_app/service/pending_scan/get_api'
        ,'sp_ll_app/service/search/name_sku_online_dlg'
        ,'sp_ll_app/service/api_offline'
        ,'sale_app/service/pending_scan/set_api'
        ,'sale_app/service/displaying_scan/modify_ds'
        ,'sale_app/service/sale_able_info_dlg'
        ,'sale_app/service/scan/sku_scan_not_found_handler'
        ,'sale_app/model'
        ,'shortcut_app/shortcut_ui'
        ,'service/ui'
        ,'service/db'
        ,'sale_app/service/hold/api'
        ,'sale_app/service/hold/get_hold_ui'
        ,'sale_app/service/offline_product'
        ,'sale_app/service/scan/toogle_value_customer_price'
        ,'sale_app/service/finalize'
        ,'sale_app/service/displaying_scan/set_ds_lst'
        ,'sale_app/service/displaying_scan/calculate_ds_lst'
        ,'service/misc'
    ]);
    mod.controller('Sale_page_ctrl', 
    [
         '$scope'
        ,'$rootScope'
        ,'sale_app/service/scan/preprocess'
        ,'sale_app/service/scan/append_pending_scan'
        ,'sale_app/service/pending_scan/get_api'
        ,'sp_ll_app/service/search/name_sku_online_dlg/multiple'
        ,'sp_ll_app/service/api_offline'
        ,'sale_app/service/pending_scan/set_api'
        ,'sale_app/model/Modify_ds_instruction'
        ,'sale_app/service/displaying_scan/modify_ds'
        ,'sale_app/service/sale_able_info_dlg'
        ,'sale_app/service/scan/sku_scan_not_found_handler'
        ,'shortcut_app/shortcut_ui'
        ,'service/ui/alert'
        ,'service/ui/prompt'
        ,'service/ui/confirm'
        ,'service/db/sync'
        ,'blockUI'   
        ,'sp_app/service/info'    
        ,'sale_app/service/hold/api'
        ,'sale_app/service/hold/get_hold_ui'
        ,'sale_app/service/offline_product/edit'
        ,'hotkeys'
        ,'sale_app/service/scan/toogle_value_customer_price'
        ,'sale_app/model/Non_inventory'
        ,'sale_app/service/finalize'
        ,'sale_app/service/displaying_scan/set_ds_lst'
        ,'sale_app/service/displaying_scan/calculate_ds_lst'
        ,'service/misc'
    ,function(
         $scope
        ,$rootScope
        ,preprocess
        ,append_pending_scan
        ,get_ps_lst
        ,search_name_sku_multiple_dlg
        ,sp_offline_api
        ,set_ps_lst
        ,Modify_ds_instruction
        ,modify_ds
        ,detail_price_dlg
        ,sku_scan_not_found_handler
        ,shortcut_ui
        ,alert_service
        ,prompt_service
        ,confirm_service
        ,sync_db_service
        ,blockUI     
        ,sp_info_service   
        ,hold_api
        ,get_hold_ui
        ,edit_product_offline
        ,hotkeys
        ,toogle_value_customer_price
        ,Non_inventory
        ,finalize
        ,set_ds_lst
        ,calculate_ds_lst
        ,misc_service
    ){

        hotkeys.bindTo($scope)
        .add({
            combo: 'ctrl+h',
            description: 'hold',
            callback: function() {$scope.hold()}
        })
        .add({
            combo: 'ctrl+g',
            description: 'get holds',
            callback: function() {$scope.get_hold_ui()}
        })
        .add({
            combo: 'f2',
            description: 'toogle value customer price',
            allowIn: ['INPUT'],
            callback: function() {$scope.toogle_value_customer_price();}
        })
        .add({
            combo: 'f7',
            description: 'tender',
            allowIn: ['INPUT'],
            callback: function() {$scope.finalize();}
        })

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
        $scope.finalize = function(){
            if($scope.ds_lst.length === 0){return;}
            finalize($scope.ds_lst).then(
                function(saved_receipt_doc_id){
                    set_ps_lst([])
                }
                ,function(reason){
                    alert_service(reason)
                }
            )
        }
        $scope.toogle_value_customer_price = function(){toogle_value_customer_price($scope.ds_lst);}
        $scope.non_inventory = function(){
            prompt_service('enter none inventory price',null/*prefill*/,false/*is null allow*/,true/*is float*/).then(
                function(price){
                    var non_inventory = new Non_inventory('non_inventory',price);
                    append_pending_scan.by_doc_id(null/*sp_doc_id*/,1/*qty*/,non_inventory,null/*override price*/);
                }
            )
        }
        $scope.get_tender_amount = function(){
            var result = 0.0;
            for(var i = 0;i<$scope.ds_lst.length;i++){
                result += $scope.ds_lst[i].get_line_total($rootScope.GLOBAL_SETTING.tax_rate);
            }
            return result;
        }
        $scope.get_hold_ui = function(){
            get_hold_ui().then(
                function(hold){ 
                    set_ds_lst(hold.ds_lst); 
                }
                ,function(reason){ 
                    alert_service(reason); 
                }
            );
        }        
        $scope.hold = function(){
            if($scope.ds_lst.length == 0){
                alert_service('there is nothing to hold','info','blue');
                return;
            }
            confirm_service('confirm hold?','orange').then(
                function(){ hold_api.hold_current_pending_scan_lst(); }
            );
        }
        $scope.show_detail_price = function(ds){
            if(ds.is_non_inventory()){
                prompt_service('change price',ds.override_price,false/*is null allow*/,true/*is float*/).then(
                    function(new_price){
                        var instruction = new Modify_ds_instruction(
                             undefined/*is_delete*/
                            ,undefined/*new_qty*/
                            ,new_price
                            ,undefined/*new_discount*/
                            ,undefined/*new_non_product_name*/
                        );
                        modify_ds(get_ds_index(ds),instruction,$scope.ds_lst);    
                    }
                )
            }else{
                detail_price_dlg(ds,true/*is_enable_override_price*/).then(function(new_ds){
                    var instruction = new Modify_ds_instruction(
                         undefined/*is_delete*/
                        ,undefined/*new_qty*/
                        ,new_ds.override_price/*new_price*/
                        ,undefined/*new_discount*/
                        ,undefined/*new_non_product_name*/
                    );
                    modify_ds(get_ds_index(ds),instruction,$scope.ds_lst);                      
                });
            }
        }
        $scope.remove_ds = function(ds){
            var instruction = new Modify_ds_instruction(
                 true/*is_delete*/
                ,undefined/*new_qty*/
                ,undefined/*new_price*/
                ,undefined/*new_discount*/
                ,undefined/*new_non_product_name*/
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
                        ,undefined/*new_non_product_name*/
                    );
                    modify_ds(get_ds_index(ds),instruction,$scope.ds_lst);
                }
            )
        }
        $scope.edit_sp = function(ds){
            if(ds.is_non_inventory()){
                prompt_service('edit name',ds.non_inventory.name/*prefill*/,false/*is null allow*/,false/*is float*/).then(
                    function(new_non_product_name){
                        var instruction = new Modify_ds_instruction(
                             undefined/*is_delete*/
                            ,undefined/*qty*/
                            ,undefined/*new_price*/
                            ,undefined/*new_discount*/
                            ,new_non_product_name
                        );
                        modify_ds(get_ds_index(ds),instruction,$scope.ds_lst);                        
                    }
                )
            }else{
                if(ds.store_product.is_create_offline()){
                    edit_product_offline(ds.store_product).then( 
                        function(){ 
                            _refresh_edited_ds(ds); 
                        } 
                        ,function(reason){ 
                            alert_service(reason);
                            return; 
                        }
                    )
                }else{
                    var sp_copy = angular.copy(ds.store_product);
                    sp_info_service(sp_copy).then( 
                        function(){ 
                            _refresh_edited_ds(ds); 
                        }
                        ,function(reason){ 
                            alert_service(reason);
                            return; 
                        }
                    )
                }
            }
        }
        function _refresh_edited_ds(ds){
            sp_offline_api.by_sp_doc_id(ds.store_product.sp_doc_id).then(
                function(sp){ 
                    ds.store_product = sp; set_ds_lst($scope.ds_lst); 
                }
                ,function(reason){ 
                    alert_service(reason); 
                }
            )
        }
        $scope.void = function(){ set_ps_lst([]); }
        $scope.exe_shortcut_child = function(row,col){
            var child_shortcut = shortcut_ui.get_child_of_cur_parent(row,col,$scope);
            if(child_shortcut == null){ return; }
            
            append_pending_scan.by_product_id(child_shortcut.store_product.product_id,1/*qty*/,null/*non_inventory*/,null/*override_price*/);
        }
        function _get_distinct_sp_from_ds_lst(ds_lst){
            var sp_lst = [];
            for(var i = 0;i<ds_lst.length;i++){
                var cur_ds = ds_lst[i];
                if(!cur_ds.is_non_inventory()){
                    var existed_sp = misc_service.get_item_from_lst_base_on_property('sp_doc_id'/*property*/,cur_ds.store_product.sp_doc_id/*value*/,sp_lst);
                    if(existed_sp === null){
                        sp_lst.push(cur_ds.store_product);
                    }
                }
            }
            return sp_lst;
        }
        $scope.refresh_ds = function(){
            blockUI.start('refresh page ...');
            console.log('refresh ds ...');
            var ps_lst = get_ps_lst();
            calculate_ds_lst(ps_lst,_get_distinct_sp_from_ds_lst($scope.ds_lst)).then(
                 function(data){
                    $scope.ds_lst = data;
                    $scope.is_focus_sku_txt = true;
                    console.log('is focus sku txt' + $scope.is_focus_sku_txt);                    
                    blockUI.stop();
                }
                ,function(reason){
                    alert_service(reason);
                    blockUI.stop()
                }
            )            
        }
        $scope.sku_scan = function(){
            $scope.sku_search_str = $scope.sku_search_str.trim();
            preprocess.exe($scope.sku_search_str).then(
                 function(data){ 
                    append_pending_scan.by_doc_id(data.sp.sp_doc_id,data.qty,null/*non_inventory*/,null/*override price*/); 
                }
                ,function(reason){ 
                    if(reason != preprocess.SKU_NOT_FOUND){ 
                        alert_service(reason);
                        return; 
                    }
                    else{ 
                        //SKU NOT FOUND HANDLER
                        preprocess.extract_qty_sku($scope.sku_search_str).then(
                            function(extracted_result){
                                sku_scan_not_found_handler(extracted_result.sku).then(
                                     function(created_sp){ 
                                        if(created_sp.is_create_offline()){ $scope.sku_scan(); }
                                        else{ sync_db_service().then(function(){$scope.sku_scan();}) }
                                    }
                                    ,function(reason){
                                        alert_service(reason);
                                    }
                                )
                            }
                        )
                    }
                }
            )
        }
        $scope.search = function(){ 
            search_name_sku_multiple_dlg().then(
                function(sp_lst){
                    for(var i = 0;i<sp_lst.length;i++){
                        append_pending_scan.by_product_id(sp_lst[i].product_id,1/*qty*/,null/*non_inventory*/,null/*override_price*/);
                    }
                }
            )
        }

        //init code
        $scope.sku_search_str = "";
        $scope.ds_lst = [];
        sync_db_service().then(
            function(response){
                if(response.local < response.remote){
                    var message = response.remote - response.local + ' products not yet downloaded. Please refresh the page to download missing product';
                    alert_service(message);
                }
                shortcut_ui.init($scope);  
                $scope.refresh_ds();
                $scope.$watchGroup(
                    [
                         function(){return JSON.stringify(get_ps_lst());}//the reason i return a string representation of ps_lst is that get_ps_lst() always return a new created ps_lst which have a new identity all the time. This cause the watch to do infinite loop
                        ,function(){return $rootScope.GLOBAL_SETTING.mix_match_lst;}
                    ]
                    ,function(newVal,oldVal,scope){$scope.refresh_ds();}
                );
            }
            ,function(reason){ 
                alert_service(reason); 
            }
        )
    }]);
});