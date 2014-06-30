define(
[   
     'angular'
    ,'app/store_product_angular_app/controllers'
    //------------------
    ,'ui_bootstrap'
    // ,'angular_animate'
]
,function
(
     angular
)
{
    var product_app = angular.module('store_product_app',['ui.bootstrap','store_product_app.controllers'  /*,'ngAnimate'*/]);

    product_app.directive('ngEnter', function () {
        return function (scope, element, attrs) {
            element.bind("keydown keypress", function (event) {
                if(event.which === 13) {
                    scope.$apply(function (){
                        scope.$eval(attrs.ngEnter);
                    });

                    event.preventDefault();
                }
            });
        };
    });

    product_app.filter('not_show_zero', function () {
        return function(input) {
            if(input == '$0.00'){
                return "";
            }else{
                return input
            }
        };
    });    

    return product_app;
});
