define(
[
     'angular'
    //--------
    ,'service/db'
    ,'model/receipt/service/receipt_storage_adapter'
]
,function
(
    angular
)
{
    var mod = angular.module('receipt/api_offline',
    [
         'service/db'
        ,'receipt/service/receipt_storage_adapter'
    ]);
    mod.factory('receipt/api_offline',
    [
         '$q'
        ,'$rootScope'
        ,'service/db/get'
        ,'service/db/is_pouch_exist'
        ,'receipt/service/receipt_storage_adapter'
        ,'blockUI'
    ,function(
         $q
        ,$rootScope
        ,get_pouch_db
        ,is_pouch_exist
        ,receipt_storage_adapter
        ,blockUI
    ){

        function get_receipt_lst(){
            blockUI.start('getting offline receipt ...');
            var defer = $q.defer();

            is_pouch_exist().then(
                function(is_exist){
                    if(!is_exist){
                        defer.resolve(null);
                        blockUI.stop();
                    }else{
                        var db = get_pouch_db();
                        db.query('views/by_d_type',{key:$rootScope.GLOBAL_SETTING.receipt_document_type})
                        .then(
                            function(pouch_result){
                                var result = [];
                                for(var i = 0;i<pouch_result.rows.length;i++){
                                    result.push(pouch_result.rows[i].value);
                                }
                                defer.resolve(result.map(receipt_storage_adapter.pouch_2_javascript));
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

        function get_item(receipt_doc_id){
            blockUI.start('getting offline receipt ...');
            var defer = $q.defer();

            is_pouch_exist().then(
                function(is_exist){
                    if(!is_exist){
                        defer.resolve(null);
                        blockUI.stop();
                    }else{
                        var db = get_pouch_db();
                        db.get(receipt_doc_id).then(
                            function(pouch_result){
                                defer.resolve(receipt_storage_adapter.pouch_2_javascript(pouch_result));
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

        function adjust_receipt_tender(receipt,tender_ln_lst){
            var defer = $q.defer();
            receipt.tender_ln_lst = tender_ln_lst;
            var db = get_pouch_db();
            db.put(receipt_storage_adapter.javascript_2_pouch(receipt),receipt.doc_id,receipt.doc_rev).then(
                function(response){
                    get_item(response.id).then(
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