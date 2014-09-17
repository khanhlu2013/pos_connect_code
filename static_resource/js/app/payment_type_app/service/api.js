define(
[
    'angular'
    //---
    ,'app/payment_type_app/model'
]
,function
(
    angular
)
{
    var mod = angular.module('payment_type_app/service/api',
    [
        'payment_type_app/model'
    ]);
    mod.factory('payment_type_app/service/api',
    [
         '$http'
        ,'$q'
        ,'payment_type_app/model/Payment_type'
    ,function(
         $http
        ,$q
        ,Payment_type
    ){
        function edit(pt){
            var defer = $q.defer();
            $http({
                url:'/payment_type/update_angular',
                method:'POST',
                data:{ pt:JSON.stringify(pt) }
            }).then(
                 function(data){ defer.resolve(Payment_type.build(data.data)); }
                ,function(reason){ return $q.reject('edit payment type ajax error');}
            )            
            return defer.promise;
        }
        function create(pt){
            var defer = $q.defer();
            $http({
                url:'/payment_type/insert',
                method:'POST',
                data:{ pt:JSON.stringify(pt) }
            }).then(
                 function(data){ defer.resolve(Payment_type.build(data.data)); }
                ,function(reason){ defer.reject('create payment type ajax error'); }
            )
            return defer.promise;
        }
        function get_lst(){
            var promise_ing = $http({
                url:'/payment_type/get',
                method:'GET',                       
            });
            var promise_ed = promise_ing.then(
                 function(data){ return data.data.map(Payment_type.build); }
                ,function(reason){ return $q.reject('get payment type list ajax error'); }
            );
            return promise_ed;
        }
        return{
             get_lst : get_lst
            ,create : create
            ,edit : edit
        }
    }])
})