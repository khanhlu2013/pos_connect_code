define(
[   
     'angular'
    //------------------     
    ,'app/sp_app/controller'
    ,'service/menu'
    ,'ui_bootstrap'
    ,'service/csrf'
    ,'blockUI'
    ,'service/init_global_setting'    
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
        ,'service/init_global_setting'        
    ]);
    
    // app.config(function(blockUIConfig) {
    //     blockUIConfig.message = 'Please wait ... ';
    //     blockUIConfig.delay = 100;
    //     blockUIConfig.autoBlock = false;
    // });

    app.run(['service/init_global_setting',function(init_global_setting){
        init_global_setting();
    }])    
});
