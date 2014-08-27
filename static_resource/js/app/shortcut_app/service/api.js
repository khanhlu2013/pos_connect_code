define(
[
    'angular'
]
,function
(
    angular
)
{

    var mod = angular.module('shortcut_app/service/api', []);
    mod.factory('shortcut_app/service/api',['$http','$q',function($http ,$q )
    {
        function get(){
            var defer = $q.defer();
            $http({
                url:'/sale_shortcut/get',
                method:'GET',
            }).then(
                 function(data){ defer.resolve(data.data); }
                ,function(reason){ defer.reject('get shortcut list ajax error')}
            )
            return defer.promise; 
        }

        return{
            get:get
        }
    }])
})