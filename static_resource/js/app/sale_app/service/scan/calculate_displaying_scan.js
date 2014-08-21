define(
[
     'angular'
    //-------
    ,'app/sale_app/service/search/sp_api'
    ,'app/sale_app/model'
]
,function
(
    angular
)
{
    var mod = angular.module('sale_app/service/scan/calculate_displaying_scan',
	[
		 'sale_app/service/search/sp_api'
		,'sale_app/model'
	]);
 	mod.factory('sale_app/service/scan/calculate_displaying_scan',
	[
		 '$q'
		,'sale_app/service/search/sp_api'
		,'sale_app/model/Displaying_scan'
	,function(
		 $q
		,search_sp
		,Displaying_scan
	){
		function get_sp_base_on_pid(product_id,sp_lst){
			var result = null;
			for(var i = 0;i<sp_lst.length;i++){
				if(sp_lst[i].product_id === product_id){
					result = sp_lst[i];
					break;
				}
			}
			return result;
		}

		return function(ps_lst,mm_lst){
			var defer = $q.defer();

			var promise_lst = [];
			for(var i = 0;i<ps_lst.length;i++){
				if(ps_lst[i].product_id!=null){
					promise_lst.push(search_sp(ps_lst[i].product_id));
				}
 			}

			$q.all(promise_lst).then(
				function(sp_lst){
					var result = [];
					for(var i = 0;i<ps_lst.length;i++){
						var ps = ps_lst[i];
						result.push(
							new Displaying_scan(
					             (ps.product_id == null ? null : get_sp_base_on_pid(ps.product_id,sp_lst))
					            ,ps.non_product_name
					            ,ps.qty
					            ,ps.override_price
					            ,ps.discount
					            ,null//mm deal info
							)
						)
					}
					defer.resolve(result);
				}
				,function(reason){defer.reject(reason);}
			)

			return defer.promise;
		}
	}])
})