describe('model.store_product.sku_not_found_handler.select_suggestion.store_product.template',function(){
    var view,scope,createControllerAndCompileTemplate;
    var modal_instance_mock = {
        dismiss : jasmine.createSpy(),
        close : jasmine.createSpy
    }
    var confirm_service_mock = jasmine.createSpy();
    var ng_id_str_2_jquery_id_str = function(str,selector){
        str = str.replace(/\./g, '\\.');   //replace '.' -> '\\.'
        str = str.replace(/\//g, '\\\/'); //replace '/' -> '\\/'
        var symbol;
        if(selector === 'class'){
            symbol = '.'
        }else if(selector === 'id'){
            symbol = '#';
        }
        var result = symbol + str;
        return result;
    }
    beforeEach(module('app.productApp.partial'));
    beforeEach(module('model.store_product',function($provide){
        $provide.value('$modalInstance',modal_instance_mock);
        $provide.value('share.ui.confirm',confirm_service_mock);
    }));
    beforeEach(inject(function($templateCache,$controller,$compile,$rootScope){
        createControllerAndCompileTemplate = function(product_lst,my_sp_lst,sku){
            var html = $templateCache.get('model.store_product.sku_not_found_handler.select_suggestion.store_product.template.html');
            scope = $rootScope.$new();
            $controller('model.store_product.sku_not_found_handler.select_suggestion.store_product.controller',{
                $scope : scope,
                product_lst : product_lst,
                my_sp_lst : my_sp_lst,
                sku : sku
            });
            view = $compile(angular.element(html))(scope);          
            scope.$digest();  
        }

    }))

    it('can display a list of sp to be selected',inject(['model.store_product.Store_product',function(Store_product){
        var product_lst = null;
        var prod_1 = new Store_product(1);
        var prod_2 = new Store_product(2);
        var prod_3 = new Store_product(3);
        var my_sp_lst = [prod_1,prod_2,prod_3];
        var sku = null;
        
        //compile and verify sp_lst is displayed correctly in template
        createControllerAndCompileTemplate(product_lst,my_sp_lst,sku);
        var select_sp_btn_lst = view.find(ng_id_str_2_jquery_id_str('model.store_product.sku_not_found_handler.select_suggestion.store_product.lst.return_sp_btn','id'));
        expect(select_sp_btn_lst.length).toEqual(my_sp_lst.length);

        //verify select_sp button is hook-up correctly
        scope.return_sp = jasmine.createSpy();
        var index = 1;
        select_sp_btn_lst[index].click();
        expect(scope.return_sp).toHaveBeenCalledWith(my_sp_lst[index]);
    }]));

    it('can has a create new product button',inject([function(){
        var product_lst = null;
        var my_sp_lst = [];
        var sku = null;
        
        createControllerAndCompileTemplate(product_lst,my_sp_lst,sku);
        var create_new_btn = view.find(ng_id_str_2_jquery_id_str('sp_app/service/suggest/select_sp_dlg/create_new_product_btn','id'));
        
        scope.create_new_product = jasmine.createSpy();
        create_new_btn.click();
        expect(scope.create_new_product).toHaveBeenCalledWith();
    }]));

    it('can hide select network product dialog when there is no suggestion',inject([function(){
        var product_lst = [];
        var my_sp_lst = [];
        var sku = null;
        
        createControllerAndCompileTemplate(product_lst,my_sp_lst,sku);
        var select_network_product = view.find(ng_id_str_2_jquery_id_str('sp_app/service/suggest/select_sp_dlg/select_product_btn','id'));
        expect(select_network_product.hasClass('ng-hide')).toEqual(true);
    }]));

    it('can show select network product dialog when there is suggestion',inject([function(){
        var product_lst = [1,2,3];
        var my_sp_lst = [];
        var sku = null;
        
        createControllerAndCompileTemplate(product_lst,my_sp_lst,sku);
        var select_network_product = view.find(ng_id_str_2_jquery_id_str('sp_app/service/suggest/select_sp_dlg/select_product_btn','id'));
        expect(select_network_product.hasClass('ng-hide')).toEqual(false);
        scope.select_product = jasmine.createSpy();
        select_network_product.click();
        expect(scope.select_product).toHaveBeenCalledWith();
    }]));  
})