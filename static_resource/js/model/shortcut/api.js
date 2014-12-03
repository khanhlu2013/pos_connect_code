define(
[
    'angular'
]
,function
(
    angular
)
{

    var mod = angular.module('shortcut/api', []);
    mod.factory('shortcut/api',['$http','$q',function($http ,$q )
    {
        function get(){
            var defer = $q.defer();
            $http({
                url:'/sale_shortcut/get',
                method:'GET',
            }).then(
                function(data){ 
                    defer.resolve(data.data); 
                }
                ,function(reason){ 
                    defer.reject(reason)
                }
            )
            return defer.promise; 
        }

        return{
            get:get
        }
    }])
})