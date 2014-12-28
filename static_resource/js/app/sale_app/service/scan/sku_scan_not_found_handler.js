/*
    this module is only call from the sale app when offline sku is not found
        . this module search for this sku online, and make sure this sku is not found in the cur store. when sku is not found for current store, the search about take a step to search for network info
            . if search success, 
                . in this case, we did not find the sku offline and if there is nothing go wrong the sku online for cur_store should not be found. this service verify that.    
                . if network suggest is empty, then this service will give the user an option of sale as non_inventory or create new product
                . if network suggest is not empty, the extra suggest is use as input for create product which does not concern about non-inventory since create product is 
                  also used in product app, which don't care about non-inventory.
            . if the above search faile, then it will give an option of non_inventory sell or create product offline
*/
define(
[
     'angular'
    //-------
    ,'model/sp/api_search'
    ,'model/sp/service/create'
    ,'service/ui'
    ,'service/db'    
    ,'app/sale_app/service/offline_product'
]
,function
(
    angular
)
{
    var mod = angular.module('sale_app/service/scan/sku_scan_not_found_handler',
    [
         'sp/api_search'
        ,'sp/service/create'
        ,'service/ui'
        ,'service/db'        
        ,'sale_app/service/offline_product'
    ]);

    mod.factory('sale_app/service/scan/sku_scan_not_found_handler',
    [
         '$q'
        ,'sp/api_search'
        ,'sp/service/create'    
        ,'service/ui/confirm'
        ,'service/ui/_3_option'
        ,'sale_app/service/offline_product/create'
        ,'service/db/download_product'       
    ,function(
         $q
        ,search_sp_api   
        ,create_sp_service    
        ,confirm_service
        ,_3_option
        ,create_product_offline
        ,download_product
    ){
        function _create_product_and_sync(product_lst,my_sp_lst,sku){
            var defer = $q.defer();
            create_sp_service(product_lst,my_sp_lst,sku).then
            (
                function(created_sp){ 
                    download_product().then(
                        function(){
                            defer.resolve();
                        },function(reason){
                            defer.reject(reason);
                        }
                    )
                },function(reason){ 
                    defer.reject(reason); 
                }
            );   
            return defer.promise;           
        }

        return function(sku){
            var defer = $q.defer();

            search_sp_api.sku_search(sku).then(
                function(data){
                    if(data.prod_store__prod_sku__1_1.length != 0){
                        confirm_service('online and offline database is out of sync. Do you want to sync?','orange').then(
                            function(){
                                download_product().then(
                                    function(){
                                        defer.resolve();
                                    },function(reason){
                                        defer.reject(reason);
                                    }
                                )
                            },function(){
                                defer.reject('_cancel_');
                            }
                        )
                    }else{
                        if(data.prod_store__prod_sku__0_0.length === 0 && data.prod_store__prod_sku__1_0.length === 0){
                            _3_option('sku not found','None Inventory or create new product?','None Inventory','create new product','cancel').then(
                                function(option){
                                    if(option ===1){
                                        defer.reject('_non_inventory_');
                                    }else if(option == 2){
                                        _create_product_and_sync(data.prod_store__prod_sku__0_0,data.prod_store__prod_sku__1_0,sku).then(
                                            function(){
                                                defer.resolve();
                                            },function(reason){
                                                defer.reject(reason);
                                            }
                                        )
                                    }else{
                                        defer.reject('_cancel_');
                                    }
                                },function(reason){
                                    alert_service(reason);
                                }
                            )
                        }else{
                            _create_product_and_sync(data.prod_store__prod_sku__0_0,data.prod_store__prod_sku__1_0,sku).then(
                                function(){
                                    defer.resolve();
                                },function(reason){
                                    defer.reject(reason);
                                }
                            )
                        }
                    }
                }
                ,function(reason){ 
                    if(reason.status != 0){ 
                        defer.reject('search sku ajax error');
                    }else{
                        _3_option('internet is disconnected','None Inventory or create product offline.','none inventory','create product offline','cancel','red'/*title color*/,'blue'/*color_1*/,'red'/*color_2*/,'orange'/*color_3*/).then(
                            function(option){
                                if(option === 1){
                                    defer.reject('_non_inventory_');
                                }else if(option === 2){
                                    create_product_offline(sku).then(
                                        function(created_sp){
                                            defer.resolve();
                                        }
                                        ,function(reason){
                                            defer.reject(reason);
                                        }
                                    )
                                }else if(option === 3){
                                    defer.reject('_cancel_');
                                }         
                            },function(){
                                defer.reject('_cancel_');
                            }
                        )
                    }
                }
            )
            return defer.promise;
        }
    }])
})