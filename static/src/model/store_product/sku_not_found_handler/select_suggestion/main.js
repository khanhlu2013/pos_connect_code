var mod = angular.module('model.store_product');
mod.factory('model.store_product.sku_not_found_handler.select_suggestion',[
     '$modal'
    ,'$q' 
    ,'model.store_product.sku_not_found_handler.select_suggestion.store_product'
    ,'model.store_product.sku_not_found_handler.select_suggestion.product'    
,function(
     $modal
    ,$q
    ,select_sp
    ,select_product
){
    /*
                                       |
                                       |
                                       V
                <--------------------START----------------------->
                |                      |                         |
                |                      |                         |
                |                      V                         |
                |  |-------------> CREATE_NEW <---------------|  |
                V  |                                          |  V
             ADD_SKU  <-----------------------------------> ADD_PRODUCT
                |                                                |
                |                                                |
                |------------------> CANCEL <--------------------|
                |                                                |
                |                                                |
                V                                                V
            RETURN_SP                                       RETURN PRODUCT

    */
    return function(product_lst,my_sp_lst,sku){
        var defer = $q.defer();

        if(product_lst.length === 0 && my_sp_lst.length === 0){
            defer.resolve(null);
        }else if(my_sp_lst.length !== 0){
            select_sp(product_lst,my_sp_lst,sku).then(
                function(response){
                    defer.resolve(response);
                }
                ,function(reason){
                    defer.reject(reason);
                }
            )
        }else /*if(product_lst.length !== 0) -- this must be the only case left*/{
            select_product(product_lst,my_sp_lst,sku).then(
                function(response){
                    defer.resolve(response);
                }
                ,function(reason){
                    defer.reject(reason);
                }
            )
        }

        return defer.promise;
    }    
}]);