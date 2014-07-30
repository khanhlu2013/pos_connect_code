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
    mod.factory('mix_match_app/service/api',['$http','$q','mix_match_app/model/Mix_match',function($http,$q,Mix_match){
    	return {
    		create : function(mm){
 				var promise_ing = $http({
					url:'/mix_match/insert_angular',
					method:'POST',
					data:{ mix_match:JSON.stringify(mm) }
				})
				var promise_ed = promise_ing.then(
					 function(data){ return Mix_match.build(data.data); }
					,function(reason){ return $q.reject('create mix match ajax error');}
				)
				return promise_ed;
    		}

            ,edit : function(mm){
                var promise_ing = $http({
                    url:'/mix_match/update_angular',
                    method:'POST',
                    data:{ mix_match:JSON.stringify(mm)}
                })
                var promise_ed = promise_ing.then(
                     function(data){ return Mix_match.build(data.data)}
                    ,function(reason){ return $q.reject('edit mix match ajax error');}
                );
                return promise_ed;
            }

            ,get_lst : function(){
                var promise_ing = $http({
                    url:'/mix_match/get',
                    method:'GET'
                });
                var promise_ed = promise_ing.then(
                     function(data){ return data.data.map(Mix_match.build); }
                    ,function(reason){ return $q.reject('get mix match lst ajax error');}
                )             
                return promise_ed;   
            }
    	}
    }])
})