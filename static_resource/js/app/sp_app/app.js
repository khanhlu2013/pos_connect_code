define(
[   
     'angular'
    //------------------     
    ,'app/sp_app/controller'
    ,'controller/menu'
    ,'ui_bootstrap'
    ,'service/csrf'
    ,'blockUI'
]
,function
(
     angular
)
{
    angular.module('store_product_app',['ui.bootstrap','sp_app.controller','controller.menu','service/csrf','blockUI'])
    .config(function(blockUIConfigProvider) {
        blockUIConfigProvider.message('Please wait ... ');
        blockUIConfigProvider.delay(100);
    });
});
