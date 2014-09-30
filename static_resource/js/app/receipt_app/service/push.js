define(
[
    'angular'
    //--------
    ,'app/receipt_app/service/api_offline'
    ,'service/db'
]
,function
(
    angular
)
{
    var mod = angular.module('receipt_app/service/push',
    [
         'receipt_app/service/api_offline'
        ,'service/db'
    ]);
    mod.factory('receipt_app/service/push',
    [
         '$http'
        ,'$q'
        ,'receipt_app/service/api_offline'
        ,'service/db/remove_doc'
        ,'service/db/sync'
    ,function(
         $http
        ,$q
        ,receipt_api_offline
        ,remove_doc
        ,sync_db
    ){
        function clean_up(receipt_doc_id_lst,sp_doc_id_lst){
            var defer = $q.defer();
            if(receipt_doc_id_lst.length === 0 && sp_doc_id_lst.length === 0){ defer.resolve(true);return defer.promise; }

            var promise_lst = []            
            for(var i = 0;i<receipt_doc_id_lst.length;i++){
                promise_lst.push(remove_doc(receipt_doc_id_lst[i]));
            }
            for(var i = 0;i<sp_doc_id_lst.length;i++){
                promise_lst.push(remove_doc(sp_doc_id_lst[i]));
            }
            promise_lst.push(sync_db());

            $q.all(promise_lst).then(
                function(){ defer.resolve(); }
                ,function(reason){ defer.reject(reason);}
            )
            return defer.promise;
        }

        return function(){
            var defer = $q.defer();

            receipt_api_offline.get_receipt_lst().then(
                function(receipt_lst){
                    $http({
                         method: 'POST'
                        ,url:'/receipt/push'
                        ,data: {receipt_lst: JSON.stringify(receipt_lst)}
                    }).then(
                        function(response){
                            var receipt_doc_id_lst = response.data.receipt_doc_id_lst;
                            var sp_doc_id_lst = response.data.sp_doc_id_lst;
                            clean_up(receipt_doc_id_lst,sp_doc_id_lst).then(
                                 function(){ defer.resolve(receipt_doc_id_lst.length); }
                                ,function(reason){ defer.reject(reason); }
                            );
                        }
                        ,function(reason){ defer.reject('push receipt ajax error'); }
                    )
                }
                ,function(reason){ defer.reject(reason); }
            )

            return defer.promise;
        }    
    }])
})