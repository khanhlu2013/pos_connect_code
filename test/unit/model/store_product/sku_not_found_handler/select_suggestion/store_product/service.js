describe('model.store_product.sku_not_found_handler.select_suggestion.store_product',function(){
    var $templateCache,service;
    var modal_mock = {
        open : jasmine.createSpy()
    }
    beforeEach(module('app.productApp.partial'));
    beforeEach(module('model.store_product',function($provide){
        $provide.value('$modal',modal_mock);
    }))
    beforeEach(inject(function(_$templateCache_,$injector){
        $templateCache = _$templateCache_;
        service = $injector.get('model.store_product.sku_not_found_handler.select_suggestion.store_product');
    }))

    it('can open modal with correct param',inject(function(){
        var product_lst = 'product_lst';
        var my_sp_lst = 'my_sp_lst';
        var sku = 'sku';

        //train modal result
        var modal_result = 'modal_result';
        modal_mock.open.and.returnValue({result:modal_result})
        service(product_lst,my_sp_lst,sku);

        expect(modal_mock.open).toHaveBeenCalled();
        var arg = modal_mock.open.calls.mostRecent().args[0];
        expect(arg.template).toEqual($templateCache.get('model.store_product.sku_not_found_handler.select_suggestion.store_product.template.html'));
        expect(arg.controller).toEqual('model.store_product.sku_not_found_handler.select_suggestion.store_product.controller');
        expect(arg.resolve.product_lst()).toEqual(product_lst);
        expect(arg.resolve.my_sp_lst()).toEqual(my_sp_lst);
        expect(arg.resolve.sku()).toEqual(sku);
    }))
})