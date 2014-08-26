/*
    module with 1 service to create either online or offline ( if internet is disconnected ) _TODO_ for offline
*/
define(
[
     'angular'
    //-------
    ,'app/sp_app/service/api/search'
    ,'app/sp_app/service/create'
]
,function
(
    angular
)
{
    var mod = angular.module('sale_app/service/scan/sku_scan_not_found_handler',
    [
         'sp_app/service/api/search'
        ,'sp_app/service/create'
    ]);

    mod.factory('sale_app/service/scan/sku_scan_not_found_handler',
    [
         '$q'
        ,'sp_app/service/api/search'
        ,'sp_app/service/create'    
    ,function(
         $q
        ,search_sp_api   
        ,create_sp_service    
    ){
        return function(sku){
            var defer = $q.defer();

            search_sp_api.sku_search(sku).then(
                function(data){
                    if(data.prod_store__prod_sku__1_1.length != 0){
                        defer.reject('Error: online and offline database is not in sync. Refresh the page and try again.');
                    }else{
                        var promise = create_sp_service(data.prod_store__prod_sku__0_0,data.prod_store__prod_sku__1_0,sku).then
                        (
                             function(created_sp){ defer.resolve(created_sp) }
                            ,function(reason){ defer.reject(reason); }
                        );                        
                    }
                }
                ,function(reason){ defer.reject(reason); }
            )
            return defer.promise;
        }
    }])
})