define(
[   
     'angular'
    //------------------     
    ,'app/sp_app/controller'
    ,'service/menu'
    ,'ui_bootstrap'
    ,'service/csrf'
    ,'blockUI'
    ,'service/global_setting'    
    ,'infiniteScroll'
]
,function
(
     angular
)
{
    var app = angular.module('store_product_app',
    [
         'ui.bootstrap'
        ,'sp_app.controller'
        ,'service.menu'
        ,'service.csrf'
        ,'blockUI'
        ,'service/global_setting'   
        ,'infinite-scroll'    
    ]);
    
    app.config(['$sceDelegateProvider',function($sceDelegateProvider) {
        $sceDelegateProvider.resourceUrlWhitelist([
            // Allow same origin resource loads.
            'self',
            // Allow loading from our assets domain.  Notice the difference between * and **.
            'https://liquorkhanhlu2013.s3.amazonaws.com/**'
        ]);
    }]);

    app.config(['blockUIConfig',function(blockUIConfig) {
        blockUIConfig.message = 'Please wait ..... ';
        blockUIConfig.autoBlock = true;
        blockUIConfig.delay = 0;
    }]);

    app.run(['service/global_setting',function(global_setting){
        global_setting.set(_GLOBAL_SETTING_);
    }])    

});
