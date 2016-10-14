describe("product_app -> controller -> name_search", function () {

    var createController,scope,$rootScope;
    var sp_rest_search_mock = {
        by_name : jasmine.createSpy()
    }
    var infinite_scroll_handler_mock = jasmine.createSpy();

    beforeEach(module('app.productApp', function($provide) {
        $provide.value('model.store_product.rest_search',sp_rest_search_mock);
        $provide.value('model.store_product.search.online.infinite_scroll_handler',infinite_scroll_handler_mock)
    }));

    beforeEach(inject(function($controller,_$rootScope_){
        $rootScope = _$rootScope_;
        scope = $rootScope.$new();

        createController = function(){
            return $controller('app.productApp.controller',{
                $scope:scope
            });
        }
    })); 

    it("can abort when name_search_str is emtpy or containing whitespace",function(){
        createController();

        //name search
        scope.name_search_str = '  ';//white space
        scope.name_search();

        //name_search terminate before reaching sp_rest_search
        expect(sp_rest_search_mock.by_name).not.toHaveBeenCalled();
    });   

    it("can use sp_rest_search to search for name, ",inject(function($q){
        createController();

        //before execute testing code, lets train sp_rest_search.by_name response
        var search_defer = $q.defer();
        sp_rest_search_mock.by_name.and.returnValue(search_defer.promise);

        //name search
        scope.name_search_str = 'abc';//white space
        scope.name_search();

        //name_search terminate before reaching sp_rest_search
        expect(sp_rest_search_mock.by_name).toHaveBeenCalledWith(scope.name_search_str,0/*after*/);

        //lets resolve search promise
        expect(scope.is_blur_infinite_scroll_triggerer_textbox).toEqual(false);
        expect(scope.sp_lst.length).toEqual(0);
        var search_data = [1,2,3];
        search_defer.resolve(search_data);
        $rootScope.$digest();
        expect(scope.is_blur_infinite_scroll_triggerer_textbox).toEqual(true);
        expect(scope.sp_lst).toEqual(search_data);
    }));   

    it("has infinite_scroll_handler that abort when name_search_str is blank",inject(function(){
        createController();
        scope.name_search_str = "";
        scope.infinite_scroll_handler();
        expect(infinite_scroll_handler_mock).not.toHaveBeenCalled();
    }))

    it("has infinite_scroll_handler that use infinite_scroll_handler service when name_search_str is not blank",inject(function(){
        createController();
        scope.name_search_str = "abc";
        scope.infinite_scroll_handler();
        expect(infinite_scroll_handler_mock).toHaveBeenCalledWith(scope,scope.name_search_str,true/*name_only*/,scope.sp_lst);
    }));
});