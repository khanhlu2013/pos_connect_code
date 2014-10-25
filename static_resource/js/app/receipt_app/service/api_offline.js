define(
[
     'angular'
    //--------
    ,'service/db'
    ,'app/receipt_app/service/receipt_storage_adapter'
]
,function
(
    angular
)
{
    var mod = angular.module('receipt_app/service/api_offline',
    [
         'service/db'
        ,'receipt_app/service/receipt_storage_adapter'
    ]);
    mod.factory('receipt_app/service/api_offline',
    [
         '$q'
        ,'$rootScope'
        ,'service/db/get'
        ,'service/db/is_pouch_exist'
        ,'receipt_app/service/receipt_storage_adapter'
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
                        defer.resolve([]);
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

        return{
             get_receipt_lst : get_receipt_lst
        }
    }]);
})