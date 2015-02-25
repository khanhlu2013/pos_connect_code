
/*
    NOTE: It is the responsibility of push_receipt module to donwload product ONLY IF there is product_offline. We can find out
            if a donwload product operation is taking place by looking into push_receipt_module_response.offline_product_count. 
            WHY do we need to see if donwload product operation is taking place? to optimize operation that need to push receipt then 
            download product NO_MATTER_WHAT such as: init_db in sale app, and sync operation in sale_app


    The response of this module:
    {
        . receipt_count
        . offline_product_count
    }
*/

var mod = angular.module('model.receipt');
mod.requires.push.apply(mod.requires,[
    'share.util.offline_db'
])
mod.factory('model.receipt.push',
[
    '$http',
    '$q',
    'model.receipt.dao',
    'share.util.offline_db.remove_doc',
    'share.util.offline_db.download_product',
    'blockUI',
function(
    $http,
    $q,
    dao,
    remove_local_db_doc,
    download_product,
    blockUI
){

    function _clean_up(receipt_doc_id_lst,sp_doc_id_lst){
        var defer = $q.defer();
        if(receipt_doc_id_lst.length === 0 && sp_doc_id_lst.length === 0){ defer.resolve(true);return defer.promise; }

        var promise_lst = []            
        for(var i = 0;i<receipt_doc_id_lst.length;i++){
            promise_lst.push(remove_local_db_doc(receipt_doc_id_lst[i]));
        }
        for(var i = 0;i<sp_doc_id_lst.length;i++){
            promise_lst.push(remove_local_db_doc(sp_doc_id_lst[i]));
        }
        //this is a good optimized spot to decide if donwload product is need here
        $q.all(promise_lst).then(
            function(){ 
                download_product(false).then(
                    function(){
                        defer.resolve();
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

    return function(){

        blockUI.start('uploading receipts ...')
        var defer = $q.defer();

        dao.get_receipt_lst().then(
            function(receipt_lst){
                if(receipt_lst === null){
                    defer.resolve(null);
                    blockUI.stop();
                }else if(receipt_lst.length === 0){
                    defer.resolve({receipt_count:0,offline_product_count:0}); 
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
                            _clean_up(receipt_doc_id_lst,sp_doc_id_lst).then(
                                function(){ 
                                    defer.resolve({
                                        receipt_count : receipt_doc_id_lst.length,
                                        offline_product_count : sp_doc_id_lst.length
                                    });
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
            },function(reason){
                defer.reject(reason); 
                blockUI.stop();
            }
        )

        return defer.promise;
    }      

}])