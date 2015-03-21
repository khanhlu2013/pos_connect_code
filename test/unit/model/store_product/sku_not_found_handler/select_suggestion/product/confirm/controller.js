describe('model.store_product.sku_not_found_handler.select_suggestion.product.confirm.controller',function(){
    var modal_instance_mock = {
        dismiss : jasmine.createSpy(),
        close : jasmine.createSpy()
    }
    var share_setting_mock = 'a_dummy_share_setting';
    var scope,createController;
    var modal_mock = {
        open:jasmine.createSpy().and.returnValue('a_dummy_modal_open_result')
    }
    beforeEach(module('model.store_product'))
    beforeEach(inject(function($rootScope,$controller){
        scope = $rootScope.$new();
        createController = function(network_product,product_lst,my_sp_lst,sku){
            $controller('model.store_product.sku_not_found_handler.select_suggestion.product.confirm.controller',{
                $scope:scope,
                $modalInstance:modal_instance_mock,
                share_setting:share_setting_mock,
                network_product: network_product,
                product_lst: product_lst,
                my_sp_lst: my_sp_lst,
                sku:sku
            });
        }
    }))

    it('has scope.cancel() that close the modal',function(){
        createController();
        scope.cancel();
        expect(modal_instance_mock.dismiss).toHaveBeenCalledWith('_cancel_');
    });

    it('has scope.return_product() that close the modal and return network_product',function(){
        var dummy_network_product = 'dummy_network_product';
        createController(dummy_network_product);
        scope.return_product();
        expect(modal_instance_mock.close).toHaveBeenCalledWith(dummy_network_product);
    });    
});

describe('model.store_product.sku_not_found_handler.select_suggestion.product.confirm.controller',function(){
    var $rootScope;
    var modal_instance_mock = {
        dismiss : jasmine.createSpy(),
        close : jasmine.createSpy()
    }
    var share_setting_mock = 'a_dummy_share_setting';
    var scope,createController;
    var modal_mock = {
        open:jasmine.createSpy().and.returnValue('a_dummy_modal_open_result')
    }
    var select_product_mock = jasmine.createSpy();
    beforeEach(module('model.store_product',function($provide){
        $provide.value('$modal',modal_mock);
        $provide.value('model.store_product.sku_not_found_handler.select_suggestion.product',select_product_mock);
    }));
    beforeEach(inject(function(_$rootScope_,$controller){
        $rootScope = _$rootScope_;
        scope = $rootScope.$new();
        createController = function(network_product,product_lst,my_sp_lst,sku){
            $controller('model.store_product.sku_not_found_handler.select_suggestion.product.confirm.controller',{
                $scope:scope,
                $modalInstance:modal_instance_mock,
                share_setting:share_setting_mock,
                network_product: network_product,
                product_lst: product_lst,
                my_sp_lst: my_sp_lst,
                sku:sku
            });
        }
    }));
    it('has scope.select_product() that is used to handle the back button',inject(function($q){
        //setup mock for select product
        var defer = $q.defer();
        select_product_mock.and.returnValue(defer.promise);
        var network_product = null;
        var product_lst = 'dummy_product_lst';
        var my_sp_lst = 'dummy_my_sp_lst';
        var sku = 'dummy_sku';
        createController(network_product,product_lst,my_sp_lst,sku);
        scope.select_product();
        expect(select_product_mock).toHaveBeenCalledWith(product_lst,my_sp_lst,sku);

        //resolve promise
        var dummy_response_from_select_product = 'dummy_response_from_select_product';
        defer.resolve(dummy_response_from_select_product);
        $rootScope.$digest();
        expect(modal_instance_mock.close).toHaveBeenCalledWith(dummy_response_from_select_product);
    })); 
});