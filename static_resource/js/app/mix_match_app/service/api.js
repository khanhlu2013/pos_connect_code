define(
[
    'angular'
    //---
    ,'app/mix_match_app/model'
]
,function
(
    angular
)
{
    var mod = angular.module('mix_match_app/service/api',['mix_match_app/model']);
    mod.factory('mix_match_app/service/api',
    [
         '$http'
        ,'$q'
        ,'mix_match_app/model/Mix_match'
    ,function(
         $http
        ,$q
        ,Mix_match
    ){
    	return {
    		create : function(mm){
                var defer = $q.defer();
 				$http({
					url:'/mix_match/insert_angular',
					method:'POST',
					data:{ mix_match:JSON.stringify(mm) }
				})
				.then(
					function(data){ 
                        defer.resolve(Mix_match.build(data.data));
                    }
					,function(reason){ 
                        defer.reject(reason);
                    }
				)
				return defer.promise;
    		}

            ,edit : function(mm){
                var defer = $q.defer();
                $http({
                    url:'/mix_match/update_angular',
                    method:'POST',
                    data:{ mix_match:JSON.stringify(mm)}
                })
                .then(
                    function(data){ 
                        defer.resolve(Mix_match.build(data.data))
                    }
                    ,function(reason){ 
                        defer.reject(reason);
                    }
                );
                return defer.promise;
            }

            ,get_lst : function(){
                var defer = $q.defer();
                $http({
                    url:'/mix_match/get',
                    method:'GET'
                })
                .then(
                    function(data){ 
                        defer.resolve(data.data.map(Mix_match.build));
                    }
                    ,function(reason){ 
                        defer.reject(reason);
                    }
                )             
                return defer.promise;   
            }
    	}
    }])
})