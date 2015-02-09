describe('model.group.manage',function(){
    var scope,createController,$q,$rootScope;

    var modal_instance_mock = {
        close:jasmine.createSpy()
    }
    var confirm_service_mock = jasmine.createSpy();
    var alert_service_mock = jasmine.createSpy();
    var group_exe_service_mock = jasmine.createSpy();
    var group_edit_service_mock = jasmine.createSpy();

    var group_create_service_mock = jasmine.createSpy();
    var group_rest_service_mock = {
        delete_item:jasmine.createSpy(),
        get_lst:jasmine.createSpy()
    }
    var modal_mock = {
        open:jasmine.createSpy().and.returnValue({result:'dummy_modal_open_result'})
    }

    beforeEach(module('model.group',function($provide){
        $provide.value('$modalInstance',modal_instance_mock);
        $provide.value('share.ui.confirm',confirm_service_mock);
        $provide.value('share.ui.alert',alert_service_mock);
        $provide.value('model.group.execute',group_exe_service_mock);
        $provide.value('model.group.edit',group_edit_service_mock);
        $provide.value('model.group.create',group_create_service_mock);
        $provide.value('model.group.rest',group_rest_service_mock);
        $provide.value('$modal',modal_mock);
    }));

    beforeEach(inject(function(_$rootScope_,$controller,_$q_){
        $q = _$q_;
        $rootScope = _$rootScope_;
        scope = $rootScope.$new();
        createController = function(group_lst){
            var ctrlParam = {
                $scope:scope,
                group_lst:group_lst
            }
            return $controller('model.group.manage.modalCtrl',ctrlParam);
        }
    }));

    describe('',function(){
        it('can open modal with correct param',inject(function($templateCache,$injector){
            //verify template is not load before the service is called
            expect($templateCache.get('model.group.manage.modalCtrl.template')).toEqual(undefined);

            //execute testing code
            var service = $injector.get('model.group.manage');
            service();  

            //verify the modal is open with correct param
            var arg = modal_mock.open.calls.mostRecent().args[0];
            expect(arg.template).toEqual($templateCache.get('model.group.manage.modalCtrl.template'));
            expect(arg.controller).toEqual('model.group.manage.modalCtrl');

            //verify the modal is open with correct resolve param
            var a_dummy_group_rest_get_lst_promise = 'a_dummy_group_rest_get_lst_promise';
            group_rest_service_mock.get_lst.and.returnValue(a_dummy_group_rest_get_lst_promise);
            var get_group_promise = arg.resolve.group_lst();
            expect(get_group_promise).toEqual(a_dummy_group_rest_get_lst_promise);
        }));        
    });

    describe('.template',function(){
        var view;
        var setup = function(group_lst,$compile,$injector,$templateCache){
            createController(group_lst);
            var service = $injector.get('model.group.manage');
            service();  
            var html = $templateCache.get('model.group.manage.modalCtrl.template');
            view = $compile(angular.element(html))(scope);
            scope.$digest();
        }

        it('has delete button in group_lst table',inject(function($compile,$injector,$templateCache){
            var group_lst = [{id:1},{id:2},{id:3}];
            setup(group_lst,$compile,$injector,$templateCache);
            scope.delete_group = jasmine.createSpy();
            var delete_btn = view.find("#model\\.group\\.manage\\.template\\.delete_btn")[2];
            delete_btn.click();
            expect(scope.delete_group.calls.mostRecent().args[0].id).toEqual(3);
        }));

        it('has edit button in group_lst table',inject(function($compile,$injector,$templateCache){
            var group_lst = [{id:1},{id:2},{id:3}];
            setup(group_lst,$compile,$injector,$templateCache);
            scope.edit_group = jasmine.createSpy();
            var edit_btn = view.find("#model\\.group\\.manage\\.template\\.edit_btn")[2];
            edit_btn.click();
            expect(scope.edit_group.calls.mostRecent().args[0].id).toEqual(3);
        }));

        it('has execute button in group_lst table',inject(function($compile,$injector,$templateCache){
            var group_lst = [{id:1},{id:2},{id:3}];
            setup(group_lst,$compile,$injector,$templateCache);
            scope.execute_group = jasmine.createSpy();
            var execute_btn = view.find("#model\\.group\\.manage\\.template\\.execute_btn")[2];
            execute_btn.click();
            expect(scope.execute_group.calls.mostRecent().args[0]).toEqual(3);
        }));

        it('has exit button',inject(function($compile,$injector,$templateCache){
            setup([],$compile,$injector,$templateCache);
            scope.exit = jasmine.createSpy();
            var exit_btn = view.find("#group_app\\/service\\/manage\\/exit_btn")[0];
            exit_btn.click();
            expect(scope.exit).toHaveBeenCalledWith();
        }));

        it('has add group button',inject(function($compile,$injector,$templateCache){
            setup([],$compile,$injector,$templateCache);
            scope.add_group = jasmine.createSpy();
            var add_group_btn = view.find("#group_app\\/service\\/manage\\/add_btn")[0];
            add_group_btn.click();
            expect(scope.add_group).toHaveBeenCalledWith();
        }));                  
    })

    describe('.modalCtrl',function(){
        it('can init group_lst',function(){
            var group_lst = [{id:1},{id:2}];
            createController(group_lst);
            expect(scope.group_lst).toEqual(group_lst);
        });
        it('can exe group',function(){
            createController();
            var dummy_group_id = 1;
            scope.execute_group(dummy_group_id);
            expect(group_exe_service_mock).toHaveBeenCalledWith(dummy_group_id);
        });
        it('can delete group',function(){
            //setup confirm service
            var confirm_defer = $q.defer();
            confirm_service_mock.and.returnValue(confirm_defer.promise);

            //setup group_rest_delete_item_defer
            var group_rest_delete_item_defer = $q.defer();
            group_rest_service_mock.delete_item.and.returnValue(group_rest_delete_item_defer.promise);

            //execute testing code
            var group_lst = [{id:1},{id:2}];
            createController(group_lst);
            var deleting_group_obj = {id:1};
            scope.delete_group(deleting_group_obj);

            //resolve confirm -> next step would be group_rest.delete_item
            confirm_defer.resolve(true);
            $rootScope.$digest();
            expect(group_rest_service_mock.delete_item).toHaveBeenCalledWith(deleting_group_obj.id);

            //resolve delete item -> next step is confirm group_lst is remove the deleting item
            group_rest_delete_item_defer.resolve();
            $rootScope.$digest();
            expect(group_lst.length).toEqual(1);
            expect(group_lst[0].id).toEqual(2);
        });        
        it('can add group',function(){
            //setup create_service_defer
            var create_service_defer = $q.defer();
            group_create_service_mock.and.returnValue(create_service_defer.promise);

            //execute testing code
            var group_lst = [{id:1},{id:2}];
            createController(group_lst);
            scope.add_group();

            //resolve create_service_defer
            var a_dummy_adding_group = 'a_dummy_adding_group';
            create_service_defer.resolve(a_dummy_adding_group);
            $rootScope.$digest();
            expect(group_lst.length).toEqual(3);
            expect(group_lst[2]).toEqual(a_dummy_adding_group);
        });
        it('can edit group',function(){
            //setup group_edit_defer
            var group_edit_defer = $q.defer();
            group_edit_service_mock.and.returnValue(group_edit_defer.promise);

            //execute testing code
            var group_lst = [{id:1},{id:2}];
            createController(group_lst);
            var a_dummy_editing_group = {id:2,name:'before'};
            scope.edit_group(a_dummy_editing_group);

            //resolve edit_group_service
            var a_edited_group = {id:2,name:'after'};
            group_edit_defer.resolve(a_edited_group);
            $rootScope.$digest();
            expect(a_dummy_editing_group).toEqual(a_edited_group);
        })
    })
})