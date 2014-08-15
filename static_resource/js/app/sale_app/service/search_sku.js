define(
[
     'angular'
    //-----
    ,'service/db'
    ,'sale_app/service/search_sp'
]
,function
(
    angular
)
{
    var MY_STORE_ID = STORE_ID;

    var mod = angular.module('sale_app/service/search_sku',
    [
         'service/db'
        ,'sale_app/service/search_sp'
    ]);
    mod.factory('sale_app/service/search_sku',['$q','service/db/get','sale_app/service/search_sp',function($q,get_db,search_sp){
        return function(sku){
            var defer = $q.defer();
            var return_lst = [];
            var promise_lst = [];

            var db = get_db(MY_STORE_ID);
            db.query('views/by_sku').then(function(result){
                for(var i=0;i<result.rows.length;i++){
                    promise_lst.push(search_sp(MY_STORE_ID,result.rows[i].value.product_id));
                }

                $q.all(promise_lst).then(function(data){
                    for(var i=0;i<data.length;i++){
                        return_lst.push(data[i]);
                    }
                    defer.resolve(return_lst);
                })   

            });         
            return defer.promise;
        }
    }])
})