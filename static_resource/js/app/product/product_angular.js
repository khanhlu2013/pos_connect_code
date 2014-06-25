define(
[   
     'angular'
    ,'app/store_product/sp_online_searcher'
    ,'lib/ui/ui'
]
,function
(
     angular
    ,sp_online_searcher
    ,ui

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
        $scope.sp_lst = [];

        $scope.sku_search = function(){
            $scope.sku_search_str = $scope.sku_search_str.trim();
            if($scope.sku_search_str.length == 0){
                return;
            }

            $scope.name_search_str = "";
            var promise = sp_online_searcher.sku_search_angular($scope.sku_search_str,$http);
            promise.success(function(data,status,header,config){
                $scope.sp_lst = data.prod_store__prod_sku_1_1;
                if($scope.sp_lst.length == 0){
                    ui.ui_alert('not found, product creator to be implemented');
                }
            });
            promise.error(function(data,status,header,config){
                ui.ui_alert('ajax failed');
            });
        }

        $scope.name_search = function(){
            $scope.name_search_str = $scope.name_search_str.trim();
            if($scope.name_search_str.length == 0){
                return;
            }

            $scope.sku_search_str = "";
            ui.ui_alert('name search: to be implemented');
        }
    });
    return product_app;
});
