define(
[
     'angular'
    //-----
    ,'service/date'
    ,'app/receipt_app/model'

]
,function
(
    angular
)
{
    var mod = angular.module('receipt_app/service/api',['service/date','receipt_app/model']);

    mod.factory('receipt_app/service/api',['$http','$q','$filter','service/date/get_timezone_offset','receipt_app/model/Receipt',function($http,$q,$filter,get_timezone_offset,Receipt){
    	return{
 			get_receipt: function(date_from,date_to,cur_page,receipt_per_page){
                var server_accepted_format = "M/d/yyyy";
	 			var promise_ing = $http({
	                url:'/receipt/get_receipt',
	                method:'GET',
	                params:{
	                	cur_page:cur_page,
	                	receipt_per_page:receipt_per_page,
	                    from_date:$filter('date')(date_from,server_accepted_format),
	                    to_date:$filter('date')(date_to,server_accepted_format),
	                    time_zone_offset: get_timezone_offset()
	                }
	            });
	            var promise_ed = promise_ing.then(
	            	function(data){
	            		var result = {};
	            		result.receipt_lst = data.data.receipt_lst.map(Receipt.build);
	            		result.total = data.data.total;
 						return result;
	            	},function(reason){
	            		return $q.reject('get receipt data ajax error');
	            	}
	            );    			
	            return promise_ed;
    		}
 		}
    }])
})