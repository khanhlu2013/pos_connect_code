var mod = angular.module('app.saleApp');
mod.requires.push.apply(mod.requires,[
    'model.receipt',
    'share.offline_db_util'
])
mod.factory('app.saleApp.init_db',
[
    '$q',
    'model.receipt.push',
    'model.receipt.dao',
    'model.store_product.dao',
    'share_setting',
    'share.offline_db_util',
function(
    $q,
    push_receipt,
    receipt_dao,
    sp_dao,
    share_setting,
    offline_db_util
){

    function _build_view_index(){
        var defer = $q.defer();

        console.log('build view index: starting ...');
        var by_sku_promise = sp_dao.by_sku('build_sku_index');
        var by_pid_promise = sp_dao.by_product_id('build_product_id_index');
        var receipt_promise = receipt_dao.get_receipt_lst();
        $q.all([by_sku_promise,by_pid_promise,receipt_promise]).then(
            function(){
                console.log('build view index: completed.');
                defer.resolve();
            },function(reason){
                defer.reject(reason);
            }
        )

        return defer.promise;
    }

    return function(){
        var defer = $q.defer();
        push_receipt().then(
            function(push_response){
                if(push_response !== null && push_response.offline_product_count !== 0){
                    //this is the case where push receipt service already download product, thus, we don't need to donwload again
                    defer.resolve();
                }else{
                    var is_create_db = (push_response === null);
                    offline_db_util.download_product(is_create_db).then(
                        function(){
                            _build_view_index().then(
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
                }
            },
            function(reason){
                defer.reject(reason);
            }
        );           
        return defer.promise;  
    }
}]);