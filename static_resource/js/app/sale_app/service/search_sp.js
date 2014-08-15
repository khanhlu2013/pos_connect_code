define(
[
     'angular'
    //-------
    ,'service/db'
]
,function
(
    angular
)
{
    var mod = angular.module('sale_app/service/search_sp',['service/db']);

    mod.factory('sale_app/service/search_sp',['$q','service/db/get',function($q,get_db){

        function exe(store_id,product_id){
            var defer = $q.defer();

            var db = get_db(store_id);
            db.query('views/by_product_id',{key:product_id}).then(function(lst){
                if(lst.rows.length == 0){
                    defer.resolve(null);
                }else if(lst.rows.length > 1){
                    defer.reject('multiple product found for 1 product_id ' + product_id);
                }else{
                    var sp = lst.rows[0].value;
                    if(sp.breakdown_assoc_lst.length == 0){
                        defer.resolve(sp);
                    }else{
                        var promise_lst = [];
                        for(var i = 0;i<sp.breakdown_assoc_lst.length;i++){
                            promise_lst.push(exe(store_id,sp.breakdown_assoc_lst[i].product_id))
                        }
                        $q.all(promise_lst).then(function(data){
                            sp.xxx = data;
                            defer.resolve(sp);
                        })
                    }
                }
            });
            return defer.promise; 
        }

        return exe;
    }])
})