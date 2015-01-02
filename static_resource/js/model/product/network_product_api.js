/*
    there are 2 places where we need network info. one place is where we scan the sku and it is not found. In this case, we only care about the main product info without
    worry about the sale data. Another place is inside the product.info where we search for network product info and here we include the sale data. This file contain 
    api that get 2 peice of data from the server: the main network_product info as well as the sale. (the first case only get the network_product data).

    ok lets talk about the second case which is cover in this file. 
        One question from you would be why did not i include the sale data from the server and just simply response
            that network_product info with sale data embeded. The problem is i am using the Product.build to build this network_product. And i don't like to contaminate the sale data
            into this build function. That is why the server don't inject the sale data into network_product, which will be the ideal solution for security purpose - why? we don't expose 
            the store id which is needed for combining network_product info with the sale). 
        Second question: why do we have to inject the sale data into the network_product. we can we just simply use 2 separate data to display. Answer: we are using this network_product
            info in 2 places as discuss in the begining. For this i factor out the html code to include. However, there is a mix-match and that is one with sale data and one without sale
            data. it is kind of a hack/dirty fix but it is so conveninent to inject this sale data into network_product so that we can use the same template that is factored out.

*/

define(
[
     'angular'
    ,'model/product/model'
]
,function
(
    angular
)
{
    var mod = angular.module('sp/network_product_api',
    [
        'product/model'
    ]);
    mod.factory('sp/network_product_api',
    [
         '$http'
        ,'$q'
        ,'product/model/Product'
    ,function(
         $http
        ,$q
        ,Product
    ){
        function _get_sale_data_from_lst_base_on_store_id(store_id,sale_data_lst){
            var result = null;
            for(var i=0;i<sale_data_lst.length;i++){
                if(sale_data_lst[i].store_id === store_id){
                    result = sale_data_lst[i].sale;
                }
            }
            return result;
        }

        return function(product_id){
            var defer = $q.defer();
            $http({
                 url : '/product/network_product'
                ,method: 'GET'
                ,params:{
                    product_id : JSON.stringify(product_id)
                }
            }).then(
                function(data){
                    var product = Product.build(data.data.product);
                    var sale_data = data.data.sale;
                    if(sale_data !== undefined){
                        for(var i = 0;i<product.sp_lst.length;i++){
                            var cur_sp = product.sp_lst[i];
                            cur_sp.sale = _get_sale_data_from_lst_base_on_store_id(cur_sp.store_id,sale_data);
                        }
                    }
                    defer.resolve(product);
                },function(response){
                    defer.reject(response);
                }
            )
            return defer.promise;
        }    
    }])
})