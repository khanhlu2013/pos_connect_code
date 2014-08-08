define(
[
    'angular'
    //
    ,'app/sp_app/model'
]
,function
(
    angular
)
{
    var mod = angular.module('sp_app/service/api_kit',['sp_app/model']);
    mod.factory('sp_app/service/api_kit',['$http','$q','sp_app/model/Store_product',function($http,$q,Store_product){
        return{
            update : function(sp){
                var promise_ing = $http({
                    url:'/product/kit/update_angular',
                    method:'POST',
                    data:{sp:JSON.stringify(sp)}
                });
                var promise_ed = promise_ing.then(
                     function(data){return Store_product.build(data.data);}
                    ,function(){return $q.reject('update kit ajax error');}
                )
                return promise_ed;
            }
        }
    }])
})
