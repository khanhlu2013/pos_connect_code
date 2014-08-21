define(
[
     'angular'
    //-------
    ,'service/db' 
]
,function
(
    angular
)
{
    var mod = angular.module('sale_app/service/search/name_sku_api',['service/db']);
    mod.factory('sale_app/service/search/name_sku_api',['service/db/get',function(get_db){
        return function(name_sku_search_str){
            return get_db().search({
                query: name_sku_search_str,
                fields: ['name'],
                include_docs: true,
            }).then(function(res){return res.rows})
        }
    }])
})