define(
[
    'angular'
    //-----
    ,'model/store/api'
]
,function
(
    angular
)
{
    var mod = angular.module('store/service/set_tax',
    [
        'store/api'
    ]);

    mod.factory('store/service/set_tax',
    [
         '$http'
        ,'$modal'
        ,'$q'
        ,'$rootScope'
        ,'service/ui/prompt'
        ,'store/api'
    ,function(
         $http
        ,$modal
        ,$q
        ,$rootScope
        ,prompt_service
        ,store_api
    ){
        return function(){
            var defer = $q.defer();

            prompt_service('enter tax rate',$rootScope.GLOBAL_SETTING.tax_rate/*prefill*/,false/*null is not allow*/,true/*is float*/)
            .then(
                function(prompt_data){
                    store_api.set_tax(prompt_data).then(
                        function(new_tax_rate){
                            $rootScope.GLOBAL_SETTING.tax_rate = new_tax_rate;
                            defer.resolve(new_tax_rate);
                        },function(reason){
                            defer.reject(reason); 
                        }
                    )
                },
                function(reason){ 
                    defer.reject(reason); 
                }
            );
            return defer.promise;
        }
    }]);
})