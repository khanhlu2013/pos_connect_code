describe("model.group.create", function () {
    var group_prompt_mock = jasmine.createSpy();
    var group_rest_mock = {create:jasmine.createSpy()};

    beforeEach(module('model.group',function($provide){
        $provide.value('model.group.prompt', group_prompt_mock);
        $provide.value('model.group.rest', group_rest_mock);
    }));
 
    it("can call group_prompt service and use group_rest to create group",
        inject(['model.group.create','$q','$rootScope',function (create_service,$q,$rootScope) {
            //setup prompt promise
            var prompt_defer = $q.defer();
            group_prompt_mock.and.returnValue(prompt_defer.promise);

            //setup group_rest.create promise
            var create_defer = $q.defer();
            group_rest_mock.create.and.returnValue(create_defer.promise)

            //execute create service
            var created_group = undefined;
            create_service().then(
                function(created_group_result){
                    created_group = created_group_result;
                }
            )

            //resolve prompt promise
            var a_dummy_prompt_result = 'a dummy prompt';
            prompt_defer.resolve(a_dummy_prompt_result);
            $rootScope.$digest(); 
            expect(group_rest_mock.create).toHaveBeenCalledWith(a_dummy_prompt_result);

            //resolve create promise
            var a_dummy_created_group = 'a dummy created group';
            create_defer.resolve(a_dummy_created_group);
            $rootScope.$digest();             
            expect(created_group).toEqual(a_dummy_created_group);
        }])        
    )
});