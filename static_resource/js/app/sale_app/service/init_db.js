define(
[
     'angular'
    //--------------
    ,'app/receipt_app/service/push'
    ,'service/db'
    ,'service/ui'
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
    ]);
    mod.factory('sale_app/service/init_db',
    [
         '$q'
        ,'receipt_app/service/push'
        ,'service/db/download_product'
        ,'service/ui/alert'
    ,function(
         $q
        ,push_receipt
        ,download_product
        ,alert_service
    ){
        return function(){
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
    }])
})