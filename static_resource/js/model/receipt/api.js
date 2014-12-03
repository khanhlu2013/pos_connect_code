define(
[
     'angular'
    //-----
    ,'service/date'
    ,'model/receipt/model'

]
,function
(
    angular
)
{
    var mod = angular.module('receipt/api',
    [
         'service/date'
        ,'receipt/model'
    ]);

    mod.factory('receipt/api',
    [
         '$http'
        ,'$q'
        ,'$filter'
        ,'service/date/get_timezone_offset'
        ,'receipt/model/Receipt'
    ,function(
         $http
        ,$q
        ,$filter
        ,get_timezone_offset
        ,Receipt
    ){
        return{
            get_receipt_pagination: function(date_from,date_to,cur_page,receipt_per_page){
                var defer = $q.defer();
                var server_accepted_format = "M/d/yyyy";
                $http({
                    url:'/receipt/get_receipt_pagination',
                    method:'GET',
                    params:{
                        cur_page:cur_page,
                        receipt_per_page:receipt_per_page,
                        from_date:$filter('date')(date_from,server_accepted_format),
                        to_date:$filter('date')(date_to,server_accepted_format),
                        time_zone_offset: get_timezone_offset()
                    }
                })
                .then(
                    function(data){
                        var result = {};
                        result.receipt_lst = data.data.receipt_lst.map(Receipt.build);
                        result.total = data.data.total;
                        defer.resolve(result);
                    },function(reason){
                        defer.reject(reason);
                    }
                );              
                return defer.promise;
            }
            ,get_receipt_by_range: function(date_from,date_to){
                var defer = $q.defer();

                var server_accepted_format = "M/d/yyyy";
                $http({
                    url:'/receipt/get_receipt_by_range',
                    method:'GET',
                    params:{
                        from_date:$filter('date')(date_from,server_accepted_format),
                        to_date:$filter('date')(date_to,server_accepted_format),
                        time_zone_offset: get_timezone_offset()
                    }
                }).then(
                    function(data){ 
                        defer.resolve(data.data.map(Receipt.build)); 
                    }
                    ,function(reason){ 
                        return defer.reject(reason); 
                    }
                );              
                return defer.promise;
            }       
            ,get_receipt_by_count: function(count){
                var defer = $q.defer();

                $http({
                    url:'/receipt/get_receipt_by_count',
                    method:'GET',
                    params:{ count: count }
                }).then(
                    function(data){ 
                        defer.resolve(data.data.map(Receipt.build)); 
                    }
                    ,function(reason){ 
                        defer.reject(reason); 
                    }
                );              
                return defer.promise;                
            }
            ,get_item : function(id){
                var defer = $q.defer();

                $http({
                    url:'/receipt/get_item',
                    method:'GET',
                    params:{ id: id }
                }).then(
                    function(data){ 
                        defer.resolve(Receipt.build(data.data));
                    }
                    ,function(reason){ 
                        defer.reject(reason); 
                    }
                );              
                return defer.promise;                     
            }
            ,get_item_base_on_doc_id : function(doc_id){
                var defer = $q.defer();

                $http({
                    url:'/receipt/get_item_base_on_doc_id',
                    method:'GET',
                    params:{ doc_id: doc_id }
                }).then(
                    function(data){ 
                        defer.resolve(Receipt.build(data.data));
                    }
                    ,function(reason){ 
                        defer.reject(reason); 
                    }
                );              
                return defer.promise;                   
            }
            ,adjust_receipt_tender : function(id,tender_ln_lst){
                var defer = $q.defer();
                $http({
                    url:'/receipt/adjust_receipt_tender',
                    method:'POST',
                    data:{id:id,tender_ln_lst:JSON.stringify(tender_ln_lst)}
                }).then(
                    function(data){ 
                        defer.resolve(Receipt.build(data.data));
                    }
                    ,function(reason){ 
                        defer.reject(reason); 
                    }
                );              
                return defer.promise;                 
            }
        }
    }])
})