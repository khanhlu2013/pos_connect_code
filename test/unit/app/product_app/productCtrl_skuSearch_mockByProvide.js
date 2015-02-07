// describe("product_app -> controller", function () {

//     var createController,scope,defer;
//     var xxx;

//     beforeEach(module('app.productApp', function($provide) {
//         $provide.value('share_setting', '{}');
//         var sp_rest_search = {by_sku: function(){}};
//         xxx = spyOn(sp_rest_search,'by_sku');
//         $provide.value('model.store_product.rest_search', sp_rest_search);  
//     }));

//     beforeEach(inject(function($controller,$rootScope){
//         scope = $rootScope.$new();

//         createController = function(){
//             var ctrlParam = {
//                 $scope:scope
//             }
//             return $controller('app.productApp.productCtrl',ctrlParam);
//         }
//     })); 

//     describe(' -> sku_search',function(){
//         it("can display sku search result of cur-login-store",inject(['$q',function($q){
//             var defer = $q.defer();
//             xxx.and.returnValue(defer.promise);
//             createController();

//             scope.sp_lst = [];
//             scope.sku_search_str = 'a_dummy_sku';
//             scope.sku_search();
//             // expect(sp_rest_search.by_sku).toHaveBeenCalledWith(scope.sku_search_str);

//             //return sku search promise
//             var dummy_sku_search_result = [1,2,3,4];
//             defer.resolve({
//                  prod_store__prod_sku__1_1:dummy_sku_search_result
//                 ,prod_store__prod_sku__1_0:[]
//                 ,prod_store__prod_sku__0_0:[]             
//             })            
//             scope.$digest(); 
//             expect(scope.sp_lst.length).toEqual(dummy_sku_search_result.length);
//         }]));
//     });
// });