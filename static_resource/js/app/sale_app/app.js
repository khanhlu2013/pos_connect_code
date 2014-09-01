define(
[   
     'angular'
    //------------------     
    ,'ui_bootstrap'
    ,'service/csrf'
    ,'controller/menu'
    ,'app/sale_app/controller'
    ,'blockUI'
    ,'service/init_global_setting'
    ,'lib/hotkeys'
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
        ,'blockUI'
        ,'service/init_global_setting'
        ,'cfp.hotkeys'
    ]);
    
    app.config(function(blockUIConfigProvider) {
        // blockUIConfigProvider.message('Please wait ... ');
        blockUIConfigProvider.delay(100);
    });
    app.config(function(hotkeysProvider) {
        hotkeysProvider.includeCheatSheet = true;
    });
    app.run(['service/init_global_setting',function(init_global_setting){
        init_global_setting();
    }])
});