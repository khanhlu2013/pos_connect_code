define(
[   
     'angular'
    //------------------     
    ,'ui_bootstrap'
    ,'service/csrf'
    ,'service/menu'
    ,'app/sale_app/controller'
    ,'blockUI'
    ,'service/init_global_setting'
    ,'angular_hotkey'
]
,function
(
     angular
)
{
    var app = angular.module('sale_app',
    [
         'ui.bootstrap'
        ,'service.csrf'     
        ,'service.menu'      
        ,'sale_app/controller'
        ,'blockUI'
        ,'service/init_global_setting'
        ,'cfp.hotkeys'
    ]);
    
    app.config(['blockUIConfig',function(blockUIConfig) {
        blockUIConfig.message = 'Please wait ..... ';
        blockUIConfig.autoBlock = false;
        blockUIConfig.delay = 0;
    }]);

    app.config(['hotkeysProvider',function(hotkeysProvider) {
        hotkeysProvider.includeCheatSheet = true;
    }]);

    app.constant('IS_USE_VALUE_CUSTOMER_PRICE','IS_USE_VALUE_CUSTOMER_PRICE');
    app.run(['service/init_global_setting',function(init_global_setting){
        init_global_setting();
    }])
});