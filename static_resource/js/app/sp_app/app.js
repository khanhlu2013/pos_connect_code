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
    
    app.config(['blockUIConfig',function(blockUIConfig) {
        blockUIConfig.message = 'Please wait ..... ';
        blockUIConfig.autoBlock = false;
        blockUIConfig.delay = 0;
    }]);

    app.run(['service/init_global_setting',function(init_global_setting){
        init_global_setting();
    }])    
});
