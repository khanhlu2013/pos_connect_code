describe("product_app -> controller -> name_search", function () {

    var createController,scope;
    
    beforeEach(module('app.productApp', function($provide) {
        $provide.value('share_setting', '{}');
    }));

    beforeEach(inject(function($controller,$rootScope){
        scope = $rootScope.$new();
        createController = function(sp_rest_search){
            var ctrlParam = {
                $scope:scope
            }
            if(sp_rest_search != null){
                ctrlParam['model.store_product.rest_search'] = sp_rest_search;
            }
            return $controller('app.productApp.productCtrl',ctrlParam);
        }
    })); 

    it("can abort when name_search_busy flag is true",function(){
        //mock sp_rest_search
        var sp_rest_search = {by_name: function(){}};
        spyOn(sp_rest_search,'by_name');
        createController(sp_rest_search);

        //name search
        scope.name_search_busy = true;
        var is_infinite_scroll = undefined;/*it does not matter in this test*/
        scope.name_search(is_infinite_scroll);
        
        //name_search terminate before reaching sp_rest_search
        expect(sp_rest_search.by_name).not.toHaveBeenCalled();
    });               

    it("can abort when name_search_str is emtpy or containing whitespace",function(){
        //mock sp_rest_search
        var sp_rest_search = {by_name: function(){}};
        spyOn(sp_rest_search,'by_name');
        createController(sp_rest_search);

        //name search
        var is_infinite_scroll = undefined;/*it does not matter in this test*/
        scope.name_search_str = '  ';//white space
        scope.name_search(is_infinite_scroll);

        //name_search terminate before reaching sp_rest_search
        expect(sp_rest_search.by_name).not.toHaveBeenCalled();
    });   

    it("can abort when name_search is trigger by infinite scroll and it already reached the end",function(){
        //mock sp_rest_search
        var sp_rest_search = {by_name: function(){}};
        spyOn(sp_rest_search,'by_name');
        createController(sp_rest_search);

        //name search
        var is_infinite_scroll = true;/*it does not matter in this test*/
        scope.name_search_str = 'dummy_name_search_str';
        scope.name_search_reach_the_end = true;
        scope.name_search(is_infinite_scroll);

        //name_search terminate before reaching sp_rest_search
        expect(sp_rest_search.by_name).not.toHaveBeenCalled();
    }); 

    it("can calculate 'after' when triggered by infinite scroll and it not yet reached the end",inject(function($q){
        //mock sp_rest_search
        var sp_rest_search = {by_name: function(){}};
        var a_dummy_promise = $q.defer().promise;//this promise is never resolve/reject because we don't care in this test
        spyOn(sp_rest_search,'by_name').and.returnValue(a_dummy_promise);
        createController(sp_rest_search);

        //name search
        var is_infinite_scroll = true;/*it does not matter in this test*/
        scope.name_search_str = 'dummy_name_search_str';
        scope.name_search_reach_the_end = false;
        scope.sp_lst = [1,2,3,4];//dummy current sp_lst.
        scope.name_search(is_infinite_scroll);

        //verify that after is pass in correctly to sp_rest_search.by_name
        var after = scope.sp_lst.length;
        expect(sp_rest_search.by_name).toHaveBeenCalledWith(scope.name_search_str,after);
    }));   

    it("can set name_search_reach_the_end flag to true when there is no result from sp_rest.by_name()",inject(function($q){
        //mock sp_rest_search
        var sp_rest_search = {by_name: function(){}};
        var defer = $q.defer();
        spyOn(sp_rest_search,'by_name').and.returnValue(defer.promise);
        createController(sp_rest_search);

        //name search
        var is_infinite_scroll = true;/*it does not matter in this test*/
        scope.name_search_str = 'dummy_name_search_str';
        scope.name_search_reach_the_end = false;
        scope.name_search(is_infinite_scroll);
        expect(sp_rest_search.by_name).toHaveBeenCalled();

        //verify that name_search_reach_the_end is set when result from search is empty
        defer.resolve([]/*empty result*/);
        scope.$digest(); 
        expect(scope.name_search_reach_the_end).toEqual(true);
    }));      

    it("can append search result into the current sp_lst",inject(function($q){
        //mock sp_rest_search
        var sp_rest_search = {by_name: function(){}};
        var defer = $q.defer();
        spyOn(sp_rest_search,'by_name').and.returnValue(defer.promise);
        createController(sp_rest_search);

        //name search
        var is_infinite_scroll = true;/*it does not matter in this test*/
        scope.name_search_str = 'dummy_name_search_str';
        var before_sp_lst = [1,2,3];
        scope.sp_lst.push.apply(scope.sp_lst,before_sp_lst);
        scope.name_search(is_infinite_scroll);
        expect(sp_rest_search.by_name).toHaveBeenCalled();

        //verify that name_search_reach_the_end is set when result from search is empty
        var search_result_lst = [4,5,6,7];
        defer.resolve(search_result_lst);
        scope.$digest(); 
        expect(scope.sp_lst.length).toEqual(before_sp_lst.length + search_result_lst.length);
    }));             
});