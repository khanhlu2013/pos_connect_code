describe('model.store_product.sku_not_found_handler.select_suggestion.product.controller',function(){
    var scope,$rootScope,createController;
    var select_product_confirmation_mock = jasmine.createSpy();
    var modal_instance_mock = {
        dismiss:jasmine.createSpy(),
        close:jasmine.createSpy()
    }
    var modal_mock = {
        open:jasmine.createSpy()
    }
    var select_sp_service_mock = jasmine.createSpy();

    beforeEach(module('model.store_product',function($provide){
        $provide.value('model.store_product.sku_not_found_handler.select_suggestion.product.confirm',select_product_confirmation_mock)
        $provide.value('model.store_product.sku_not_found_handler.select_suggestion.store_product',select_sp_service_mock);
        $provide.value('$modalInstance',modal_instance_mock);
        $provide.value('$modal',modal_mock);
    }));

    beforeEach(inject(function(_$rootScope_,$controller){
        $rootScope = _$rootScope_;
        scope = $rootScope.$new();
        createController = function(product_lst,my_sp_lst,sku){
            $controller('model.store_product.sku_not_found_handler.select_suggestion.product.controller',{
                $scope : scope,
                product_lst : product_lst,
                my_sp_lst : my_sp_lst,
                sku : sku
            });
        }
    }))

    it('can init scope.product_lst, scope.my_sp_lst, scope.sku',function(){
        var product_lst = 'dummy_product_lst';
        var my_sp_lst = 'dummy_my_sp_lst';
        var sku = 'dummy_sku';
        createController(product_lst,my_sp_lst,sku);
        expect(scope.product_lst).toEqual(product_lst);
        expect(scope.my_sp_lst).toEqual(my_sp_lst);
        expect(scope.sku).toEqual(sku);
    });

    it('has scope.cancel() that close the modal',function(){
        createController();

        //execute testing code
        scope.cancel();
        expect(modal_instance_mock.dismiss).toHaveBeenCalledWith('_cancel_');
    });

    it('has scope.select_product() that invoke select_product_confirmation_modal and return its response',inject(function($q){
        var product_lst = 'dummy_product_lst';
        var my_sp_lst = 'dummy_my_sp_lst';
        var sku = 'dummy_sku';
        createController(product_lst,my_sp_lst,sku);

        //setup select product confirmation promise and modal.open
        modal_mock.open.and.returnValue({result:'a_dummy_result'})
        var defer = $q.defer();
        select_product_confirmation_mock.and.returnValue(defer.promise);

        //execute testing code
        var dummy_selected_product = 'dummy_selected_product';
        scope.select_product(dummy_selected_product);
        expect(select_product_confirmation_mock).toHaveBeenCalledWith(dummy_selected_product,product_lst,my_sp_lst,sku);

        //resove select_product_confirmation_modal promise
        var a_dummy_select_product_confirmation_response = 'a_dummy_select_product_confirmation_response';
        defer.resolve(a_dummy_select_product_confirmation_response);
        $rootScope.$digest();
        expect(modal_instance_mock.close).toHaveBeenCalledWith(a_dummy_select_product_confirmation_response);
    }));
})