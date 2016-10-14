describe('model.store_product.search.online.multiple.service',function(){
    var modal_mock = {
        open : jasmine.createSpy()
    }
    beforeEach(module('app.productApp.partial'));
    beforeEach(module('model.store_product',function($provide){
        $provide.value('$modal',modal_mock);
    }))
    it('can open modal with correct param',inject(function($injector,$templateCache){
        var service = $injector.get('model.store_product.search.online.multiple');
        var dlg_result = 'dlg_result';
        modal_mock.open.and.returnValue({
            result:dlg_result
        })
        var service_result = service();
        expect(service_result).toEqual(dlg_result);
        expect(modal_mock.open).toHaveBeenCalled();
        var arg = modal_mock.open.calls.mostRecent().args[0];
        expect(arg.size).toEqual('lg');
        expect(arg.controller).toEqual('model.store_product.search.online.multiple.controller');
        expect(arg.template).toEqual($templateCache.get('model.store_product.search.online.multiple.template.html'));
    }))
})