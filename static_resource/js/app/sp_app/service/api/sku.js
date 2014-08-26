define(
[
    'angular'
    //
    ,'app/sp_app/model'
]
,function
(
    angular
)
{
    var mod = angular.module('sp_app/service/api/sku',
    [
        'sp_app/model'
    ]);
    mod.factory('sp_app/service/api/sku',
    [
         '$http'
        ,'$q'
        ,'sp_app/model/Store_product'
    ,function(
         $http
        ,$q
        ,Store_product
    ){
    	return{
    		add_sku : function(product_id,sku){
				var promise_ing = $http({
					url:'/product/sku_add_angular',
					method:'POST',
					data: {product_id:product_id,sku_str:sku}
				});
				var promise_ed = promise_ing.then(
					 function(data){ return Store_product.build(data.data); }
					,function(reason){ return $q.reject('adding sku from another store for exiting product ajax error'); }
				)    			
				return promise_ed;
    		},

            delete_sku : function(product_id,sku){
                var promise_ing = $http({
                    url:'/product/sku_assoc_delete_angular',
                    method:'POST',
                    data:{product_id:product_id,sku_str:sku}
                });
                var promise_ed = promise_ing.then(
                     function(data){ var defer=$q.defer();defer.resolve(Store_product.build(data.data));return defer.promise; }
                    ,function(reason){ return $q.reject('deleting sku subription ajax error'); }
                )        
                return promise_ed;        
            }
    	}
    }])
})