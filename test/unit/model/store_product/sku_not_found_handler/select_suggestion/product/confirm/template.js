describe('model.store_product.sku_not_found_handler.select_suggestion.product.confirm.html',function(){
    var view,scope,createControllerAndView;
    var modal_instance_mock = {
        dismiss:jasmine.createSpy(),
        close:jasmine.createSpy()
    }
    var share_setting_mock = 'dummy_share_setting';

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
    beforeEach(module('share.filter'))
    beforeEach(module('model.store_product',function($provide){
        $provide.value('$modalInstance',modal_instance_mock);
        $provide.value('share_setting',share_setting_mock);
    }))
    beforeEach(inject(function($rootScope,$templateCache,$compile,$controller){
        var html = $templateCache.get('model.store_product.sku_not_found_handler.select_suggestion.product.confirm.main.html');
        scope = $rootScope.$new();
        createControllerAndView = function(network_product,product_lst,my_sp_lst,sku){
            $controller('model.store_product.sku_not_found_handler.select_suggestion.product.confirm.controller',{
                $scope : scope,
                network_product : network_product,
                product_lst : product_lst,
                my_sp_lst : my_sp_lst,
                sku : sku
            });
            view = $compile(angular.element(html))(scope);
            scope.$digest();
        }
    }))

    it('can include network_product template',inject(function(){
        var network_product = {
            get_suggest_extra : jasmine.createSpy(),
            get_sp_lst : jasmine.createSpy().and.returnValue([])
        }
        createControllerAndView(network_product);
        var temp = view.find(ng_id_str_2_jquery_id_str('model.product.network_product.html','id'));
        expect(temp.length !== 0).toEqual(true);
    }));

    it('has back button to go back and select suggest network product',inject(function(){
        var network_product = {
            get_suggest_extra : jasmine.createSpy(),
            get_sp_lst : jasmine.createSpy().and.returnValue([])
        }

        //verify the back button is exist
        createControllerAndView(network_product);
        var temp = view.find(ng_id_str_2_jquery_id_str('model.store_product.sku_not_found_handler.select_suggestion.product.confirm.back_btn','id'));
        expect(temp.length !== 0).toEqual(true); 
        var btn = temp[0];

        //mock the back button
        scope.select_product = jasmine.createSpy();

        //click the button
        expect(scope.select_product).not.toHaveBeenCalled();    
        btn.click();
        expect(scope.select_product).toHaveBeenCalled();    
    }));

    it('has a add product button - aka ok button - to select product',inject(function(){
        var network_product = {
            get_suggest_extra : jasmine.createSpy(),
            get_sp_lst : jasmine.createSpy().and.returnValue([])
        }

        //verify the back button is exist
        createControllerAndView(network_product);
        var temp = view.find(ng_id_str_2_jquery_id_str('sp_app/service/suggest/select_product_confirm_dlg/ok_btn','id'));
        expect(temp.length !== 0).toEqual(true); 
        var btn = temp[0];

        //mock the back button
        scope.return_product = jasmine.createSpy();

        //click the button
        expect(scope.return_product).not.toHaveBeenCalled();    
        btn.click();
        expect(scope.return_product).toHaveBeenCalled();          
    }))
})
