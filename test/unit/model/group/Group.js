describe("Group model", function () {

    beforeEach(module('model.group'));
 
    it("can be initialized with its constructor",function(){
        inject(['model.group.Group',function (Group) {
            var id = 1;
            var name = 'group abc';
            var sp_lst = undefined;

            var group = new Group(id,name,sp_lst);
            expect(group.id).toEqual(id);
            expect(group.name).toEqual('group abc');
        }]);        
    })
});