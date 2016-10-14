describe('model.store_product.search.online.multiple.template',function(){
    var view,html,scope,$rootScope,$compile,createControllerAndCompile;
    var modal_instance_mock = {
        close : jasmine.createSpy(),
        dismiss : jasmine.createSpy()
    }
    var sp_rest_search_mock = {
        by_name_sku : jasmine.createSpy()
    }
    beforeEach(module('app.productApp.partial'));
    beforeEach(module('share.directive'));
    beforeEach(module('model.store_product',function($provide){
        $provide.value('$modalInstance',modal_instance_mock);
        $provide.value('model.store_product.rest_search',sp_rest_search_mock);
    }));
    beforeEach(inject(function($controller,_$rootScope_,_$compile_,$templateCache){
        createControllerAndCompile = function(){
            html = $templateCache.get('model.store_product.search.online.multiple.template.html');
            $rootScope = _$rootScope_;
            scope = $rootScope.$new();
            $controller('model.store_product.search.online.multiple.controller',{
                $scope:scope,
            })
            $compile = _$compile_;
            view = $compile(angular.element(html))(scope);
            scope.$digest();
        }
    }))
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
    it('has a search textbox to search name sku',inject([function(){
        createControllerAndCompile();
        scope.search = jasmine.createSpy();

        var search_txt = jQuery(view.find(ng_id_str_2_jquery_id_str('sp_ll_app/service/search/name_sku_online_dlg/multiple/search_txt','id'))[0]);
        var search_str = 'abc';
        search_txt.val(search_str).trigger('input');
        expect(scope.search_str).toEqual(search_str);
        
        var e = jQuery.Event("keypress");
        e.which = 13; //choose the one you want
        e.keyCode = 13;
        search_txt.trigger(e);
        expect(scope.search).toHaveBeenCalledWith();

    }]));

    it('has a table to display selected sp list',inject([function(){
        createControllerAndCompile();
        scope.remove = jasmine.createSpy();
        var name_1 = 'product 1'
        var sp_1 = {
            name: name_1,
            price: 1
        }
        var sp_2 = {
            name: 'product 2',
            price: 2
        }        
        scope.result_sp_lst = [sp_1,sp_2];

        view = $compile(angular.element(html))(scope);
        scope.$digest();

        var remove_btn_lst = view.find(ng_id_str_2_jquery_id_str('model.store_product.search.online.multiple.selected_sp_lst.remove_btn','id'));
        expect(remove_btn_lst.length).toEqual(scope.result_sp_lst.length);
        remove_btn_lst[1].click();
        expect(scope.remove).toHaveBeenCalledWith(sp_2);
    }]));

    it('has a table to display search result',inject([function(){
        createControllerAndCompile();
        scope.toggle_select = jasmine.createSpy();
        var name_1 = 'product 1'
        var sp_1 = {
            name: name_1,
            price: 1
        }
        var sp_2 = {
            name: 'product 2',
            price: 2
        }        
        scope.sp_lst = [sp_1,sp_2];

        view = $compile(angular.element(html))(scope);
        scope.$digest();

        var toggle_btn_lst = view.find(ng_id_str_2_jquery_id_str('model.store_product.search.online.multiple.search_result_lst.toggle_btn','id'));
        expect(toggle_btn_lst.length).toEqual(scope.sp_lst.length);
        toggle_btn_lst[1].click();
        expect(scope.toggle_select).toHaveBeenCalledWith(sp_2);
    }]));

    it('has a cancel button to close the dialog',inject([function(){
        createControllerAndCompile();
        var cancel_btn = view.find(ng_id_str_2_jquery_id_str('model.store_product.search.online.multiple.cancel_btn','id'))[0];
        cancel_btn.click();
        expect(modal_instance_mock.dismiss).toHaveBeenCalledWith('_cancel_');

    }]));

    it('has a reset button to reset current selected result',inject([function(){
        createControllerAndCompile();
        scope.reset = jasmine.createSpy();
        var reset_btn = angular.element(view.find(ng_id_str_2_jquery_id_str('model.store_product.search.online.multiple.reset_btn','id'))[0]);
        expect(reset_btn.hasClass('disabled'));
        scope.result_sp_lst = [1,2,3];
        expect(reset_btn.hasClass('disabled')).toEqual(false);
        reset_btn.click();
        expect(scope.reset).toHaveBeenCalledWith();
    }]));

    it('has an ok button',inject([function(){
        createControllerAndCompile();
        scope.ok = jasmine.createSpy();
        var ok_btn = angular.element(view.find(ng_id_str_2_jquery_id_str('sp_ll_app/service/search/name_sku_online_dlg/multiple/ok_btn','id'))[0]);
        expect(ok_btn.hasClass('disabled'));
        scope.result_sp_lst = [1,2,3];
        expect(ok_btn.hasClass('disabled')).toEqual(false);
        ok_btn.click();
        expect(scope.ok).toHaveBeenCalledWith();        
    }]));
})