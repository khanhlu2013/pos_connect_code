describe('model.store_product.sku_not_found_handler.select_suggestion.product.confirm',function(){
    var modal_mock = {
        open: jasmine.createSpy()
    }
    beforeEach(module('app.productApp.partial'));
    beforeEach(module('model.store_product',function($provide){
        $provide.value('$modal',modal_mock)
    }))

    it('can open modal with correct param',inject(function($injector,$templateCache){
        var service = $injector.get('model.store_product.sku_not_found_handler.select_suggestion.product.confirm');
        var network_product = 'dummy_network_product';
        var product_lst = 'dummy_product_lst';
        var my_sp_lst = 'dummy_my_sp_lst';
        var sku = 'dummy_sku';

        //mock modal
        var dummy_dlg_result = 'dummy_dlg_result';
        modal_mock.open.and.returnValue({
            result:dummy_dlg_result
        })
        var result = service(network_product,product_lst,my_sp_lst,sku);
        expect(result).toEqual(dummy_dlg_result);
        expect(modal_mock.open).toHaveBeenCalled();
        var arg = modal_mock.open.calls.mostRecent().args[0];

        expect(arg.template).toEqual($templateCache.get('model.store_product.sku_not_found_handler.select_suggestion.product.confirm.template.html'));
        expect(arg.controller).toEqual('model.store_product.sku_not_found_handler.select_suggestion.product.confirm.controller');
        expect(arg.resolve.network_product()).toEqual(network_product);
        expect(arg.resolve.product_lst()).toEqual(product_lst);        
        expect(arg.resolve.my_sp_lst()).toEqual(my_sp_lst);
        expect(arg.resolve.sku()).toEqual(sku);
    }))
})