describe('model.group.execute',function(){
    var ng_id_str_2_jquery_id_str = function(str){
        str = str.replace(/\./g, '\\.');   //replace '.' -> '\\.'
        str = str.replace(/\//g, '\\\/'); //replace '/' -> '\\/'
        var result = '#' + str;
        return result;
    }
    describe('.template',function(){
        var scope,$rootScope,view,init_func;
        var modal_instance_mock = {
            dismiss : jasmine.createSpy()
        }        
        var share_ui_alert_mock = jasmine.createSpy();
        var Group_mock = {
            build : jasmine.createSpy()
        }
        var download_product_mock = jasmine.createSpy();
        var group_rest_mock = {}
        beforeEach(module('app.productApp.partial'));
        beforeEach(module('model.group',function($provide){
            $provide.value('$modalInstance',modal_instance_mock);
            $provide.value('share.ui.alert',share_ui_alert_mock);
            $provide.value('model.group.Group',Group_mock);
            $provide.value('share.util.offline_db.download_product',download_product_mock);
            $provide.value('model.group.rest',group_rest_mock);
        }));
        beforeEach(inject(function(_$rootScope_,$compile,$templateCache,$controller){
            $rootScope = _$rootScope_;
            scope = $rootScope.$new();
            init_func = function(group){
                $controller('model.group.execute.controller',{$scope:scope,group:group});
                var html = $templateCache.get('model.group.execute.main.html');
                view = $compile(angular.element(html))(scope);
                scope.$digest();
            }
        }));
        it('can set price option',function(){
            var group = 'a_dummy_group';
            init_func(group);
            var enable_price_check =  view.find(ng_id_str_2_jquery_id_str('group_app/service/execute/enable_price_check'));
            expect(scope.enable_price).toEqual(undefined);
            expect(scope.option.price).toEqual(undefined);
            enable_price_check.click();
            expect(scope.enable_price).toEqual(true);
            expect(scope.option.price).toEqual(undefined);

            //fill out price
            var price_txt =  view.find(ng_id_str_2_jquery_id_str('group_app/service/execute/price_txt'));    
            var price = 1.23;
            price_txt.val(price);
            price_txt.trigger('input');
            expect(scope.option.price).toEqual(price); 

            //disable price
            enable_price_check.click();
            expect(scope.enable_price).toEqual(false);
            expect(scope.option.price).toEqual(undefined);            
        })

        it('can set crv option',function(){
            var group = 'a_dummy_group';
            init_func(group);
            var enable_crv_check =  view.find(ng_id_str_2_jquery_id_str('group_app/service/execute/enable_crv_check'));
            expect(scope.enable_crv).toEqual(undefined);
            expect(scope.option.crv).toEqual(undefined);
            enable_crv_check.click();
            expect(scope.enable_crv).toEqual(true);
            expect(scope.option.crv).toEqual(null);

            //fill out crv
            var crv_txt =  view.find(ng_id_str_2_jquery_id_str('group_app/service/execute/crv_txt'));    
            var crv = 1.2;
            crv_txt.val(crv);
            crv_txt.trigger('input');
            expect(scope.option.crv).toEqual(crv); 

            //disable crv
            enable_crv_check.click();
            expect(scope.enable_crv).toEqual(false);
            expect(scope.option.crv).toEqual(undefined);            
        })

        it('can set is_taxable option',function(){
            var group = 'a_dummy_group';
            init_func(group);
            var enable_is_taxable_check =  view.find(ng_id_str_2_jquery_id_str('group_app/service/execute/enable_is_taxable_check'));
            expect(scope.enable_is_taxable).toEqual(undefined);
            expect(scope.option.is_taxable).toEqual(undefined);
            enable_is_taxable_check.click();
            expect(scope.enable_is_taxable).toEqual(true);
            expect(scope.option.is_taxable).toEqual(false);

            //change is_taxable
            var is_taxable_check = view.find(ng_id_str_2_jquery_id_str('group_app/service/execute/is_taxable_check'));
            is_taxable_check.click();
            expect(scope.enable_is_taxable).toEqual(true);
            expect(scope.option.is_taxable).toEqual(true);

            //disable is_taxable
            enable_is_taxable_check.click();
            expect(scope.enable_is_taxable).toEqual(false);
            expect(scope.option.is_taxable).toEqual(undefined);            
        });

        it('can set cost option',function(){
            var group = 'a_dummy_group';
            init_func(group);
            var enable_cost_check =  view.find(ng_id_str_2_jquery_id_str('group_app/service/execute/enable_cost_check'));
            expect(scope.enable_cost).toEqual(undefined);
            expect(scope.option.cost).toEqual(undefined);
            enable_cost_check.click();
            expect(scope.enable_cost).toEqual(true);
            expect(scope.option.cost).toEqual(null);

            //fill out cost
            var cost_txt =  view.find(ng_id_str_2_jquery_id_str('group_app/service/execute/cost_txt'));    
            var cost = 1.2;
            cost_txt.val(cost);
            cost_txt.trigger('input');
            expect(scope.option.cost).toEqual(cost); 

            //disable cost
            enable_cost_check.click();
            expect(scope.enable_cost).toEqual(false);
            expect(scope.option.cost).toEqual(undefined);            
        })

        it('can set is_sale_report option',function(){
            var group = 'a_dummy_group';
            init_func(group);
            var enable_is_sale_report_check =  view.find(ng_id_str_2_jquery_id_str('group_app/service/execute/enable_is_sale_report_check'));
            expect(scope.enable_is_sale_report).toEqual(undefined);
            expect(scope.option.is_sale_report).toEqual(undefined);
            enable_is_sale_report_check.click();
            expect(scope.enable_is_sale_report).toEqual(true);
            expect(scope.option.is_sale_report).toEqual(false);

            //change is_sale_report
            var is_sale_report_check = view.find(ng_id_str_2_jquery_id_str('group_app/service/execute/is_sale_report_check'));
            is_sale_report_check.click();
            expect(scope.enable_is_sale_report).toEqual(true);
            expect(scope.option.is_sale_report).toEqual(true);

            //disable is_sale_report
            enable_is_sale_report_check.click();
            expect(scope.enable_is_sale_report).toEqual(false);
            expect(scope.option.is_sale_report).toEqual(undefined);            
        });

        it('can set p_type option',function(){
            var group = 'a_dummy_group';
            init_func(group);
            var enable_p_type_check =  view.find(ng_id_str_2_jquery_id_str('group_app/service/execute/enable_p_type_check'));
            expect(scope.enable_p_type_report).toEqual(undefined);
            expect(scope.option.p_type).toEqual(undefined);
            enable_p_type_check.click();
            expect(scope.enable_p_type).toEqual(true);
            expect(scope.option.p_type).toEqual(null);

            //fill out p_type
            var p_type_txt =  view.find(ng_id_str_2_jquery_id_str('group_app/service/execute/p_type_txt'));    
            var p_type = 'my_type';
            p_type_txt.val(p_type);
            p_type_txt.trigger('input');
            expect(scope.option.p_type).toEqual(p_type); 

            //disable p_type
            enable_p_type_check.click();
            expect(scope.enable_p_type).toEqual(false);
            expect(scope.option.p_type).toEqual(undefined);           
        });    

        it('can set p_tag option',function(){
            var group = 'a_dummy_group';
            init_func(group);
            var enable_p_tag_check =  view.find(ng_id_str_2_jquery_id_str('group_app/service/execute/enable_p_tag_check'));
            expect(scope.enable_p_tag_report).toEqual(undefined);
            expect(scope.option.p_tag).toEqual(undefined);
            enable_p_tag_check.click();
            expect(scope.enable_p_tag).toEqual(true);
            expect(scope.option.p_tag).toEqual(null);

            //fill out p_tag
            var p_tag_txt =  view.find(ng_id_str_2_jquery_id_str('group_app/service/execute/p_tag_txt'));    
            var p_tag = 'my_tag';
            p_tag_txt.val(p_tag);
            p_tag_txt.trigger('input');
            expect(scope.option.p_tag).toEqual(p_tag); 

            //disable p_tag
            enable_p_tag_check.click();
            expect(scope.enable_p_tag).toEqual(false);
            expect(scope.option.p_tag).toEqual(undefined);           
        });   

        it('can set vendor option',function(){
            var group = 'a_dummy_group';
            init_func(group);
            var enable_vendor_check =  view.find(ng_id_str_2_jquery_id_str('group_app/service/execute/enable_vendor_check'));
            expect(scope.enable_vendor_report).toEqual(undefined);
            expect(scope.option.vendor).toEqual(undefined);
            enable_vendor_check.click();
            expect(scope.enable_vendor).toEqual(true);
            expect(scope.option.vendor).toEqual(null);

            //fill out vendor
            var vendor_txt =  view.find(ng_id_str_2_jquery_id_str('group_app/service/execute/vendor_txt'));    
            var vendor = 'my_vendor';
            vendor_txt.val(vendor);
            vendor_txt.trigger('input');
            expect(scope.option.vendor).toEqual(vendor); 

            //disable vendor
            enable_vendor_check.click();
            expect(scope.enable_vendor).toEqual(false);
            expect(scope.option.vendor).toEqual(undefined);           
        });   

        it('can set buydown option',function(){
            var group = 'a_dummy_group';
            init_func(group);
            var enable_buydown_check =  view.find(ng_id_str_2_jquery_id_str('group_app/service/execute/enable_buydown_check'));
            expect(scope.enable_buydown_report).toEqual(undefined);
            expect(scope.option.buydown).toEqual(undefined);
            enable_buydown_check.click();
            expect(scope.enable_buydown).toEqual(true);
            expect(scope.option.buydown).toEqual(null);

            //fill out buydown
            var buydown_txt =  view.find(ng_id_str_2_jquery_id_str('group_app/service/execute/buydown_txt'));    
            var buydown = 2.34;
            buydown_txt.val(buydown);
            buydown_txt.trigger('input');
            expect(scope.option.buydown).toEqual(buydown); 

            //disable buydown
            enable_buydown_check.click();
            expect(scope.enable_buydown).toEqual(false);
            expect(scope.option.buydown).toEqual(undefined);           
        });  

        it('can set value_customer_price option',function(){
            var group = 'a_dummy_group';
            init_func(group);
            var enable_value_customer_price_check =  view.find(ng_id_str_2_jquery_id_str('group_app/service/execute/enable_value_customer_price_check'));
            expect(scope.enable_value_customer_price_report).toEqual(undefined);
            expect(scope.option.value_customer_price).toEqual(undefined);
            enable_value_customer_price_check.click();
            expect(scope.enable_value_customer_price).toEqual(true);
            expect(scope.option.value_customer_price).toEqual(null);

            //fill out value_customer_price
            var value_customer_price_txt =  view.find(ng_id_str_2_jquery_id_str('group_app/service/execute/value_customer_price_txt'));    
            var value_customer_price = 2.34;
            value_customer_price_txt.val(value_customer_price);
            value_customer_price_txt.trigger('input');
            expect(scope.option.value_customer_price).toEqual(value_customer_price); 

            //disable value_customer_price
            enable_value_customer_price_check.click();
            expect(scope.enable_value_customer_price).toEqual(false);
            expect(scope.option.value_customer_price).toEqual(undefined);           
        }); 
    });
});