describe('model.group.edit',function(){
    var group_prompt_mock = jasmine.createSpy();
    var group_rest_mock = {
        get_item:jasmine.createSpy(),
        edit_item:jasmine.createSpy()
    };

    beforeEach(module('model.group',function($provide){
        $provide.value('model.group.prompt',group_prompt_mock);
        $provide.value('model.group.rest',group_rest_mock);
    }));

    it('can rest.get_item -> then -> prompt -> then -> rest.edit',inject(
    [
        'model.group.edit',
        '$q',
        '$rootScope',
    function(
        edit_group,
        $q,
        $rootScope
    ){
        //setup rest_get_defer
        var rest_get_defer = $q.defer();
        group_rest_mock.get_item.and.returnValue(rest_get_defer.promise);

        //setup prompt_defer
        var prompt_defer = $q.defer();
        group_prompt_mock.and.returnValue(prompt_defer.promise);

        //setup rest_edit_defer
        var rest_edit_defer = $q.defer();
        group_rest_mock.edit_item.and.returnValue(rest_edit_defer.promise);

        //exe testing code
        var before_group = {id:'dummy_id'}
        var after_group = undefined;
        edit_group(before_group).then(
            function(edited_group){
                after_group = edited_group;
            }
        );
        expect(group_rest_mock.get_item).toHaveBeenCalledWith(before_group.id);        

        //resolve rest_get promise -> expect prompt will be called
        var dummy_group_after_get = 'dummy_group_after_get';
        rest_get_defer.resolve(dummy_group_after_get);
        $rootScope.$digest();
        expect(group_prompt_mock).toHaveBeenCalledWith(dummy_group_after_get);

        //resolve prompt promise -> expect edit will be called
        var dummy_group_after_prompt = 'dummy_group_after_prompt';
        prompt_defer.resolve(dummy_group_after_prompt);
        $rootScope.$digest();
        expect(group_rest_mock.edit_item).toHaveBeenCalledWith(dummy_group_after_prompt,before_group.id);

        //resolve edit promise -> expect after group is updated
        var dummy_group_after_edit = 'dummy_group_after_edit';
        rest_edit_defer.resolve(dummy_group_after_edit);
        $rootScope.$digest();
        expect(after_group).toEqual(dummy_group_after_edit);
    }]))
});