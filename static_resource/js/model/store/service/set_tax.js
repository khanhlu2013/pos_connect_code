define(
[
    'angular'
    //-----
    ,'model/store/api_tax'
]
,function
(
    angular
)
{
    var mod = angular.module('store/service/set_tax',
    [
        'store/api_tax'
    ]);

    mod.factory('store/service/set_tax',
    [
         '$http'
        ,'$modal'
        ,'$q'
        ,'$rootScope'
        ,'service/ui/prompt'
        ,'store/api_tax'
    ,function(
         $http
        ,$modal
        ,$q
        ,$rootScope
        ,prompt_service
        ,store_api_tax
    ){
        return function(){
            var defer = $q.defer();

            prompt_service('enter tax rate',$rootScope.GLOBAL_SETTING.TAX_RATE/*prefill*/,false/*null is not allow*/,true/*is float*/)
            .then(
                function(prompt_data){
                    store_api_tax.set_tax(prompt_data).then(
                        function(new_tax_rate){
                            $rootScope.GLOBAL_SETTING.TAX_RATE = new_tax_rate;
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