/*
    module with 1 service to create either online or offline ( if internet is disconnected ) _TODO_ for offline
*/
define(
[
     'angular'
    //-------
    ,'app/sp_app/service/api/search'
    ,'app/sp_app/service/create'
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
         'sp_app/service/api/search'
        ,'sp_app/service/create'
        ,'service/ui'
        ,'service/db'        
        ,'sale_app/service/offline_product'
    ]);

    mod.factory('sale_app/service/scan/sku_scan_not_found_handler',
    [
         '$q'
        ,'sp_app/service/api/search'
        ,'sp_app/service/create'    
        ,'service/ui/confirm'
        ,'sale_app/service/offline_product/create'
        ,'service/db/download_product'       
    ,function(
         $q
        ,search_sp_api   
        ,create_sp_service    
        ,confirm_service
        ,create_product_offline
        ,download_product
    ){
        return function(sku){
            var defer = $q.defer();

            search_sp_api.sku_search(sku).then(
                function(data){
                    if(data.prod_store__prod_sku__1_1.length != 0){
                        defer.reject('Error: online and offline database is not in sync. Refresh the page and try again.');
                    }else{
                        var promise = create_sp_service(data.prod_store__prod_sku__0_0,data.prod_store__prod_sku__1_0,sku).then
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
                    }
                }
                ,function(reason){ 
                    if(reason.status != 0){ 
                        defer.reject('search sku ajax error');
                    }else{
                        confirm_service('There is problem with the internet. Do you want to create this product offline?','red').then(
                            function(){
                                create_product_offline(sku).then(
                                    function(created_sp){
                                        defer.resolve();
                                    }
                                    ,function(reason){
                                        defer.reject(reason);
                                    }
                                )
                            }
                            ,function(){defer.reject('_cancel_');}
                        )
                    }
                }
            )
            return defer.promise;
        }
    }])
})