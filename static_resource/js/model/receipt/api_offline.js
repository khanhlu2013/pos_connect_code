define(
[
     'angular'
    //--------
    ,'util/offline_db'
    ,'model/receipt/service/receipt_storage_adapter'
]
,function
(
    angular
)
{
    var mod = angular.module('receipt/api_offline',
    [
         'util/offline_db'
        ,'receipt/service/receipt_storage_adapter'
    ]);
    mod.factory('receipt/api_offline',
    [
         '$q'
        ,'util/offline_db/is_exist'
        ,'receipt/service/receipt_storage_adapter'
        ,'blockUI'
        ,'util/offline_db/get'
    ,function(
         $q
        ,is_offline_db_exist
        ,receipt_storage_adapter
        ,blockUI
        ,get_offline_db
    ){
        function get_receipt_lst(GLOBAL_SETTING){
            blockUI.start('getting offline receipt ...');
            var defer = $q.defer();

            is_offline_db_exist(GLOBAL_SETTING).then(
                function(is_exist){
                    if(!is_exist){
                        defer.resolve(null);
                        blockUI.stop();
                    }else{
                        var db = get_offline_db(GLOBAL_SETTING);
                        db.query('views/by_d_type',{key:GLOBAL_SETTING.RECEIPT_DOCUMENT_TYPE})
                        .then(
                            function(pouch_result){
                                var result = [];
                                for(var i = 0;i<pouch_result.rows.length;i++){
                                    result.push(pouch_result.rows[i].value);
                                }
                                defer.resolve(result.map(function(x){return receipt_storage_adapter.pouch_2_javascript(x,GLOBAL_SETTING)}));
                                blockUI.stop();
                            }
                            ,function(reason){
                                defer.reject('Bug: get offline receipt has error');
                                blockUI.stop();
                            }
                        );                        
                    }
                },
                function(reason){
                    defer.reject(reason);
                    blockUI.stop();
                }
            )
            return defer.promise;
        }

        function get_item(receipt_doc_id,GLOBAL_SETTING){
            blockUI.start('getting offline receipt ...');
            var defer = $q.defer();

            is_offline_db_exist(GLOBAL_SETTING).then(
                function(is_exist){
                    if(!is_exist){
                        defer.resolve(null);
                        blockUI.stop();
                    }else{
                        var db = get_offline_db(GLOBAL_SETTING);
                        db.get(receipt_doc_id).then(
                            function(pouch_result){
                                defer.resolve(receipt_storage_adapter.pouch_2_javascript(pouch_result,GLOBAL_SETTING));
                                blockUI.stop();
                            }
                            ,function(reason){
                                defer.reject(reason);
                                blockUI.stop();
                            }
                        );
                    }
                },
                function(reason){
                    defer.reject(reason);
                    blockUI.stop();
                }
            )
            return defer.promise;            
        }

        function adjust_receipt_tender(receipt,tender_ln_lst,GLOBAL_SETTING){
            var defer = $q.defer();
            receipt.tender_ln_lst = tender_ln_lst;
            var db = get_offline_db(GLOBAL_SETTING);
            db.put(receipt_storage_adapter.javascript_2_pouch(receipt,GLOBAL_SETTING),receipt.doc_id,receipt.doc_rev).then(
                function(response){
                    get_item(response.id,GLOBAL_SETTING).then(
                        function(update_receipt){
                            defer.resolve(receipt);
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

        return{
             get_receipt_lst : get_receipt_lst
            ,get_item:get_item
            ,adjust_receipt_tender:adjust_receipt_tender
        }
    }]);
})