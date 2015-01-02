define(
[
    'angular'
    //------
    ,'model/receipt/api_offline'
    ,'model/receipt/api'    
    ,'service/ui'
]
,function
(
    angular
)
{
    var mod = angular.module('receipt/service/adjust_receipt_tender',
    [
         'receipt/api_offline'
        ,'receipt/api' 
        ,'service/ui'
    ]);
    mod.factory('receipt/service/adjust_receipt_tender',
    [
         '$http'
        ,'$q'
        ,'receipt/api_offline'
        ,'receipt/api'         
        ,'service/ui/alert'
    ,function(
         $http
        ,$q
        ,receipt_offline_api
        ,receipt_online_api
        ,alert_service
    ){
  
        return function(receipt,new_tender_ln_lst,GLOBAL_SETTING){
            var defer = $q.defer();
            /*
                lets check if receipt is located offline. Notice this if this receipt said that it is online, it must be online. but if this receipt said it is located offline,
                    this info is not reliable because a sync could be trigger. if it said it is located offline and we can not find it, we will try to find it online. 

                notice when receipt is offline in pouch, we need to get item first before update, because we need to whole doc to do update
                however, when receipt is online, we don't need to get object before update, we can simple update without get item
            */
            if(receipt.is_reside_offline()){
                receipt_offline_api.get_item(receipt.doc_id,GLOBAL_SETTING).then(
                    function(offline_receipt){
                        receipt_offline_api.adjust_receipt_tender(offline_receipt,new_tender_ln_lst,GLOBAL_SETTING).then(
                            function(adjust_receipt){
                                defer.resolve(adjust_receipt);
                            },function(reason){
                                defer.reject(reason);
                            }
                        )
                    },function(reason){
                        //there is issue finding this receipt offline. lets try it online
                        receipt_online_api.get_item_base_on_doc_id(receipt.doc_id).then(
                            function(online_receipt){
                                receipt_online_api.adjust_receipt_tender(online_receipt.id,new_tender_ln_lst).then(
                                    function(update_receipt){
                                        defer.resolve(update_receipt);
                                    },function(reason){
                                        defer.reject(reason);
                                    }   
                                )
                            }
                            ,function(reason){
                                defer.reject(reason);
                            }
                        )
                    }
                )
            }else{
                receipt_online_api.adjust_receipt_tender(receipt.id,new_tender_ln_lst).then(
                    function(update_receipt){
                        defer.resolve(update_receipt);
                    },function(reason){
                        defer.reject(reason);
                    }   
                )
            }
            return defer.promise;
        }    
    }])
})