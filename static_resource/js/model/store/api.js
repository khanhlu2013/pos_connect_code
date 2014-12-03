define(
[
    'angular'
]
,function
(
    angular
)
{
    var mod = angular.module('store/api', []);
    mod.factory('store/api',['$http','$q',function($http ,$q )
    {
        function set_tax(tax){
            var defer = $q.defer();
            $http({
                url:'/tax/update_angular',
                method:'POST',
                data:{ tax_rate:tax }
            }).then(
                function(data){
                    var new_tax_rate = JSON.parse(data.data);
                    defer.resolve(new_tax_rate);
                },
                function(reason){ 
                    defer.reject(reason); 
                }
            );
            return defer.promise;
        }

        return{
            set_tax:set_tax
        }
    }])
})