describe('model.product.network_product.main.detail.html',function(){
    var $rootScope,$templateCache,scope,createController,view,html;
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
            html = $templateCache.get('model.product.network_product.detail.html');
            view = $compile(angular.element(html))(scope);
            scope.$digest();            
        }
    }));    

    it('has a table to describe detail about name',inject(function(){
        //init controller
        var share_setting_mock = {}
        createControllerAndView(share_setting_mock);      
        var network_product = {};
        var sp_1 = {get_cost:jasmine.createSpy()}//this way the empty_to_end filter can function
        var sp_2 = {get_cost:jasmine.createSpy()}//this way the empty_to_end filter can function
        var network_product_sp_lst = [sp_1,sp_2];
        network_product.get_sp_lst = jasmine.createSpy().and.returnValue(network_product_sp_lst);
        var most_popular = {value:'most popular name', percent:60 };
        var second_popular = {value:'second popular name', percent:20 };
        var least_popular = {value:'least popular name', percent:10 };

        network_product.get_suggest_extra = jasmine.createSpy().and.callFake(function(field){
            if(field === 'name'){
                return [second_popular,most_popular,least_popular]
            }
        })    
        scope.init(network_product);   
        scope.$digest();    
   
        var name_table_node = view[2];
        var tbody = name_table_node.childNodes[1];
        var tbody_text = tbody.textContent;

        var index_name_1,index_name_2,index_name_3;
        var index_percent_1,index_percent_2,index_percent_3;

        index_name_1 = tbody_text.indexOf(most_popular.value);
        index_percent_1 = tbody_text.indexOf(most_popular.percent);
        index_name_2 = tbody_text.indexOf(second_popular.value);
        index_percent_2 = tbody_text.indexOf(second_popular.percent); 
        index_name_3 = tbody_text.indexOf(least_popular.value);
        index_percent_3 = tbody_text.indexOf(least_popular.percent);                

        expect(
            index_name_1 < index_percent_1 <
            index_name_2 < index_percent_2 <
            index_name_3 < index_percent_3
        ).toEqual(true)
    }));

    it('has a table to describe detail about crv that is hide when there is no suggestion',inject(function(){
        //init controller
        var share_setting_mock = {}
        createControllerAndView(share_setting_mock);      
        var network_product = {};
        var sp_1 = {get_cost:jasmine.createSpy()}//this way the empty_to_end filter can function
        var sp_2 = {get_cost:jasmine.createSpy()}//this way the empty_to_end filter can function
        var network_product_sp_lst = [sp_1,sp_2];
        network_product.get_sp_lst = jasmine.createSpy().and.returnValue(network_product_sp_lst);

        network_product.get_suggest_extra = jasmine.createSpy().and.callFake(function(field){
            if(field === 'crv'){
                return []
            }
        })    
        scope.init(network_product);   
        scope.$digest();    
        
        var crv_table_node = view[4];
        expect(crv_table_node.className.indexOf('ng-hide')>-1).toEqual(true)
    }));

    it('has a table to describe detail about crv that is shown when there is suggestion',inject(function(){
        //init controller
        var share_setting_mock = {}
        createControllerAndView(share_setting_mock);      
        var network_product = {};
        var sp_1 = {get_cost:jasmine.createSpy()}//this way the empty_to_end filter can function
        var sp_2 = {get_cost:jasmine.createSpy()}//this way the empty_to_end filter can function
        var network_product_sp_lst = [sp_1,sp_2];
        network_product.get_sp_lst = jasmine.createSpy().and.returnValue(network_product_sp_lst);

        var most_popular = {value:1.23, percent:60 };
        var second_popular = {value:2.34, percent:20 };
        var least_popular = {value:3.45, percent:10 };

        network_product.get_suggest_extra = jasmine.createSpy().and.callFake(function(field){
            if(field === 'crv'){
                return [second_popular,most_popular,least_popular]
            }
        })    
        scope.init(network_product);   
        scope.$digest();    
        
        var crv_table_node = view[4];
        expect(crv_table_node.className.indexOf('ng-hide')>-1).toEqual(false);
        // debugger;
        var tbody_text = crv_table_node.textContent;

        var index_crv_1,index_crv_2,index_crv_3;
        var index_percent_1,index_percent_2,index_percent_3;

        index_crv_1 = tbody_text.indexOf(most_popular.value);
        index_percent_1 = tbody_text.indexOf(most_popular.percent);
        index_crv_2 = tbody_text.indexOf(second_popular.value);
        index_percent_2 = tbody_text.indexOf(second_popular.percent); 
        index_crv_3 = tbody_text.indexOf(least_popular.value);
        index_percent_3 = tbody_text.indexOf(least_popular.percent);                

        expect(
            index_crv_1 < index_percent_1 <
            index_crv_2 < index_percent_2 <
            index_crv_3 < index_percent_3
        ).toEqual(true)
    }));
})