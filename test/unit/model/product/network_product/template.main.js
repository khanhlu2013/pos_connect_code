describe('model.product.network_product.main.html',function(){
    var $rootScope,$templateCache,scope,createController,view;
    beforeEach(module('app.productApp.partial'));
    beforeEach(module('share.filter'));
    beforeEach(module('model.product',function($provide){

    }));
    beforeEach(inject(function(_$rootScope_,_$templateCache_,$controller,$compile){
        $rootScope = _$rootScope_;
        scope = $rootScope.$new();
        $templateCache = _$templateCache_;
        createControllerAndView = function(share_setting){
            $controller('model.product.network_product.controller',{
                $scope:scope,
                share_setting:share_setting
            })
            var html = $templateCache.get('model.product.network_product.main.html');
            view = $compile(angular.element(html))(scope);
            scope.$digest();            
        }
    }));

    it('can be hidden or shown based on scope.network_product == null',function(){
        //init controller
        var share_setting_mock = {}
        createControllerAndView(share_setting_mock);

        //this view has only 1 wrapping div element
        expect(view.length).toEqual(1);

        //verify view is hide because we have not invoke controller.scope.init() to assign network_product
        expect(view.hasClass('ng-hide')).toEqual(true);

        //create network_product fixture and call scope.init(network_product)
        var network_product = {};
        network_product.get_suggest_extra = jasmine.createSpy();
        network_product.get_sp_lst = jasmine.createSpy().and.returnValue([]);
        scope.init(network_product);   
        scope.$digest();
        expect(view.hasClass('ng-hide')).toEqual(false);     
    })
})