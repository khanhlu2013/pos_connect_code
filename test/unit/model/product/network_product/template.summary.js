describe('model.product.network_product.main.summary.html',function(){
    var $rootScope,$templateCache,scope,createController,view;
    beforeEach(module('app.productApp.partial'));
    beforeEach(module('share.filter'));
    beforeEach(module('model.product',function($provide){

    }));
    beforeEach(inject(function(_$rootScope_,_$templateCache_,$controller,$compile){
        $rootScope = _$rootScope_;
        scope = $rootScope.$new();
        $templateCache = _$templateCache_;
        createControllerAndView = function(share_setting){
            $controller('model.product.network_product.controller',{
                $scope:scope,
                share_setting:share_setting
            })
            var html = $templateCache.get('model.product.network_product.main.html');
            view = $compile(angular.element(html))(scope);
            scope.$digest();            
        }
    }));

    it('has main.summary.html that can display suggestion for name,price,crv,cost, and member_count',function(){
        //init controller
        var share_setting_mock = {}
        createControllerAndView(share_setting_mock);      
        var network_product = {};
        network_product.get_suggest_extra = jasmine.createSpy();
        var sp_1 = {get_cost:jasmine.createSpy()}//this way the empty_to_end filter can function
        var sp_2 = {get_cost:jasmine.createSpy()}//this way the empty_to_end filter can function
        var network_product_sp_lst = [sp_1,sp_2];
        network_product.get_sp_lst = jasmine.createSpy().and.returnValue(network_product_sp_lst);
        var name_suggestion = 'dummy_name_suggestion';
        var price_suggestion = 12.34;
        var crv_suggestion = 23.45;
        var cost_suggestion = 34.56;
        network_product.get_suggest_main = jasmine.createSpy().and.callFake(function(field){
            if(field === 'name'){
                return {value:name_suggestion}
            }else if(field === 'price'){
                return price_suggestion;
            }else if(field === 'crv'){
                return {value:crv_suggestion}
            }else if(field === 'cost'){return cost_suggestion}
        })
        scope.init(network_product);   
        scope.$digest();    

        //calculate index
        var summary_lst_node = view[0].childNodes[1].childNodes[2].childNodes[2].childNodes;
        var name_index = 1;
        var member_count_index = 3;
        var price_index = 5;
        var tax_index = 7;
        var crv_index = 9;
        var cost_index = 11;

        expect(summary_lst_node[name_index].textContent.indexOf(name_suggestion)>-1).toEqual(true);
        expect(summary_lst_node[price_index].textContent.indexOf('$' + price_suggestion)>-1).toEqual(true);
        expect(summary_lst_node[crv_index].textContent.indexOf('$' + crv_suggestion)>-1).toEqual(true);
        expect(summary_lst_node[cost_index].textContent.indexOf('$' + cost_suggestion)>-1).toEqual(true);
        expect(summary_lst_node[member_count_index].textContent.indexOf(network_product_sp_lst.length)>-1).toEqual(true);
    });

    it('has main.summary.html that can hide both is_taxable glyphicon and percent if tax percent is 50%',function(){
        //init controller
        var share_setting_mock = {}
        createControllerAndView(share_setting_mock);      
        var network_product = {};
        network_product.get_suggest_extra = jasmine.createSpy();
        var sp_1 = {get_cost:jasmine.createSpy()}//this way the empty_to_end filter can function
        var sp_2 = {get_cost:jasmine.createSpy()}//this way the empty_to_end filter can function
        var network_product_sp_lst = [sp_1,sp_2];
        network_product.get_sp_lst = jasmine.createSpy().and.returnValue(network_product_sp_lst);
        network_product.get_suggest_main = jasmine.createSpy().and.callFake(function(field){
            if(field === 'is_taxable'){
                return {percent:50}
            }
        })
        scope.init(network_product);   
        scope.$digest();    

        //calculate index
        var summary_lst_node = view[0].childNodes[1].childNodes[2].childNodes[2].childNodes;
        var name_index = 1;
        var member_count_index = 3;
        var price_index = 5;
        var tax_index = 7;
        var crv_index = 9;
        var cost_index = 11;

        var tax_node_p = summary_lst_node[tax_index].childNodes[3];
        expect(tax_node_p.className.indexOf('ng-hide')>-1).toEqual(true);
    });

    it('has main.summary.html that can show both is_taxable glyphicon and percent if tax percent is not 50%',function(){
        //init controller
        var share_setting_mock = {}
        createControllerAndView(share_setting_mock);      
        var network_product = {};
        network_product.get_suggest_extra = jasmine.createSpy();
        var sp_1 = {get_cost:jasmine.createSpy()}//this way the empty_to_end filter can function
        var sp_2 = {get_cost:jasmine.createSpy()}//this way the empty_to_end filter can function
        var network_product_sp_lst = [sp_1,sp_2];
        network_product.get_sp_lst = jasmine.createSpy().and.returnValue(network_product_sp_lst);
        network_product.get_suggest_main = jasmine.createSpy().and.callFake(function(field){
            if(field === 'is_taxable'){
                return {percent:51}
            }
        })
        scope.init(network_product);   
        scope.$digest();    

        //calculate index
        var summary_lst_node = view[0].childNodes[1].childNodes[2].childNodes[2].childNodes;
        var name_index = 1;
        var member_count_index = 3;
        var price_index = 5;
        var tax_index = 7;
        var crv_index = 9;
        var cost_index = 11;

        var tax_node_p = summary_lst_node[tax_index].childNodes[3];
        expect(tax_node_p.className.indexOf('ng-hide')>-1).toEqual(false);
    });

    it('has main.summary.html that can show is_taxable of true as glyphicon-check',function(){
        //init controller
        var share_setting_mock = {}
        createControllerAndView(share_setting_mock);      
        var network_product = {};
        network_product.get_suggest_extra = jasmine.createSpy();
        var sp_1 = {get_cost:jasmine.createSpy()}//this way the empty_to_end filter can function
        var sp_2 = {get_cost:jasmine.createSpy()}//this way the empty_to_end filter can function
        var network_product_sp_lst = [sp_1,sp_2];
        network_product.get_sp_lst = jasmine.createSpy().and.returnValue(network_product_sp_lst);
        network_product.get_suggest_main = jasmine.createSpy().and.callFake(function(field){
            if(field === 'is_taxable'){
                return {percent:51,value:true}
            }
        })
        scope.init(network_product);   
        scope.$digest();    

        //calculate index
        var summary_lst_node = view[0].childNodes[1].childNodes[2].childNodes[2].childNodes;
        var name_index = 1;
        var member_count_index = 3;
        var price_index = 5;
        var tax_index = 7;
        var crv_index = 9;
        var cost_index = 11;

        var tax_node_p_glyphicon = summary_lst_node[tax_index].childNodes[3].childNodes[1];
        expect(tax_node_p_glyphicon.className.indexOf('glyphicon-check')>-1).toEqual(true);
    });

    it('has main.summary.html that can show is_taxable of false as glyphicon-unchecked',function(){
        //init controller
        var share_setting_mock = {}
        createControllerAndView(share_setting_mock);      
        var network_product = {};
        network_product.get_suggest_extra = jasmine.createSpy();
        var sp_1 = {get_cost:jasmine.createSpy()}//this way the empty_to_end filter can function
        var sp_2 = {get_cost:jasmine.createSpy()}//this way the empty_to_end filter can function
        var network_product_sp_lst = [sp_1,sp_2];
        network_product.get_sp_lst = jasmine.createSpy().and.returnValue(network_product_sp_lst);
        network_product.get_suggest_main = jasmine.createSpy().and.callFake(function(field){
            if(field === 'is_taxable'){
                return {percent:51,value:false}
            }
        })
        scope.init(network_product);   
        scope.$digest();    

        //calculate index
        var summary_lst_node = view[0].childNodes[1].childNodes[2].childNodes[2].childNodes;
        var name_index = 1;
        var member_count_index = 3;
        var price_index = 5;
        var tax_index = 7;
        var crv_index = 9;
        var cost_index = 11;

        var tax_node_p_glyphicon = summary_lst_node[tax_index].childNodes[3].childNodes[1];
        expect(tax_node_p_glyphicon.className.indexOf('glyphicon-unchecked')>-1).toEqual(true);
    });

    it('has main.summary.html that can hide is_taxable percent if percent is 100',function(){
        //init controller
        var share_setting_mock = {}
        createControllerAndView(share_setting_mock);      
        var network_product = {};
        network_product.get_suggest_extra = jasmine.createSpy();
        var sp_1 = {get_cost:jasmine.createSpy()}//this way the empty_to_end filter can function
        var sp_2 = {get_cost:jasmine.createSpy()}//this way the empty_to_end filter can function
        var network_product_sp_lst = [sp_1,sp_2];
        network_product.get_sp_lst = jasmine.createSpy().and.returnValue(network_product_sp_lst);
        network_product.get_suggest_main = jasmine.createSpy().and.callFake(function(field){
            if(field === 'is_taxable'){
                return {percent:100,value:false}
            }
        })
        scope.init(network_product);   
        scope.$digest();    

        //calculate index
        var summary_lst_node = view[0].childNodes[1].childNodes[2].childNodes[2].childNodes;
        var name_index = 1;
        var member_count_index = 3;
        var price_index = 5;
        var tax_index = 7;
        var crv_index = 9;
        var cost_index = 11;

        var tax_node_p_percent = summary_lst_node[tax_index].childNodes[3].childNodes[3];
        expect(tax_node_p_percent.className.indexOf('ng-hide')>-1).toEqual(true);
    });
    it('has main.summary.html that can show is_taxable percent if percent is not 100',function(){
        //init controller
        var share_setting_mock = {}
        createControllerAndView(share_setting_mock);      
        var network_product = {};
        network_product.get_suggest_extra = jasmine.createSpy();
        var sp_1 = {get_cost:jasmine.createSpy()}//this way the empty_to_end filter can function
        var sp_2 = {get_cost:jasmine.createSpy()}//this way the empty_to_end filter can function
        var network_product_sp_lst = [sp_1,sp_2];
        network_product.get_sp_lst = jasmine.createSpy().and.returnValue(network_product_sp_lst);
        network_product.get_suggest_main = jasmine.createSpy().and.callFake(function(field){
            if(field === 'is_taxable'){
                return {percent:70,value:false}
            }
        })
        scope.init(network_product);   
        scope.$digest();    

        //calculate index
        var summary_lst_node = view[0].childNodes[1].childNodes[2].childNodes[2].childNodes;
        var name_index = 1;
        var member_count_index = 3;
        var price_index = 5;
        var tax_index = 7;
        var crv_index = 9;
        var cost_index = 11;

        var tax_node_p_percent = summary_lst_node[tax_index].childNodes[3].childNodes[3];
        expect(tax_node_p_percent.className.indexOf('ng-hide')>-1).toEqual(false);
    });
    it('has main.summary.html that can show is_taxable percent amount',function(){
        //init controller
        var share_setting_mock = {}
        createControllerAndView(share_setting_mock);      
        var network_product = {};
        network_product.get_suggest_extra = jasmine.createSpy();
        var sp_1 = {get_cost:jasmine.createSpy()}//this way the empty_to_end filter can function
        var sp_2 = {get_cost:jasmine.createSpy()}//this way the empty_to_end filter can function
        var network_product_sp_lst = [sp_1,sp_2];
        network_product.get_sp_lst = jasmine.createSpy().and.returnValue(network_product_sp_lst);
        var percent = 75;
        network_product.get_suggest_main = jasmine.createSpy().and.callFake(function(field){
            if(field === 'is_taxable'){
                return {percent:percent,value:false}
            }
        })
        scope.init(network_product);   
        scope.$digest();    

        //calculate index
        var summary_lst_node = view[0].childNodes[1].childNodes[2].childNodes[2].childNodes;
        var name_index = 1;
        var member_count_index = 3;
        var price_index = 5;
        var tax_index = 7;
        var crv_index = 9;
        var cost_index = 11;

        var tax_node_p_percent = summary_lst_node[tax_index].childNodes[3].childNodes[3];
        expect(tax_node_p_percent.textContent.indexOf(percent+'%')>-1).toEqual(true)
    });
})