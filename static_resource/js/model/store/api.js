define(
[
     'angular'
]
,function
(
    angular
)
{
    var mod = angular.module('store/api',
    [

    ]);

    mod.factory('store/api',
    [
         '$q'
        ,'$http'
    ,function(
         $q
        ,$http
    ){
        function edit(store){
            var defer = $q.defer();
            $http({
                url:'/store/edit',
                method:'POST',
                data:{ store:JSON.stringify(store) }
            }).then(
                function(data){
                    defer.resolve(data.data);
                },
                function(reason){ 
                    defer.reject(reason); 
                }
            );
            return defer.promise;
        }

        return{
            edit:edit
        }
    }])
})