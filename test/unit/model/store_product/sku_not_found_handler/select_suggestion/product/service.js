describe('model.store_product.sku_not_found_handler.select_suggestion.product',function(){
    var createService;
    var dummy_dialog_result = 'dummy_dialog_result';
    var modal_mock = {
        open:jasmine.createSpy().and.returnValue({result:dummy_dialog_result})  
    }
    beforeEach(module('app.productApp.partial'))
    beforeEach(module('model.store_product',function($provide){
        $provide.value('$modal',modal_mock);
    }));
    beforeEach(inject(function($injector){
        createService = function(){
            return $injector.get('model.store_product.sku_not_found_handler.select_suggestion.product');
        }
    }));

    it('can return $modal.open()',inject(function(){
        var service = createService();
        var dialog_result = service();
        expect(dialog_result).toEqual(dummy_dialog_result);
    }));

    it('can open modal with correct template',inject(function($templateCache){
        var service = createService();
        service();
        var arg = modal_mock.open.calls.mostRecent().args[0];
        expect(arg.template).toEqual($templateCache.get('model.store_product.sku_not_found_handler.select_suggestion.product.template.html'))
    }));

    it('can open modal with correct controller',inject(function(){
         var service = createService();
        service();
        var arg = modal_mock.open.calls.mostRecent().args[0];
        expect(arg.controller).toEqual('model.store_product.sku_not_found_handler.select_suggestion.product.controller');
    }));

    it('can open modal with correct resolve value',inject(function(){
        var product_lst = 'product_lst'
        var my_sp_lst = 'my_sp_lst';
        var sku = 'sku';
        var service = createService();
        service(product_lst,my_sp_lst,sku);
        
        var arg = modal_mock.open.calls.mostRecent().args[0];
        expect(arg.resolve.product_lst()).toEqual(product_lst);
        expect(arg.resolve.my_sp_lst()).toEqual(my_sp_lst);
        expect(arg.resolve.sku()).toEqual(sku);                
    }));
});