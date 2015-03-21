describe('model.store_product.sku_not_found_handler.select_suggestion.store_product.controller',function(){
    var scope,$rootScope,createController;
    var modal_instance_mock = {
        close: jasmine.createSpy(),
        dismiss : jasmine.createSpy()
    }
    var confirm_service_mock = jasmine.createSpy();
    var select_product_service_mock = jasmine.createSpy();

    beforeEach(module('model.store_product',function($provide){
        $provide.value('$modalInstance',modal_instance_mock);
        $provide.value('share.ui.confirm',confirm_service_mock);
        $provide.value('model.store_product.sku_not_found_handler.select_suggestion.product',select_product_service_mock);
    }))
    beforeEach(inject(function(_$rootScope_,$controller){
        $rootScope = _$rootScope_;
        scope = $rootScope.$new();
        createController = function(product_lst,my_sp_lst,sku){
            $controller('model.store_product.sku_not_found_handler.select_suggestion.store_product.controller',{
                $scope:scope,
                product_lst:product_lst,
                my_sp_lst:my_sp_lst,
                sku:sku
            })
        }

    }))

    it('can init product_lst,my_sp_lst,sku for the scope',inject(function(){
        var dummy_product_lst = 'dummy_product_lst';
        var dummy_my_sp_lst = 'dummy_sp_lst';
        var dummy_sku = 'dummy_sku';
        createController(dummy_product_lst,dummy_my_sp_lst,dummy_sku);
        expect(scope.product_lst).toEqual(dummy_product_lst);
        expect(scope.my_sp_lst).toEqual(dummy_my_sp_lst);
        expect(scope.sku).toEqual(dummy_sku);
    }));

    it('has the $scope.cancel() that close the modal',inject(function(){
        createController();
        scope.cancel();
        expect(modal_instance_mock.dismiss).toHaveBeenCalledWith('_cancel_');
    }));

    it('has $scope.return_sp(sp) - aka a ok_btn handler',inject(function($q){
        var dummy_product_lst = 'dummy_product_lst';
        var dummy_my_sp_lst = 'dummy_sp_lst';
        var dummy_sku = 'dummy_sku';
        createController(dummy_product_lst,dummy_my_sp_lst,dummy_sku);

        //before executing test code, lets train confirm_service response
        var defer = $q.defer();
        confirm_service_mock.and.returnValue(defer.promise);

        //execute test code
        var a_dummy_returned_sp = 'a_dummy_returned_sp';
        scope.return_sp(a_dummy_returned_sp);
        expect(confirm_service_mock).toHaveBeenCalled();

        //resolve confirm service
        defer.resolve();
        $rootScope.$digest();
        expect(modal_instance_mock.close).toHaveBeenCalledWith(a_dummy_returned_sp);
    }));

    it('has $scope.select_product()',inject(function($q){
        var dummy_product_lst = 'dummy_product_lst';
        var dummy_my_sp_lst = 'dummy_sp_lst';
        var dummy_sku = 'dummy_sku';
        createController(dummy_product_lst,dummy_my_sp_lst,dummy_sku);

        //before execute testing code, lets train select_product_service_mock response
        var defer = $q.defer();
        select_product_service_mock.and.returnValue(defer.promise);

        //execute testing code
        scope.select_product();        

        //resolve select product service 
        var dummy_selected_product = 'dummy_selected_product';
        defer.resolve(dummy_selected_product);
        $rootScope.$digest();
        expect(modal_instance_mock.close).toHaveBeenCalledWith(dummy_selected_product);
    }));

    it('has $scope.create_new_product() - aka a cancel_btn handler',inject(function(){
        createController();
        scope.create_new_product();
        expect(modal_instance_mock.close).toHaveBeenCalledWith(null);        
    }));


})