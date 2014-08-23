define(
[   
     'angular'
    //------------------     
    ,'ui_bootstrap'
    ,'service/csrf'
    ,'controller/menu'
    ,'app/sale_app/controller'
    ,'service/db'
    ,'app/mix_match_app/model'
]
,function
(
     angular
)
{
    angular.module('sale_app',
    [
         'ui.bootstrap'
        ,'service/csrf'     
        ,'controller.menu'      
        ,'sale_app/controller'
        ,'service/db'
        ,'mix_match_app/model'
    ])
    .run(['service/db/sync','$rootScope','mix_match_app/model/Mix_match',function(sync,$rootScope,Mix_match){
        sync(STORE_ID);

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
