define(
[
     'angular'
    //-----
    ,'service/db'
    ,'app/sp_ll_app/service/api/offline/sp'
]
,function
(
    angular
)
{
    var mod = angular.module('sp_ll_app/service/api/offline/sku',
    [
         'service/db'
        ,'sp_ll_app/service/api/offline/sp'
    ]);
    mod.factory('sp_ll_app/service/api/offline/sku',
    [
         '$q'
        ,'service/db/get'
        ,'sp_ll_app/service/api/offline/sp'
    ,function(
         $q
        ,get_db
        ,search_sp
    ){
        return function(sku){
            var defer = $q.defer();
            var return_lst = [];
            var promise_lst = [];

            var db = get_db();
            db.query('views/by_sku',{key:sku}).then(function(result){
                for(var i=0;i<result.rows.length;i++){
                    promise_lst.push(search_sp.by_sp_doc_id(result.rows[i].value._id));
                }

                $q.all(promise_lst).then(
                    function(data){
                        for(var i=0;i<data.length;i++){
                            return_lst.push(data[i]);
                        }
                        defer.resolve(return_lst);
                    }
                    ,function(reason){
                        defer.reject(reason);
                    }
                )   
            });
            return defer.promise;
        }
    }])
})