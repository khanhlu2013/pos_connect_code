define(
[
     'angular'
    //--------------
    ,'app/receipt_app/service/push'
    ,'service/db'
    ,'service/ui'
    ,'app/sp_ll_app/service/api_offline'
    ,'app/receipt_app/service/api_offline'
]
,function
(
    angular
)
{
    var mod = angular.module('sale_app/service/init_db',
    [
         'receipt_app/service/push'
        ,'service/db'
        ,'service/ui'
        ,'sp_ll_app/service/api_offline'
        ,'receipt_app/service/api_offline'
    ]);
    mod.factory('sale_app/service/init_db',
    [
         '$q'
        ,'receipt_app/service/push'
        ,'service/db/download_product'
        ,'service/ui/alert'
        ,'sp_ll_app/service/api_offline'
        ,'receipt_app/service/api_offline'
    ,function(
         $q
        ,push_receipt
        ,download_product
        ,alert_service
        ,sp_api_offline
        ,receipt_api_offline
    ){
        function _push_receipt_n_download(){
            var defer = $q.defer();

            push_receipt().then(
                function(push_response){
                    if(push_response === null){
                        download_product(true).then(
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
                        download_product(false).then(
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
        function _build_index(){
            var defer = $q.defer();

            var by_sku_promise = sp_api_offline.by_sku('build_sku_index');
            var by_pid_promise = sp_api_offline.by_product_id('build_product_id_index');
            var receipt_promise = receipt_api_offline.get_receipt_lst();
            $q.all([by_sku_promise,by_pid_promise,receipt_promise]).then(
                function(){
                    defer.resolve();
                },function(reason){
                    defer.reject(reason);
                }
            )
            return defer.promise;
        }

        return function(){
            var defer = $q.defer();
            _push_receipt_n_download().then(
                function(){
                    _build_index().then(
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