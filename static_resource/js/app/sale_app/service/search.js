define(
[
     'angular'
    //-----
    ,'service/db'
]
,function
(
    angular
)
{
	var MY_STORE_ID = STORE_ID;

    var mod = angular.module('sale_app/service/search',['service/db']);
    mod.factory('sale_app/service/search/sku',['$q','service/db/get',function($q,get_db){
    	return function(sku){
    		var db = get_db(MY_STORE_ID);
 			db.query('views/by_sku').then(function(result) {
 				console.log(result);
			});    		
    	}
    }])
})