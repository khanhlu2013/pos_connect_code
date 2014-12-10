define(
[
     'angular'
    ,'service/global_setting'    
    ,'model/receipt/service/push'    
    ,'service/db'    
]
,function
(
    angular
)
{
    var mod = angular.module('service/sync',
    [
         'service/global_setting'
        ,'receipt/service/push'
        ,'service/db'        
    ]);
    mod.factory('service/sync',
    [
         '$q'
        ,'service/global_setting'
        ,'receipt/service/push'
        ,'service/db/download_product'        
    ,function(
         $q
        ,global_setting_service     
        ,push_receipt
        ,download_product
    ){
        function _push_receipt_n_download_product(){
            var defer = $q.defer();
            push_receipt().then(
                function(push_response){
                    if(push_response === null){
                        defer.resolve('there is no offline database to sync');
                    }else if(push_response.number_receipt_push !== 0){
                        //download product is already perform in push service
                        if(push_response.local !== push_response.remote && push_response.local !== undefined && push_response.remote !== undefined){
                            defer.reject(response.remote - response.local + ' products missing. please sync again.');
                        }else{
                            defer.resolve('receipt: ' + push_response.number_receipt_push + ', update product:' + push_response.docs_written + ', total product:' + push_response.local);
                        }
                    }else{
                        //there is offline database but there is no offline receipt. in this case, push does not do a download product. lets do it now
                        download_product(false/*not force. by now, we know local db exist*/).then(
                            function(response){
                                if(response.local !== response.remote){
                                    defer.reject(response.remote - response.local + ' products missing. please sync again.');
                                }else{
                                    defer.resolve('receipt: 0' + ', update product:' + response.docs_written + ', total product:' + response.local,'info','green');
                                }
                            }
                            ,function(reason){
                                defer.reject(reason);
                            }
                        )                     
                    }
                }
                ,function(reason){
                    defer.reject(reason);
                }
            )            
            return defer.promise;
        }

        return function(){
            var defer = $q.defer();
            var push_receipt_n_download_product_promise = _push_receipt_n_download_product();
            var refresh_global_setting_promise = global_setting_service.refresh();
            $q.all([push_receipt_n_download_product_promise,refresh_global_setting_promise]).then(
                function(resolve_lst){
                    // alert_service(resolve_lst[0],'info','green');
                    defer.resolve(resolve_lst[0])
                },function(reason){
                    defer.reject(reason);
                }
            )        
            return defer.promise;
        }
    }])
})