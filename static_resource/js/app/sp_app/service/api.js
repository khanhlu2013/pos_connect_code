define(
[
    'angular'
]
,function
(
    angular
)
{
    var mod = angular.module('sp_app/service/api',[]);
    mod.factory('sp_app/service/api',['$http','$q',function($http,$q){
    	return {
    		name_search: function(name_search_str){
		        name_search_str = name_search_str.trim();

		        if(name_search_str.length == 0){
		            var defer = $q.defer();defer.reject('error: name search is empty');return defer.promise;
		        }
		        
		        var words = name_search_str.split(' ');
		        if(words.length > 2){
		            var defer = $q.defer();defer.reject('error: search 2 words maximum');return defer.promise;
		        }

		        var promise_ing = $http({
		            url: '/product/angular_product_page_search_by_name',
		            method : "GET",
		            params: {name_str:name_search_str}
		        });

		        var promise_ed = promise_ing.then(
		        	function(data){

		        	},function(reason){
		        		return $q.reject('name search ajax error');
		        	}
		        )
    		}














    		// sku_search: function(sku_search_str){
		    //     sku_search_str = sku_search_str.trim();
		    //     if(sku_search_str.length == 0){
		    //     	var defer=$q.defer();defer.reject('error: sku is empty';return defer.promise;
		    //     }    			

		    //     if(sku_search_str.indexOf(' ') >= 0){
		    //     	var defer=$q.defer();defer.reject('error: sku contain space';return defer.promise;
		    //     }		        

		    //     var promise_ing = $http({
		    //         url:'/product/angular_product_page_search_by_sku',
		    //         method:'GET',
		    //         params:{sku_str:sku_search_str}
		    //     });

		    //     var promise_ed = promise_ing.then(
		    //     	function(data){
		    //     		return data.data;
		    //     	},
		    //     	function(){
		    //     		return $q.reject('sku search ajax error');
		    //     	}
		    //     )
		    //     return promise_ed;
    		// }
    	}
    }])
})