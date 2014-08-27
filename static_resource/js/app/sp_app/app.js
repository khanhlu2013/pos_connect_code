define(
[   
     'angular'
    //------------------     
    ,'app/sp_app/controller'
    ,'controller/menu'
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
        ,'controller.menu'
        ,'service/csrf'
        ,'blockUI'
        ,'service/init_global_setting'        
    ]);
    
    app.config(function(blockUIConfigProvider) {
        blockUIConfigProvider.message('Please wait ... ');
        blockUIConfigProvider.delay(100);
    });

    app.run(['service/init_global_setting',function(init_global_setting){
        init_global_setting();
    }])    
});
