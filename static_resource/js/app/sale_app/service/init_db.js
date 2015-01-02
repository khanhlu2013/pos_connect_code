define(
[
     'angular'
    //--------------
    ,'model/receipt/service/push'
    ,'util/offline_db'
    ,'service/ui'
    ,'model/sp/api_offline'
    ,'model/receipt/api_offline'
]
,function
(
    angular
)
{
    var mod = angular.module('sale_app/service/init_db',
    [
         'receipt/service/push'
        ,'util/offline_db'
        ,'service/ui'
        ,'sp/api_offline'
        ,'receipt/api_offline'
    ]);
    mod.factory('sale_app/service/init_db',
    [
         '$q'
        ,'receipt/service/push'
        ,'util/offline_db/download_product'
        ,'service/ui/alert'
        ,'sp/api_offline'
        ,'receipt/api_offline'
    ,function(
         $q
        ,push_receipt
        ,download_product
        ,alert_service
        ,offline_sp_api
        ,receipt_api_offline
    ){
        function _push_receipt_n_download(GLOBAL_SETTING){
            var defer = $q.defer();

            push_receipt(GLOBAL_SETTING).then(
                function(push_response){
                    if(push_response === null){
                        download_product(true,GLOBAL_SETTING).then(
                            function(download_response){
                                if(download_response.local !== download_response.remote){
                                    alert_service(download_response.remote - download_response.local + ' products missing. please sync again.');
                                }                            
                                defer.resolve();                                
                            },
                            function(reason){
                                defer.reject(reason);
                            }
                        )
                    }else if(push_response.number_receipt_push === 0){
                        download_product(false,GLOBAL_SETTING).then(
                            function(download_response){
                                if(download_response.local !== download_response.remote){
                                    alert_service(download_response.remote - download_response.local + ' products missing. please sync again.');
                                }                            
                                defer.resolve();                                
                            },
                            function(reason){
                                defer.reject(reason);
                            }
                        )                    
                    }else {
                        if(push_response.local === undefined){
                            defer.reject('Bug: unexpected push receipt response');
                        }else if(push_response.local < push_response.remote){
                            alert_service(download_response.remote - download_response.local + ' products missing. please sync again.');
                        }                       
                        defer.resolve();
                    }
                },
                function(reason){
                    defer.reject(reason);
                }
            );       

            return defer.promise;   
        }
        function _build_index(GLOBAL_SETTING){
            var defer = $q.defer();

            var by_sku_promise = offline_sp_api.by_sku('build_sku_index',GLOBAL_SETTING);
            var by_pid_promise = offline_sp_api.by_product_id('build_product_id_index',GLOBAL_SETTING);
            var receipt_promise = receipt_api_offline.get_receipt_lst(GLOBAL_SETTING);
            $q.all([by_sku_promise,by_pid_promise,receipt_promise]).then(
                function(){
                    defer.resolve();
                },function(reason){
                    defer.reject(reason);
                }
            )
            return defer.promise;
        }

        return function(GLOBAL_SETTING){
            var defer = $q.defer();
            _push_receipt_n_download(GLOBAL_SETTING).then(
                function(){
                    _build_index(GLOBAL_SETTING).then(
                        function(){
                            defer.resolve();
                        },function(reason){
                            defer.reject(reason);
                        }
                    )
                },function(reason){
                    defer.reject(reason);
                }
            )
            return defer.promise;
        }
    }])
})