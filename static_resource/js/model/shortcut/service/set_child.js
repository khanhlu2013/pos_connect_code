define(
[
    'angular'
    //----
    ,'model/shortcut/service/prompt_child'
]
,function
(
    angular
)
{
    var mod = angular.module('shortcut/service/set_child',
    [
        'shortcut/service/prompt_child'
    ]);
    mod.factory('shortcut/service/set_child',
    [
         '$http'
        ,'$q'
        ,'shortcut/service/prompt_child'
    ,function(
         $http
        ,$q
        ,prompt_child_service
    ){
    	return function(parent_pos,child_pos,child){
            var defer = $q.defer();
    		prompt_child_service(child)
    		.then(
    			function(prompt_data){
                    var post_data = 
                    {
                        parent_position:parent_pos,
                        child_position:child_pos,
                        child_caption:prompt_data.caption,
                        product_id:(prompt_data.store_product === null ? null : prompt_data.store_product.product_id)
                    };
    				$http({
    					url:'/sale_shortcut/set_child_info',
    					method:'POST',
    					data:{post_data:JSON.stringify(post_data)}
    				})
    				.then(
    					function(data){
    						defer.resolve(data.data);
    					},
    					function(reason){
                            defer.reject(reason);
    					}
    				)
    			},
    			function(reason){
    				defer.reject(reason);
    			}
    		)
    		return defer.promise;
    	}
    }])
})