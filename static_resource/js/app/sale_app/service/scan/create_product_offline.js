define(
[
     'angular'
    //--------
    ,'app/sp_app/service/prompt'
    ,'service/db'
    ,'app/sp_app/model'
    ,'app/sale_app/service/search/sp_api'
]
,function
(
    angular
)
{
    var mod = angular.module('sale_app/service/scan/create_product_offline',
    [
         'sp_app/service/prompt'
        ,'service/db'
        ,'sp_app/model'
        ,'sale_app/service/search/sp_api'
    ]);
    mod.factory('sale_app/service/scan/create_product_offline',
    [
         '$q'
        ,'$rootScope' 
        ,'sp_app/service/prompt'
        ,'service/db/get'
        ,'sp_app/model/Store_product'
        ,'sale_app/service/search/sp_api'
    ,function(
         $q
        ,$rootScope
        ,sp_prompt
        ,get_pouch_db
        ,Store_product
        ,offline_sp_api
    ){
        return function(sku){
            var defer = $q.defer();

            sp_prompt(null/*original_sp*/,null/*suggest_product*/,null/*duplicate_sp*/,sku).then(
                function(data){
                    var sp = data.sp;
                    var doc = {
                        id                      : null,
                        product_id              : null,
                        breakdown_assoc_lst     : [],
                        store_id                : $rootScope.GLOBAL_SETTING.store_id,
                        sku_lst                 : [sku],
                        d_type                  : $rootScope.GLOBAL_SETTING.store_product_document_type,
                        name                    : sp.name,
                        price                   : sp.price,
                        value_customer_price    : (sp.value_customer_price === undefined ? null : sp.value_customer_price),
                        crv                     : (sp.crv === undefined ? null : sp.crv),
                        is_taxable              : sp.is_taxable,
                        is_sale_report          : sp.is_sale_report,
                        p_type                  : (sp.p_type === undefined ? null : sp.p_type),
                        p_tag                   : (sp.p_tag === undefined ? null : sp.p_tag),
                        cost                    : (sp.cost === undefined ? null : sp.cost),
                        vendor                  : (sp.vendor === undefined ? null : sp.vendor),
                        buydown                 : (sp.buydown === undefined ? null : sp.buydown)
                    }

                    var pouch = get_pouch_db();
                    pouch.post(doc).then(
                        function(response){
                            offline_sp_api.by_sp_doc_id(response.id).then(
                                 function(sp){ defer.resolve(sp); }
                                ,function(reason){ defer.reject(reason); }
                            )
                        }
                        ,function(reason){ defer.reject(reason); }
                    )
                }
                ,function(reason){defer.reject(reason);}
            )

            return defer.promise;
        }
    }])
})