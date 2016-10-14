describe('model.store_product.search.online.single.service',function(){
    var modal_mock = {
        open:jasmine.createSpy()
    }
    beforeEach(module('app.productApp.partial'));
    beforeEach(module('model.store_product',function($provide){
        $provide.value('$modal',modal_mock);
    }))

    it('can open modal with correct param',inject(['$injector','$templateCache',function($injector,$templateCache){
        var service = $injector.get('model.store_product.search.online.single');

        var dialog_result = 'dialog_result';
        modal_mock.open.and.returnValue({result:dialog_result})
        expect(service()).toEqual(dialog_result);

        expect(modal_mock.open).toHaveBeenCalled();
        var arg = modal_mock.open.calls.mostRecent().args[0];
        expect(arg.size).toEqual('lg');
        expect(arg.controller).toEqual('model.store_product.search.online.single.controller');
        expect(arg.template).toEqual($templateCache.get('model.store_product.search.online.single.template.html'))
    }]))
})