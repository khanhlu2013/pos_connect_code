describe('model.store_product.rest_type_tag',function(){
    var rest_type_tag,$httpBackend,$rootScope;
    beforeEach(module('model.store_product',function($provide){
        
    }));
    beforeEach(inject(function($injector,_$rootScope_,_$httpBackend_){
        rest_type_tag = $injector.get('model.store_product.rest_type_tag');
        $httpBackend = _$httpBackend_;
        $rootScope = _$rootScope_;
    }));
    afterEach(function() {
       $httpBackend.verifyNoOutstandingExpectation();
       $httpBackend.verifyNoOutstandingRequest();
    });

    it('will make and http get call with correct param and trigger type_tag_downloaded_from_server event in the rootScope',inject(function(){
        var dummy_response = 'dummy_response';
        $httpBackend.expect('GET','/sp/get_lookup_type_tag').respond(dummy_response);
        var type_tag_response = undefined;
        rest_type_tag().then(function(data){
            type_tag_response = data;
        });
        spyOn($rootScope,'$emit');
        expect($rootScope.$emit).not.toHaveBeenCalled();
        
        $httpBackend.flush();
        expect($rootScope.$emit).toHaveBeenCalledWith('type_tag_downloaded_from_server',dummy_response);
        expect(type_tag_response).toEqual(dummy_response);
    }));
});