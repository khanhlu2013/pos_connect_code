describe("product_app -> controller -> sku_search", function () {

    var createController,scope;
    
    beforeEach(module('app.productApp', function($provide) {
        $provide.value('share_setting', '{}');
    }));

    beforeEach(inject(function($controller,$rootScope){
        scope = $rootScope.$new();
        createController = function(sp_rest_search,sku_not_found_handler){
            var ctrlParam = {
                $scope:scope
            }
            if(sp_rest_search != null){
                ctrlParam['model.store_product.rest_search'] = sp_rest_search;
            }
            if(sku_not_found_handler != null){
                ctrlParam['model.store_product.sku_not_found_handler'] = sku_not_found_handler;
            }            
            return $controller('app.productApp.controller',ctrlParam);
        }
    })); 

    it("can clear sp_lst when sku_search_str is empty",function(){
        createController();
        var dummy_sp_lst = [1,2,3];
        scope.sp_lst = dummy_sp_lst
        scope.sku_search_str = '';
        scope.sku_search();
        expect(scope.sp_lst.length).toEqual(0);//sp_lst is clear
    });               
    it("can display sku search result of cur-login-store",inject(['$q',function($q){
        var search_defer = $q.defer();
        var sp_rest_search = {by_sku: function(){}};
        spyOn(sp_rest_search,'by_sku').and.returnValue(search_defer.promise);
        createController(sp_rest_search,null/*sku_not_found_handler*/);

        scope.sp_lst = [];
        scope.sku_search_str = 'a_dummy_sku';
        scope.sku_search();
        // expect(sp_rest_search.by_sku).toHaveBeenCalledWith(scope.sku_search_str);

        //return sku search promise
        var dummy_sku_search_result = [1,2,3,4];
        search_defer.resolve({
             prod_store__prod_sku__1_1:dummy_sku_search_result
            // ,prod_store__prod_sku__1_0:[] -> it is not nessesary to return empty result because sku search already return result from cur-login-store
            // ,prod_store__prod_sku__0_0:[] -> it is not nessesary to return empty result because sku search already return result from cur-login-store              
        })            
        scope.$digest(); 
        expect(scope.sp_lst.length).toEqual(dummy_sku_search_result.length);
    }]));

    it("can call sku_not_found_handler service when there is no sp result from cur-login-store",inject(['$q',function($q){
        //search service
        var search_defer = $q.defer();
        var sp_rest_search = {by_sku: function(){}};
        spyOn(sp_rest_search,'by_sku').and.returnValue(search_defer.promise);

        //sku not found handler service
        var sku_not_found_handler_defer = $q.defer();
        var sku_not_found_handler = jasmine.createSpy().and.returnValue(sku_not_found_handler_defer.promise);

        //create controller
        createController(sp_rest_search,sku_not_found_handler);

        //sku search
        scope.sp_lst = [];
        scope.sku_search_str = 'a_dummy_sku';
        scope.sku_search();
        expect(sp_rest_search.by_sku).toHaveBeenCalledWith(scope.sku_search_str);

        //return sku search promise
        search_defer.resolve({
             prod_store__prod_sku__1_1:[]
            // ,prod_store__prod_sku__1_0:[] -> it is not nessesary to return empty result because i will moke the sku_not_found_handler to return something
            // ,prod_store__prod_sku__0_0:[] -> it is not nessesary to return empty result because i will moke the sku_not_found_handler to return something
        });
        sku_not_found_handler_defer.resolve('a_dummy_sp');

        scope.$digest(); 
        expect(scope.sp_lst.length).toEqual(1);
    }]));  
});