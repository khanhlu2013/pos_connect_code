describe('model.store_product.search.online.multiple.controller',function(){
    var scope,$rootScope;
    var modal_instance_mock = {
        close:jasmine.createSpy(),
        dismiss:jasmine.createSpy()
    }
    var sp_rest_search = {
        by_name_sku:jasmine.createSpy()
    }
    var infinite_scroll_handler_mock = jasmine.createSpy();

    beforeEach(module('model.store_product',function($provide){
        $provide.value('$modalInstance',modal_instance_mock);
        $provide.value('model.store_product.rest_search',sp_rest_search);
        $provide.value('model.store_product.search.online.infinite_scroll_handler',infinite_scroll_handler_mock)
    }));

    beforeEach(inject(function(_$rootScope_,$controller){
        $rootScope = _$rootScope_;
        scope = $rootScope.$new();
        $controller('model.store_product.search.online.multiple.controller',{
            $scope:scope,
        })

    }));

    it('has scope.ok() that return the result_sp_lst',inject(function(){
        var result_sp_lst = [1,2,3];
        scope.result_sp_lst = result_sp_lst;
        scope.ok();
        expect(modal_instance_mock.close).toHaveBeenCalledWith(result_sp_lst);
    }));

    it('has scope.is_sp_selected(sp) that can test if an sp is selected',inject(function(){
        var sp_1 = {id:1};
        var sp_2 = {id:2};
        scope.result_sp_lst = [sp_1];
        expect(scope.is_sp_selected(sp_1)).toEqual(true);
        expect(scope.is_sp_selected(sp_2)).toEqual(false);
    }));

    it('has scope.reset() that make scope.result_sp_lst to []',inject(function(){
        scope.result_sp_lst = [1,2,3];
        scope.reset();
        expect(scope.result_sp_lst).toEqual([]);
    }));

    it('has scope.toogle_select(sp) that can select or un-select an sp',inject(function(){
        var sp = {id:1}
        scope.toggle_select(sp);
        expect(scope.result_sp_lst[0]).toEqual(sp);

        scope.toggle_select(sp);
        expect(scope.result_sp_lst).toEqual([]);
    }));

    it('has scope.remove(sp) that can remove an sp out of $scope.result_sp_lst',inject(function(){
        var sp_1 = {id:1}
        var sp_2 = {id:2}
        scope.result_sp_lst = [sp_1,sp_2];
        scope.remove(sp_1);
        expect(scope.result_sp_lst[0]).toEqual(sp_2);
    }));

    it('has scope.search() that clear out sp_lst on empty search string',inject(function(){
        scope.message = 'message';
        scope.sp_lst = [1,2,3];
        scope.search_str = ' ';
        scope.search();
        expect(scope.message).toEqual('');
        expect(scope.sp_lst).toEqual([]);
    }));

    it('has scope.search() that ajax name_sku search',inject(function($q){
        scope.search_str = 'abc ';
        var trim_search_str = scope.search_str.trim();

        //train rest search
        var defer = $q.defer();
        sp_rest_search.by_name_sku.and.returnValue(defer.promise)
        
        //execute test code
        scope.search();
        expect(scope.search_str).toEqual(trim_search_str);
        expect(sp_rest_search.by_name_sku).toHaveBeenCalledWith(trim_search_str,0/*after*/);

        //resolve
        var search_result = 'search_result';
        defer.resolve(search_result);
        $rootScope.$digest();
        expect(scope.sp_lst).toEqual(search_result);
    }));

    it('has scope.cancel() that close the dialog',inject(function(){
        scope.cancel();
        expect(modal_instance_mock.dismiss).toHaveBeenCalledWith('_cancel_');
    }) )

    it('has scope.infinite_scroll_handler that abort when $scope.search_str is undefined which is the case when we first load the page that cause infinite-scroll to trigger false-ly',inject(function(){
        scope.search_str = '';
        scope.infinite_scroll_handler();
        expect(infinite_scroll_handler_mock).not.toHaveBeenCalled();
    }));

    it('has scope.infinite_scroll_handler that call infinite_scroll_handler service',inject(function(){
        scope.search_str = 'abc';
        scope.infinite_scroll_handler();
        expect(infinite_scroll_handler_mock).toHaveBeenCalledWith(scope,scope.search_str,false/*name_sku_search*/,scope.sp_lst);
    }))
})