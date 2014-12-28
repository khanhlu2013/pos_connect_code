/*
    2 services in this file: create/edit offline_product using post/put (respectively) method on pouchdb
*/

define(
[
     'angular'
    //--------
    ,'model/sp/service/prompt'
    ,'service/db'
    ,'model/sp/model'
    ,'model/sp/api_offline'
]
,function
(
    angular
)
{
    var mod = angular.module('sale_app/service/offline_product',
    [
         'sp/service/prompt'
        ,'service/db'
        ,'sp/model'
        ,'sp/api_offline'
    ]);

    mod.factory('sale_app/service/offline_product/create',
    [
         '$q'
        ,'$rootScope' 
        ,'sp/service/prompt'
        ,'service/db/get'
        ,'sp/model/Store_product'
        ,'sp/api_offline'
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

            sp_prompt(null/*original_sp*/,null/*suggest_product*/,null/*duplicate_sp*/,sku,true/*is_operate_offline*/).then(
                function(data){
                    var sp = data.sp;
                    var doc = {
                        id                      : null,
                        product_id              : null,
                        breakdown_assoc_lst     : [],
                        store_id                : $rootScope.GLOBAL_SETTING.STORE_ID,
                        sku_lst                 : [sku],
                        d_type                  : $rootScope.GLOBAL_SETTING.STORE_PRODUCT_DOCUMENT_TYPE,
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
    }]);

    mod.factory('sale_app/service/offline_product/edit',
    [   
         '$q'
        ,'$rootScope' 
        ,'sp/service/prompt'
        ,'service/db/get'
        ,'sp/api_offline'
    ,function(
         $q
        ,$rootScope
        ,sp_prompt
        ,get_pouch_db
        ,offline_sp_api
    ){
        return function(offline_create_product){
            var defer = $q.defer();
            if(offline_create_product.product_id !== null || offline_create_product.id !== null){
                return $q.reject('Bug: this is not a created offline product');
            }

            sp_prompt(offline_create_product/*original_sp*/,null/*suggest_product*/,null/*duplicate_sp*/,null/*sku*/,true/*is_operate_offline*/).then(
                function(data){
                    var sp = data.sp;
                    var doc = {
                        _id                     : offline_create_product.sp_doc_id,
                        _rev                    : offline_create_product.get_rev(),
                        
                        id                      : null,
                        product_id              : null,
                        breakdown_assoc_lst     : offline_create_product.breakdown_assoc_lst,
                        store_id                : $rootScope.GLOBAL_SETTING.STORE_ID,
                        sku_lst                 : [offline_create_product.product.prod_sku_assoc_lst[0].sku_str],
                        d_type                  : $rootScope.GLOBAL_SETTING.STORE_PRODUCT_DOCUMENT_TYPE,
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
                    pouch.put(doc).then(
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
    }]);

})