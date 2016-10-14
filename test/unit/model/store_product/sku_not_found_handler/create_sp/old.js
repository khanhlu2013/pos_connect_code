describe('model.store_product.sku_not_found_handler.create_sp.old',function(){
    var service;
    var prompt_sp_mock = jasmine.createSpy();
    var sp_rest_mock = {
        insert_old : jasmine.createSpy()
    }
    beforeEach(module('model.store_product',function($provide){
        $provide.value('model.store_product.prompt',prompt_sp_mock);
        $provide.value('model.store_product.rest_crud',sp_rest_mock);
    }));
    beforeEach(inject(function($injector){
        service = $injector.get('model.store_product.sku_not_found_handler.create.old')
    }))

    it('can prompt sp then ajax rest to server to create',inject(['$q','$rootScope',function($q,$rootScope){
        var product_id = 'product_id';
        var suggest_product = {
            product_id : product_id
        };
        var sku = 'sku';
        var prompt_defer = $q.defer();
        prompt_sp_mock.and.returnValue(prompt_defer.promise);
        var service_result;
        service(suggest_product,sku).then(
            function(res){
                service_result = res;
            }
        )
        expect(prompt_sp_mock).toHaveBeenCalledWith(null/*original_sp*/,suggest_product,null/*duplicate_sp*/,sku,false/*is_operate_offline*/);

        //train sp_crud_rest
        var insert_old_defer = $q.defer();
        sp_rest_mock.insert_old.and.returnValue(insert_old_defer.promise);

        //resolve prompt promise
        var prompt_result_sp = 'prompt_result_sp';
        var prompt_result = {
            sp:prompt_result_sp
        }
        prompt_defer.resolve(prompt_result);
        $rootScope.$digest();
        expect(sp_rest_mock.insert_old).toHaveBeenCalledWith(suggest_product.product_id,sku,prompt_result.sp)

        //resolve insert_old_defer
        var insert_old_result = 'insert_old_result';
        insert_old_defer.resolve(insert_old_result);
        $rootScope.$apply();
        expect(service_result).toEqual(insert_old_result);
    }]));
})