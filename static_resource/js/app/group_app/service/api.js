define(
[
    'angular'
    //---
    ,'app/group_app/model'
]
,function
(
    angular
)
{
    var mod = angular.module('group_app/service/api',['group_app/model']);
    mod.factory('group_app/service/api',['$http','$q','group_app/model/Group',function($http,$q,Group){
    	return{
            create:function(group_prompt_result){
                var promise = $http({
                    url:'/group/insert_angular',
                    method:'POST',
                    data:{group:JSON.stringify(group_prompt_result)}
                });
                return promise.then(
                    function(data){
                        return Group.build(data.data);
                    },
                    function(){
                        return $q.reject('insert ajax error');
                    }
                );
            },
            get_lst:function(){
    			/*
					data return is a group but not containing breakdown product for speed reason
    			*/
 				var promise_ing = $http({
    				url:'/group/get_lst',
    				method:'GET',
    			});    			
    			var promise_ed = promise_ing.then(
    				function(data){
    					return data.data.map(Group.build);
    				},function(){
    					return $q.reject('get group list ajax error');
    				}
    			)
    			return promise_ed;
    		},
            get_item:function(group_id){
				var promise_ing = $http({
					url:'/group/get_item',
					method:'GET',
					params:{group_id:group_id}
				});
				var promise_ed = promise_ing.then(
					function(data){
						return Group.build(data.data);
					},function(){
						$q.reject('get group item ajax error');
					}
				)
				return promise_ed;
    		}
    	}
    }])
})