define(
[
     'angular'
    //-----
    ,'service/db'
    ,'app/sale_app/service/search/sp_api'
]
,function
(
    angular
)
{
    var mod = angular.module('sale_app/service/search/sku_api',
    [
         'service/db'
        ,'sale_app/service/search/sp_api'
    ]);
    mod.factory('sale_app/service/search/sku_api',
    [
         '$q'
        ,'service/db/get'
        ,'sale_app/service/search/sp_api'
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