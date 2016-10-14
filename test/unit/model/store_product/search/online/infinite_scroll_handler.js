describe('model.store_product.search.online.infinite_scroll_handler',function(){
    var service,scope,$rootScope;
    var sp_rest_search_mock;
    
    beforeEach(module('model.store_product',function($provide){
        sp_rest_search_mock = {
            by_name:jasmine.createSpy(),
            by_name_sku:jasmine.createSpy()
        }        
        $provide.value('model.store_product.rest_search',sp_rest_search_mock)
    }));

    beforeEach(inject(function($injector,_$rootScope_){
        $rootScope = _$rootScope_;
        scope = $rootScope.$new();
        service = $injector.get('model.store_product.search.online.infinite_scroll_handler');
    }));

    it('can abort when scope.infinite_scroll_reach_the_end is true',inject(function(){
        scope.infinite_scroll_reach_the_end = true;
        service(scope,null/*search_str*/,true/*search by name only*/,[]/*sp_lst*/);
        expect(sp_rest_search_mock.by_name).not.toHaveBeenCalled();
        expect(sp_rest_search_mock.by_name_sku).not.toHaveBeenCalled();
    }));

    it('can define scope.infinite_scroll_busy if it is not defined',inject(function($q){
        scope.infinite_scroll_reach_the_end = false;
        var defer = $q.defer();
        sp_rest_search_mock.by_name_sku.and.returnValue(defer.promise);
        service(scope,'abc'/*search_str*/,false/*search_by_name_sku*/,[]/*sp_lst*/);
        expect(scope.infinite_scroll_busy).toEqual(true);
    }));

    it('can abort when scope.infinite_scroll_busy is true',inject(function(){
        var scope = {
            infinite_scroll_reach_the_end : false,
            infinite_scroll_busy:true
        }
        service(scope,null/*search_str*/,true/*search_by_name_only*/,[]/*sp_lst*/);
        expect(sp_rest_search_mock.by_name).not.toHaveBeenCalled();
        expect(sp_rest_search_mock.by_name_sku).not.toHaveBeenCalled();
    }));

    it('can call sp_rest_search.by_name based on the param',inject(function($q){
        scope.infinite_scroll_reach_the_end = false;
        var defer = $q.defer();
        sp_rest_search_mock.by_name.and.returnValue(defer.promise);
        var search_str = 'abc';
        var sp_lst_before = ['a','b'];
        var sp_lst = [];
        sp_lst.push.apply(sp_lst,sp_lst_before);
        service(scope,search_str,true/*search_by_name_only*/,sp_lst);
        
        //resolve search promise
        var search_result = [1,2,3];
        defer.resolve(search_result);
        $rootScope.$digest();

        expect(sp_rest_search_mock.by_name).toHaveBeenCalledWith(search_str,sp_lst_before.length/*after*/);
        var args = sp_rest_search_mock.by_name.calls.mostRecent().args;
        expect(scope.infinite_scroll_reach_the_end).toEqual(false);
        expect(scope.infinite_scroll_busy).toEqual(false);
        expect(sp_lst.length).toEqual(search_result.length + sp_lst_before.length);
    }));

    it('can call sp_rest_search.by_name_sku based on the param',inject(function($q){
        scope.infinite_scroll_reach_the_end = false;
        var defer = $q.defer();
        sp_rest_search_mock.by_name_sku.and.returnValue(defer.promise);
        var search_str = 'abc';
        var sp_lst_before = ['a','b'];
        var sp_lst = [];
        sp_lst.push.apply(sp_lst,sp_lst_before);
        service(scope,search_str,false/*search_by_name_sku*/,sp_lst);
        
        //resolve search promise
        var search_result = [1,2,3];
        defer.resolve(search_result);
        $rootScope.$digest();

        expect(sp_rest_search_mock.by_name_sku).toHaveBeenCalledWith(search_str,sp_lst_before.length/*after*/);
        var args = sp_rest_search_mock.by_name_sku.calls.mostRecent().args;
        expect(scope.infinite_scroll_reach_the_end).toEqual(false);
        expect(scope.infinite_scroll_busy).toEqual(false);
        expect(sp_lst.length).toEqual(search_result.length + sp_lst_before.length);
    }));
})