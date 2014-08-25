define(
[   
     'angular'
    //------------------     
    ,'ui_bootstrap'
    ,'service/csrf'
    ,'controller/menu'
    ,'app/sale_app/controller'
    ,'app/mix_match_app/model'
    ,'blockUI'
]
,function
(
     angular
)
{
    var app = angular.module('sale_app',
    [
         'ui.bootstrap'
        ,'service/csrf'     
        ,'controller.menu'      
        ,'sale_app/controller'
        ,'mix_match_app/model'
        ,'blockUI'
    ]);
    
    app.config(function(blockUIConfigProvider) {
        // blockUIConfigProvider.message('Please wait ... ');
        blockUIConfigProvider.delay(100);
    });

    app.run(['$rootScope','mix_match_app/model/Mix_match',function($rootScope,Mix_match){
        //init global variable
        $rootScope.GLOBAL_SETTING = {
             store_id : STORE_ID
            ,mix_match_lst : _MM_LST_.map(Mix_match.build)
            ,tax_rate : _TAX_RATE_
        }

        delete window._MM_LST_;
        delete window._TAX_RATE_;
    }])
});