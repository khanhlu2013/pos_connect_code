var mod = angular.module('model.receipt');
mod.requires.push.apply(mod.requires,[
    'share.util.offline_db',
    'share.offline_db_util'
])
mod.factory('model.receipt.dao',
[
    '$q',
    'share.util.offline_db.is_exist',
    'model.receipt.storage_adapter',
    'share.util.offline_db.get',
    'share_setting',
    'blockUI',
    'share.offline_db_util',
function(
    $q,
    is_offline_db_exist,
    receipt_storage_adapter,
    get_offline_db,
    share_setting,
    blockUI,
    offline_db_util
){
    function get_receipt_lst(){
        blockUI.start('getting offline receipt ...');
        var defer = $q.defer();

        is_offline_db_exist().then(
            function(is_exist){
                if(!is_exist){
                    defer.resolve(null);
                    blockUI.stop();
                }else{
                    var db = get_offline_db();
                    var view_name = offline_db_util.get_pouch_view_name(share_setting.VIEW_BY_D_TYPE);
                    db.query(view_name,{key:share_setting.RECEIPT_DOCUMENT_TYPE})
                    .then(
                        function(pouch_result){
                            var result = [];
                            for(var i = 0;i<pouch_result.rows.length;i++){
                                result.push(pouch_result.rows[i].value);
                            }
                            defer.resolve(result.map(function(x){return receipt_storage_adapter.pouch_2_javascript(x)}));
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

        is_offline_db_exist().then(
            function(is_exist){
                if(!is_exist){
                    defer.resolve(null);
                    blockUI.stop();
                }else{
                    var db = get_offline_db();
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
        var db = get_offline_db();
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
}])