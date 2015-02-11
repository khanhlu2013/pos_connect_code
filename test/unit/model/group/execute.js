describe('model.group.execute',function(){
    var group_rest_mock = {
        execute_item : jasmine.createSpy(),
        get_item : jasmine.createSpy()
    }

    describe('.template',function(){
        var view;
        beforeEach(module('app.productApp.partial'));
        beforeEach(function(group_lst,$compile,$injector,$templateCache){
            createController(group_lst);
            var service = $injector.get('model.group.manage');
            service();  
            var html = $templateCache.get('model.group.manage.html');
            view = $compile(angular.element(html))(scope);
            scope.$digest();
        })        
    })

    describe('',function(){
        var modal_mock = {
            open: jasmine.createSpy()
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
            expect(arg.controller).toEqual('model.group.execute.modalCtrl');
            expect(arg.size).toEqual('lg');

            //test modal resolve
            arg.resolve.group();
            expect(group_rest_mock.get_item).toHaveBeenCalled();
        }))
    })

    describe('modalCtrl',function(){
        var createController,scope,$rootScope,$q;
        var modal_instance_mock = {
            dismiss : jasmine.createSpy()
        }
        var Group_mock = {
            build : jasmine.createSpy()
        }
        var share_ui_alert_mock = jasmine.createSpy();
        var download_product_mock = jasmine.createSpy();
        var group_mock = {};

        beforeEach(module('model.group',function($provide){
            $provide.value('$modalInstance',modal_instance_mock);
            $provide.value('share.ui.alert',share_ui_alert_mock);
            $provide.value('model.group.Group',Group_mock);
            $provide.value('share.util.offline_db.download_product',download_product_mock);
            $provide.value('model.group.rest',group_rest_mock);
            $provide.value('group',group_mock);
        }))

        beforeEach(inject(function($controller,_$rootScope_,_$q_){
            $rootScope = _$rootScope_;
            $q = _$q_;
            scope = $rootScope.$new();
            createController = function(){
                var ctrlParam = {
                    $scope:scope,
                }
                return $controller('model.group.execute.modalCtrl',ctrlParam);            
            }
        }));        

        it('can handle enable checkbox click',function(){
            var price = 'price';
            var crv = 'crv';
            var is_taxable = 'is_taxable';
            var cost = 'cost';
            var is_sale_report = 'is_sale_report';
            var p_type = 'p_type';
            var p_tag = 'p_tag';
            var vendor = 'vendor';
            var buydown = 'buydown';
            var value_customer_price = 'value_customer_price';
            createController();

            //init check
            expect(scope.is_option_empty()).toEqual(true);
            expect(scope.option[price]).toEqual(undefined);//price is not allow to be null. thus, it does not have a default value
            expect(scope.option[crv]).toEqual(undefined);
            expect(scope.option[is_taxable]).toEqual(undefined);
            expect(scope.option[cost]).toEqual(undefined);
            expect(scope.option[is_sale_report]).toEqual(undefined);
            expect(scope.option[p_type]).toEqual(undefined);
            expect(scope.option[p_tag]).toEqual(undefined);
            expect(scope.option[vendor]).toEqual(undefined);
            expect(scope.option[buydown]).toEqual(undefined);
            expect(scope.option[value_customer_price]).toEqual(undefined);

            //price        
            scope.checkbox_click(price);
            expect(scope.option[price]).toEqual(undefined);//price is not allow to be null. thus, it does not have a default value
            //crv
            scope.checkbox_click(crv);
            expect(scope.option[crv]).toEqual(null);
            //is_taxable
            scope.checkbox_click(is_taxable);
            expect(scope.option[is_taxable]).toEqual(false);
            //cost
            scope.checkbox_click(cost);
            expect(scope.option[cost]).toEqual(null);
            //is_sale_report
            scope.checkbox_click(is_sale_report);
            expect(scope.option[is_sale_report]).toEqual(false);
            //p_type
            scope.checkbox_click(p_type);
            expect(scope.option[p_type]).toEqual(null);
            //p_tag
            scope.checkbox_click(p_tag);
            expect(scope.option[p_tag]).toEqual(null);
            //vendor
            scope.checkbox_click(vendor);
            expect(scope.option[vendor]).toEqual(null);
            //buydown
            scope.checkbox_click(buydown);
            expect(scope.option[buydown]).toEqual(null);
            //value_customer_price
            scope.checkbox_click(value_customer_price);
            expect(scope.option[value_customer_price]).toEqual(null);

            expect(scope.is_option_empty()).toEqual(false);
        });

        it('can execute group with provided options',function(){
            createController();
            
            //setup promise for execute_item
            var execute_item_defer = $q.defer();
            group_rest_mock.execute_item.and.returnValue(execute_item_defer.promise);

            //setup promise for download product
            var download_product_defer = $q.defer();
            download_product_mock.and.returnValue(download_product_defer.promise);

            //execute test code
            var a_dummy_group = {id:'a_dummy_id'};
            var a_dummy_option = 'a_dummy_option';
            scope.group = a_dummy_group;
            scope.option = a_dummy_option;
            scope.ok();
            expect(group_rest_mock.execute_item).toHaveBeenCalledWith(a_dummy_group.id,a_dummy_option);

            //setup execute_item response. The next step is download_product, so we expect download_product to be call
            var a_dummy_execute_item_response = 'a_dummy_execute_item_response';
            execute_item_defer.resolve(a_dummy_execute_item_response);
            $rootScope.$digest();
            expect(download_product_mock).toHaveBeenCalledWith(false/*is_force*/);

            //setup donwload_product response. The next step is Group.build
            download_product_defer.resolve();
            $rootScope.$digest();
            expect(Group_mock.build).toHaveBeenCalledWith(a_dummy_execute_item_response);

            //expect reset of option
            expect(scope.option).toEqual({});
            expect(scope.enable_price).toEqual(false);
            expect(scope.enable_crv).toEqual(false);
            expect(scope.enable_is_taxable).toEqual(false);
            expect(scope.enable_cost).toEqual(false);
            expect(scope.enable_is_sale_report).toEqual(false);
            expect(scope.enable_p_tag).toEqual(false);
            expect(scope.enable_p_tag).toEqual(false);
            expect(scope.enable_vendor).toEqual(false);
            expect(scope.enable_buydown).toEqual(false);
            expect(scope.enable_value_customer_price).toEqual(false);

        })
    })
})