describe('model.product.network_product.controller',function(){
    var scope,$rootScope,createController;
    var share_setting_mock = 'dummy_share_setting';

    beforeEach(module('model.product',function($provide){
        $provide.value('share_setting',share_setting_mock)
    }));
    beforeEach(inject(function(_$rootScope_,$controller){
        $rootScope = _$rootScope_;
        scope = $rootScope.$new();
        createController = function(){
            $controller('model.product.network_product.controller',{
                $scope:scope
            })
        }
    }));
    it('can init scope.share_setting',inject(function(){
        createController();
        expect(scope.share_setting).toEqual(share_setting_mock);
    }));
    it('can listen to network_product_is_update event',inject(function(){
        createController();
        scope.init = jasmine.createSpy();

        //create event
        var network_product = 'dummy_network_product';
        $rootScope.$broadcast('network_product_is_updated',network_product);
        expect(scope.init).toHaveBeenCalledWith(network_product);
    }));    
    it('has init() that can set scope.is_sale_data to true',inject(function(){
        createController();

        var network_product = {};
        network_product.get_sp_lst = jasmine.createSpy().and.returnValue([{sale:'dummy_sale'}]);
        network_product.get_suggest_extra = jasmine.createSpy();
        scope.init(network_product);
        expect(scope.is_sale_data).toEqual(true);
    }));
    it('has init() that can set scope.is_sale_data to false',inject(function(){
        createController();

        var network_product = {};
        network_product.get_sp_lst = jasmine.createSpy().and.returnValue([{sale:undefined}]);
        network_product.get_suggest_extra = jasmine.createSpy();

        scope.init(network_product);
        expect(scope.is_sale_data).toEqual(false);
    }));
    it('has init() that do init scope.network_product,scope.suggest_extra_crv,scope.suggest_extra_name',inject(function(){
        createController();

        var network_product = {};
        network_product.get_sp_lst = jasmine.createSpy().and.returnValue([]);
        network_product.get_suggest_extra = jasmine.createSpy().and.callFake(function(field){
            return field;
        });

        scope.init(network_product);
        expect(scope.network_product).toEqual(network_product); 
        expect(scope.suggest_extra_crv).toEqual('crv');
        expect(scope.suggest_extra_name).toEqual('name');
    }));
    it('has init() that can create scope.column_click()',inject(function(){
        createController();

        var network_product = {};
        network_product.get_suggest_extra = jasmine.createSpy();
        network_product.get_sp_lst = jasmine.createSpy().and.returnValue([]);
        //verify init value
        scope.init(network_product);
        expect(scope.cur_sort_desc).toEqual(false);
        expect(scope.cur_sort_column).toEqual('get_cost()');        
        
        //change sort order
        scope.column_click('get_cost()');
        expect(scope.cur_sort_column).toEqual('get_cost()');
        expect(scope.cur_sort_desc).toEqual(true);

        //change column_sort
        var dummy_column = 'dummy_column';
        scope.column_click(dummy_column);
        expect(scope.cur_sort_column).toEqual(dummy_column);
        expect(scope.cur_sort_desc).toEqual(false);        

        //change sort order 
        scope.column_click(dummy_column);
        expect(scope.cur_sort_column).toEqual(dummy_column);
        expect(scope.cur_sort_desc).toEqual(true);             
    }));   
    it('has init() that can create scope.get_sort_class()',inject(function(){
        createController();

        var network_product = {};
        network_product.get_sp_lst = jasmine.createSpy().and.returnValue([]);
        network_product.get_suggest_extra = jasmine.createSpy();

        //verify init value
        scope.init(network_product);

        var dummy_column = 'dummy_column';
        expect(scope.get_sort_class(dummy_column)).toEqual('');//because current column by default is 'get_cost()'
        scope.cur_sort_column = dummy_column;
        expect(scope.get_sort_class(dummy_column)).toEqual('glyphicon glyphicon-arrow-up');

        //lets change sort order
        scope.column_click(dummy_column);
        expect(scope.get_sort_class(dummy_column)).toEqual('glyphicon glyphicon-arrow-down');
    })); 
})