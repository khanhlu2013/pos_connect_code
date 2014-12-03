define(
[
    'angular'
    //---
    ,'model/payment_type/model'
]
,function
(
    angular
)
{
    var mod = angular.module('payment_type/api',
    [
        'payment_type/model'
    ]);
    mod.factory('payment_type/api',
    [
         '$http'
        ,'$q'
        ,'payment_type/model/Payment_type'
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
                function(data){ 
                    defer.resolve(Payment_type.build(data.data)); 
                }
                ,function(reason){ 
                    defer.reject(reason);
                }
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
                function(data){ 
                    defer.resolve(Payment_type.build(data.data)); 
                }
                ,function(reason){ 
                    defer.reject(reason);
                }
            )
            return defer.promise;
        }
        function get_lst(){
            var defer = $q.defer();

            $http({
                url:'/payment_type/get',
                method:'GET',                       
            })
            .then(
                function(data){ 
                    defer.resolve(data.data.map(Payment_type.build));
                }
                ,function(reason){ 
                    defer.reject(reason);
                }
            );
            return defer.promise;
        }
        return{
             get_lst : get_lst
            ,create : create
            ,edit : edit
        }
    }])
})