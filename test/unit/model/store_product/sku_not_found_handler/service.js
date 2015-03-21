describe('model.store_product.sku_not_found_handler',function(){
    var service,$q,$rootScope;
    var select_suggestion_mock = jasmine.createSpy();
    var create_new_sp_mock = jasmine.createSpy();
    var create_old_sp_mock = jasmine.createSpy();
    var alert_service_mock = jasmine.createSpy();

    var sku_rest_mock = {
        add_sku : jasmine.createSpy()
    }
    beforeEach(module('model.store_product',function($provide){
        $provide.value('model.store_product.sku_not_found_handler.create.new',create_new_sp_mock);
        $provide.value('model.store_product.sku_not_found_handler.create.old',create_old_sp_mock);
        $provide.value('model.store_product.rest_sku',sku_rest_mock);
        $provide.value('model.store_product.sku_not_found_handler.select_suggestion',select_suggestion_mock);
        $provide.value('share.ui.alert',alert_service_mock);
    }));
    beforeEach(inject(function($injector,_$q_,_$rootScope_){
        $rootScope = _$rootScope_;
        $q = _$q_;
        service = $injector.get('model.store_product.sku_not_found_handler');
    }));

    it('can first invoke select suggestion',inject(function(){
        var product_lst = 'product_lst'
        var my_sp_lst = 'my_sp_lst';
        var sku = 'sku';

        //before executing testing code, lets create response for select_suggestion_service
        var defer = $q.defer();
        select_suggestion_mock.and.returnValue(defer.promise)

        //execute testing code
        service(product_lst,my_sp_lst,sku);
        expect(select_suggestion_mock).toHaveBeenCalledWith(product_lst,my_sp_lst,sku);
    }));

    it('can invoke and return create_new_sp service promise if select suggestion is none',inject(function(){
        var product_lst = 'product_lst'
        var my_sp_lst = 'my_sp_lst';
        var sku = 'sku';

        //before executing testing code, lets create response for select_suggestion_service
        var select_defer = $q.defer();
        select_suggestion_mock.and.returnValue(select_defer.promise)

        //execute testing code
        var service_result;
        service(product_lst,my_sp_lst,sku).then(
            function(res){
                service_result = res;
            }
        )
        //before resolve select_suggestion with null, lets train create_new_sp
        var create_new_sp_defer = $q.defer();
        create_new_sp_mock.and.returnValue(create_new_sp_defer.promise);

        //resolve null for select_suggestion
        select_defer.resolve(null);
        $rootScope.$digest();
        expect(create_new_sp_mock).toHaveBeenCalledWith(sku);

        //resolve create_new_sp_defer
        var create_new_sp_result = 'create_new_sp_result';
        create_new_sp_defer.resolve(create_new_sp_result);
        $rootScope.$apply();
        expect(service_result).toEqual(create_new_sp_result);
    }));

    it('can invoke add_sku service if select suggestion is a Store_product',inject(['model.store_product.Store_product',function(Store_product){
        var product_lst = 'product_lst'
        var my_sp_lst = 'my_sp_lst';
        var sku = 'sku';

        //before executing testing code, lets create response for select_suggestion_service
        var select_defer = $q.defer();
        select_suggestion_mock.and.returnValue(select_defer.promise)

        //execute testing code
        var service_result;
        service(product_lst,my_sp_lst,sku).then(
            function(res){
                service_result = res;
            }
        )
        //before resolve select_suggestion with a Store_product obj, lets train rest_sku
        var sku_rest_defer = $q.defer();
        sku_rest_mock.add_sku.and.returnValue(sku_rest_defer.promise);

        //resolve Store_product obj for select_suggestion
        var sp = new Store_product(1);
        select_defer.resolve(sp);
        $rootScope.$apply();
        expect(sku_rest_mock.add_sku).toHaveBeenCalledWith(sp.product_id,sku);

        //resolve sku_rest_defer
        var sku_rest_result = 'sku_rest_result';
        sku_rest_defer.resolve(sku_rest_result);
        $rootScope.$apply();
        expect(service_result).toEqual(sku_rest_result);
    }]));

    it('can invoke add_old_sp service if select suggestion is a Product',inject(['model.product.Product',function(Product){
        var product_lst = 'product_lst'
        var my_sp_lst = 'my_sp_lst';
        var sku = 'sku';

        //before executing testing code, lets create response for select_suggestion_service
        var select_defer = $q.defer();
        select_suggestion_mock.and.returnValue(select_defer.promise)

        //execute testing code
        var service_result;
        service(product_lst,my_sp_lst,sku).then(
            function(res){
                service_result = res;
            }
        )
        //before resolve select_suggestion with a Product obj, lets train create old service
        var create_old_defer = $q.defer();
        create_old_sp_mock.and.returnValue(create_old_defer.promise);

        //resolve Store_product obj for select_suggestion
        var product = new Product();
        select_defer.resolve(product);
        $rootScope.$apply();
        expect(create_old_sp_mock).toHaveBeenCalledWith(product,sku);

        //resolve create_old_defer
        var create_old_result = 'create_old_result';
        create_old_defer.resolve(create_old_result);
        $rootScope.$apply();
        expect(service_result).toEqual(create_old_result);
    }]));
})