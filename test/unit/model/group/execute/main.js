describe('model.group.execute',function(){
    var group_rest_mock = {
        execute_item : jasmine.createSpy(),
        get_item : jasmine.createSpy()
    }
    var modal_mock = {
        open: jasmine.createSpy()
    }
    var ng_id_str_2_jquery_id_str = function(str){
        str = str.replace(/\./g, '\\.');   //replace '.' -> '\\.'
        str = str.replace(/\//g, '\\\/'); //replace '/' -> '\\/'
        var result = '#' + str;
        // console.log(result);
        return result;
    }
        
    beforeEach(module('model.group',function($provide){
        $provide.value('model.group.rest',group_rest_mock);
        $provide.value('$modal',modal_mock);
    }))

    it('can open modal with correct param',inject(function($injector){
        //get test code and exe it
        var group_exe_service = $injector.get('model.group.execute');
        var a_dummy_group_id = 'a_dummy_group_id';
        group_exe_service(a_dummy_group_id);
        expect(modal_mock.open).toHaveBeenCalled();
        expect(modal_mock.open.calls.any()).toEqual(true);
        
        //test modal args
        var arg = modal_mock.open.calls.mostRecent().args[0];
        expect(arg.controller).toEqual('model.group.execute.controller');
        expect(arg.size).toEqual('lg');

        //test modal resolve
        arg.resolve.group();
        expect(group_rest_mock.get_item).toHaveBeenCalled();
    }))
})