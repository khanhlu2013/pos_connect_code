describe('model.group.rest',function(){
    var group_rest,$httpBackend;
    var Group_mock = {
        build:jasmine.createSpy()
    }
    beforeEach(module('model.group',function($provide){
        $provide.value('model.group.Group',Group_mock)
    }))
    beforeEach(inject(function($injector,_$httpBackend_){
        group_rest = $injector.get('model.group.rest');
        $httpBackend = _$httpBackend_;
    }))
    afterEach(function() {
       $httpBackend.verifyNoOutstandingExpectation();
       $httpBackend.verifyNoOutstandingRequest();
    });

    it('can get_item',function(){
        //expect get request, and train response
        var dummy_group_id = 'dummy_group_id';
        var dummy_response = 'dummy_response';
        $httpBackend.expect('GET','/group/get_item'+'?group_id=' + dummy_group_id).respond(dummy_response);
        
        //execute test code
        var get_ed_group = undefined;
        group_rest.get_item(dummy_group_id).then(
            function(data){
                get_ed_group = data;
            }
        )

        //after the get request is resolve, the request response will be used to build the group. So, before we flush/resolve the get request, lets mock the Group.build method and train its response
        var a_dummy_group_after_build = 'a_dummy_group_after_build';
        Group_mock.build.and.returnValue(a_dummy_group_after_build);
        
        //resolve get request and expect result from group_rest.get_item
        $httpBackend.flush();
        expect(get_ed_group).toEqual(a_dummy_group_after_build);
    });

    it('can edit_item',function(){
        //expect post request and train response
        var dummy_prompt_data = {a:'a',b:'b'};
        var dummy_group_id = 'xxx';
        var dummy_post_response = 'dummy_post_response';
        $httpBackend.expect('POST','/group/update_angular',{group:JSON.stringify(dummy_prompt_data),id:dummy_group_id}).respond(dummy_post_response);

        //execute test code
        var edited_group = undefined;
        group_rest.edit_item(dummy_prompt_data,dummy_group_id).then(
            function(data){
                edited_group = data;
            }
        )

        //before flushing the post request, lets mock Group.build and train its response
        var a_dummy_group_after_build = 'a_dummy_group_after_build';
        Group_mock.build.and.returnValue(a_dummy_group_after_build);

        //resolve post request and expect result from group_rest.edit_item
        $httpBackend.flush();
        expect(Group_mock.build).toHaveBeenCalledWith(dummy_post_response);
        expect(edited_group).toEqual(a_dummy_group_after_build);
    });

    it('can get_lst',function(){
        var dummy_response_lst = [1,2,3]
        $httpBackend.expect('GET','/group/get_lst').respond(dummy_response_lst);

        //execute test code
        var group_lst = undefined;
        group_rest.get_lst().then(
            function(data){
                group_lst = data;
            }
        )

        //before flushing get request, lets train Group.build
        Group_mock.build.and.callFake(function(param){
            return param * 2;
        })

        //flush request and expect group_lst
        $httpBackend.flush();
        expect(group_lst).toEqual([2,4,6])
    });

    it('can create_item',function(){
        var dummy_group_prompt = {a:'a',b:'b'}
        var dummy_response = 'dummy_response';
        $httpBackend.expect('POST','/group/insert_angular',{group:JSON.stringify(dummy_group_prompt)}).respond(dummy_response);

        //execute test code
        var create_ed_group = undefined;
        group_rest.create_item(dummy_group_prompt).then(
            function(data){
                create_ed_group = data;
            }
        );

        //before flushing post request, lets mock Group.build
        var a_dummy_group_after_build = 'a_dummy_group_after_build';
        Group_mock.build.and.returnValue(a_dummy_group_after_build);

        //flush post request and expect group_rest.create_item result
        $httpBackend.flush();
        expect(Group_mock.build).toHaveBeenCalledWith(dummy_response);
        expect(create_ed_group).toEqual(a_dummy_group_after_build);
    });

    it('can exe item',function(){
        var dummy_group_id = 'dummy_group_id';
        var dummy_exe_option = {a:'a',b:'b'};
        var dummy_response = 'dummy_response';
        $httpBackend.expect('POST','/group/execute',{group_id:dummy_group_id,option:JSON.stringify(dummy_exe_option)})
        .respond(dummy_response);

        //exe test code
        var group_after_exe = undefined;
        group_rest.execute_item(dummy_group_id,dummy_exe_option).then(
            function(data){
                group_after_exe = data;
            }
        )

        //before flusiing post request, lets mock Group.build
        var a_dummy_group_after_build = 'a_dummy_group_after_build';
        Group_mock.build.and.returnValue(a_dummy_group_after_build);

        //flush post request and expect group_rest.execute_item
        $httpBackend.flush();
        expect(Group_mock.build).toHaveBeenCalledWith(dummy_response);
        expect(group_after_exe).toEqual(a_dummy_group_after_build);
    })
})