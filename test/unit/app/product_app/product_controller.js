describe("product_app -> controller", function () {

    var $controller;
    beforeEach(module('app.productApp'));
    beforeEach(inject(function(_$controller_){
        // The injector unwraps the underscores (_) from around the parameter names when matching
        $controller = _$controller_;
    })); 

    it("can search for sku",function(){
        var $scope = {};
        var controller = $controller('app.productApp.productCtrl',{$scope:$scope});
    })
});