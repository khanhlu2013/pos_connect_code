define(
[
    'angular'
    //----
    ,'app/shortcut_app/service/prompt_child'
]
,function
(
    angular
)
{
    var mod = angular.module('shortcut_app/service/set_child',['shortcut_app/service/prompt_child']);
    mod.factory('shortcut_app/service/set_child',['$http','$q','shortcut_app/service/prompt_child',function($http,$q,prompt_child_service){
    	return function(parent_pos,child_pos,child){
    		var prompt_promise = prompt_child_service(child);
    		var set_promise = prompt_promise.then(
    			function(data){
    				var promise_ing = $http({
    					url:'/sale_shortcut/set_child_info',
    					method:'POST',
    					data:{
    						parent_position:parent_pos,
    						child_position:child_pos,
    						child_caption:data.caption,
    						product_id:data.store_product.product_id
    					}
    				})
    				var promise_ed = promise_ing.then(
    					function(data){
    						return data.data
    					},
    					function(reason){
    						return $q.reject('set child shortcut ajax error');
    					}
    				)
    				return promise_ed;
    			},
    			function(reason){
    				return $q.reject(reason);
    			}
    		)
    		return set_promise;
    	}
    }])
})