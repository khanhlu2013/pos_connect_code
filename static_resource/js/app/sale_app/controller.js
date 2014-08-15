define(
[
	 'angular'
    //--------
    ,'app/sale_app/service/search'

], function 
(
	 angular
)
{
	'use strict';
    var mod =  angular.module('sale_app/controller', ['sale_app/service/search']);
    mod.controller('MainCtrl', ['$scope','sale_app/service/search/sku',function($scope,search_sku_offline){
    	$scope.sku_search = function(){
            console.log($scope.sku_search_str);
    		search_sku_offline($scope.sku_search_str);
    	}
    }]);
});
