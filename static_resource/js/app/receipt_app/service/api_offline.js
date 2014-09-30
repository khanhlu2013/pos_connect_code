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
        ,'receipt_app/service/receipt_storage_adapter'
    ,function(
         $q
        ,$rootScope
        ,get_pouch_db
        ,receipt_storage_adapter
    ){

        function get_receipt_lst(){
            var defer = $q.defer();
            var return_lst = [];
            var promise_lst = [];

            var db = get_pouch_db();
            db.query('views/by_d_type',{key:$rootScope.GLOBAL_SETTING.receipt_document_type}).then(
                function(pouch_result){
                    var result = [];
                    for(var i = 0;i<pouch_result.rows.length;i++){
                        result.push(pouch_result.rows[i].value);
                    }
                    defer.resolve(result.map(receipt_storage_adapter.pouch_2_javascript));
                }
                ,function(reason){
                    defer.reject(reason);
                }
            );
            return defer.promise;
        }

        return{
             get_receipt_lst : get_receipt_lst
        }
    }]);
})