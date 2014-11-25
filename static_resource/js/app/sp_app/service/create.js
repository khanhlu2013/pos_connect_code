define(
[
    'angular'
    //----
    ,'app/sp_app/service/prompt'
    ,'app/sp_app/service/api/sku'
    ,'app/sp_app/service/api/crud'
    ,'app/sp_app/service/suggest'
    ,'service/ui'
    ,'app/sp_app/model'
    ,'app/product_app/model'
]
,function
(
    angular
)
{
    var mod = angular.module('sp_app/service/create',
    [
         'sp_app/service/prompt'
        ,'sp_app/service/api/sku'
        ,'sp_app/service/api/crud'
        ,'sp_app/service/suggest'
        ,'service/ui'
        ,'sp_app/model'
        ,'product_app/model'
    ]);

    mod.factory('sp_app/service/create',
        [
             '$modal'
            ,'$filter'
            ,'$http'
            ,'$q'
            ,'sp_app/service/create/new'
            ,'sp_app/service/create/old'
            ,'sp_app/service/api/sku'
            ,'sp_app/service/suggest'
            ,'service/ui/alert'
            ,'sp_app/model/Store_product'
            ,'product_app/model/Product'
        ,function(
             $modal
            ,$filter
            ,$http
            ,$q
            ,create_new_sp_service
            ,create_old_sp_service
            ,api_sku
            ,new_suggest
            ,alert_service
            ,Store_product
            ,Product
        ){
        return function(product_lst,my_sp_lst,sku){
            var defer = $q.defer();
            new_suggest(product_lst,my_sp_lst,sku).then(
                function(select_option){
                    if(select_option === null)
                    {
                        create_new_sp_service(sku).then(
                            function(res){
                                defer.resolve(res);
                            },function(reason){
                                defer.reject(reason);
                            }
                        )
                    }
                    else if(select_option instanceof Store_product)
                    {
                        var cur_store_sp = select_option;
                        api_sku.add_sku(cur_store_sp.product_id,sku).then(
                            function(res){
                                defer.resolve(res);
                            },function(reason){
                                defer.reject(reason);
                            }
                        )
                    }
                    else if(select_option instanceof Product)
                    {
                        var suggest_product = select_option;
                        create_old_sp_service(suggest_product,sku).then(
                            function(res){
                                defer.resolve(res);
                            },function(reason){
                                defer.reject(reason);
                            }
                        )
                    }else{
                        alert_service('Bug: Unexpected select option:' + select_option.constructor.name);
                    }
                },
                function(reason){
                    defer.reject(reason);
                }
            );
            return defer.promise;
        }
    }]);

    mod.factory('sp_app/service/create/old',
    [
        '$http',
        '$q',
        'sp_app/service/prompt',
        'sp_app/service/api/sku',
        'sp_app/service/api/crud',
    function(
        $http,
        $q,
        prompt_service,
        api_sku,
        sp_crud_api
    ){
        return function(suggest_product,sku){
            var defer = $q.defer();
            prompt_service(null/*original_sp*/,suggest_product,null/*duplicate_sp*/,sku,false/*is_operate_offline*/).then(
                 function(prompt_data){ 
                    sp_crud_api.insert_old(suggest_product.product_id,sku,prompt_data.sp).then(
                        function(res){
                            defer.resolve(res);
                        },function(reason){
                            defer.reject(reason);
                        }
                    )
                }
                ,function(reason){ 
                    defer.reject(reason);
                }
            )
            return defer.promise;
        }
    }]);

    mod.factory('sp_app/service/create/new',
    [
         '$http'
        ,'$q'
        ,'sp_app/service/prompt'
        ,'sp_app/service/api/crud'
    ,function(
         $http
        ,$q
        ,prompt_service
        ,sp_crud_api
    ){
        return function(sku){
            var defer = $q.defer();
            prompt_service(null/*original_sp*/,null/*suggest_product*/,null/*duplicate_sp*/,sku,false/*is_operate_offline*/).then(
                 function(prompt_data){ 
                    sp_crud_api.insert_new(prompt_data.sp,sku).then(
                        function(res){
                            defer.resolve(res);
                        },function(reason){
                            defer.reject(reason);
                        }
                    )
                }
                ,function(reason){ 
                    defer.reject(reason);
                }
            );
            return defer.promise;
        }
    }]);
})