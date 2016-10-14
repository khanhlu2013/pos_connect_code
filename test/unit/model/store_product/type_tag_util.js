describe('model.store_product.type_tag_util',function(){
    var service,$httpBackend,$rootScope;

    beforeEach(module('model.store_product',function($provide){

    }));
    beforeEach(inject(function($injector,_$httpBackend_,_$rootScope_){
        $httpBackend = _$httpBackend_;
        $rootScope = _$rootScope_;
        service = $injector.get('model.store_product.type_tag_util');
    }));
    afterEach(function() {
       $httpBackend.verifyNoOutstandingExpectation();
       $httpBackend.verifyNoOutstandingRequest();
    });

    it('can resort rest_type_tag when cache is not loaded.',inject(function(){
        var response_type_tag = 'response_type_tag';
        $httpBackend.expect('GET','/sp/get_lookup_type_tag').respond(response_type_tag);

        var type_tag = null;
        service.get().then(function(data){
            type_tag = data;
        });

        $httpBackend.flush();
        expect(type_tag).toEqual(response_type_tag);
    }));

    it('can resort to the cache to get type_tag when the cache is loaded.',inject(function(){
        //lets ajax get data so it can cache
        var response_type_tag = 'response_type_tag';
        $httpBackend.expect('GET','/sp/get_lookup_type_tag').respond(response_type_tag);
        var type_tag = null;
        service.get().then(function(data){
            type_tag = data;
        });
        $httpBackend.flush();
        expect(type_tag).toEqual(response_type_tag);

        //lets verify the cached data
        service.get().then(function(data){
            type_tag = data;
        });
        $rootScope.$digest();
        expect(type_tag).toEqual(response_type_tag);
    }));
})