define(
[   
    'angular'
]
,function
(
    angular
)
{
    var product_app = angular.module('product_app',[]);

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

    product_app.controller('ProductCtrl',function($scope,$http){
        $scope.product_lst = [];

        $scope.sku_search = function(){
            $scope.name_search_str = "";
        }

        $scope.name_search = function(){
            $scope.sku_search_str = "";
        }
    });
    return product_app;
});
