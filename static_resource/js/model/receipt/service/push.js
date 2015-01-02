define(
[
    'angular'
    //--------
    ,'model/receipt/api_offline'
    ,'util/offline_db'
    ,'util/offline_db'
]
,function
(
    angular
)
{
    var mod = angular.module('receipt/service/push',
    [
         'receipt/api_offline'
        ,'util/offline_db'
        ,'util/offline_db'
    ]);
    mod.factory('receipt/service/push',
    [
         '$http'
        ,'$q'
        ,'receipt/api_offline'
        ,'util/offline_db/remove_doc'
        ,'util/offline_db/download_product'
        ,'blockUI'
    ,function(
         $http
        ,$q
        ,receipt_api_offline
        ,remove_doc
        ,download_product
        ,blockUI
    ){
        function _clean_up(receipt_doc_id_lst,sp_doc_id_lst,GLOBAL_SETTING){
            var defer = $q.defer();
            if(receipt_doc_id_lst.length === 0 && sp_doc_id_lst.length === 0){ defer.resolve(true);return defer.promise; }

            var promise_lst = []            
            for(var i = 0;i<receipt_doc_id_lst.length;i++){
                promise_lst.push(remove_doc(receipt_doc_id_lst[i],GLOBAL_SETTING));
            }
            for(var i = 0;i<sp_doc_id_lst.length;i++){
                promise_lst.push(remove_doc(sp_doc_id_lst[i],GLOBAL_SETTING));
            }

            $q.all(promise_lst).then(
                function(){ 
                    download_product(false,GLOBAL_SETTING).then(
                        function(download_product_response){
                            defer.resolve(download_product_response);
                        }
                        ,function(reason){
                            defer.reject(reason);
                        }
                    )
                }
                ,function(reason){ d
                    efer.reject(reason);
                }
            )
            return defer.promise;
        }

        return function(GLOBAL_SETTING){
            /*
                if no offline db
                    return null

                if there is offline db and no receipt
                    return {number_receipt_push:0}

                if there is offline db and there is offline receipt
                    return{
                         number_receipt_push:___
                        ,local:___
                        ,remote:___
                        ,doc_written:___
                    }
            */
            blockUI.start('uploading receipts ...')
            var defer = $q.defer();

            receipt_api_offline.get_receipt_lst(GLOBAL_SETTING).then(
                function(receipt_lst){
                    if(receipt_lst === null){
                        defer.resolve(null);
                        blockUI.stop();
                    }else if(receipt_lst.length === 0){
                        defer.resolve({number_receipt_push:0}); 
                        blockUI.stop();
                    }
                    else{
                        $http({
                             method: 'POST'
                            ,url:'/receipt/push'
                            ,data: {receipt_lst: JSON.stringify(receipt_lst)}
                        }).then(
                            function(response){
                                var receipt_doc_id_lst = response.data.receipt_doc_id_lst;
                                var sp_doc_id_lst = response.data.sp_doc_id_lst;
                                _clean_up(receipt_doc_id_lst,sp_doc_id_lst,GLOBAL_SETTING).then(
                                    function(download_product_response){ 
                                        var push_response = download_product_response;
                                        push_response.number_receipt_push=receipt_doc_id_lst.length;
                                        defer.resolve(push_response);
                                        blockUI.stop();
                                    }
                                    ,function(reason){ 
                                        defer.reject(reason); 
                                        blockUI.stop();
                                    }
                                );
                            }
                            ,function(reason){ 
                                defer.reject(reason);
                                blockUI.stop(); 
                            }
                        );                        
                    }
                }
                ,function(reason){ 
                    defer.reject(reason); 
                    blockUI.stop();
                }
            )

            return defer.promise;
        }    
    }])
})