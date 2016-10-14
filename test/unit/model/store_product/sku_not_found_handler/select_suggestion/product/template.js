describe('model.store_product.sku_not_found_handler.select_suggestion.product.template.html',function(){
    var view,scope,createControllerAndCompileTemplate;
    var modal_instance_mock = {
        close:jasmine.createSpy(),
        dismiss:jasmine.createSpy()
    }
    var select_product_confirmation_mock = jasmine.createSpy();
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
        $provide.value('model.store_product.sku_not_found_handler.select_suggestion.product.confirm',select_product_confirmation_mock);
    }))
    beforeEach(inject(function($templateCache,$compile,$controller,$rootScope){
        createControllerAndCompileTemplate = function(product_lst,my_sp_lst,sku){
            var html = $templateCache.get('model.store_product.sku_not_found_handler.select_suggestion.product.template.html');
            scope = $rootScope.$new();
            $controller('model.store_product.sku_not_found_handler.select_suggestion.product.controller',{
                $scope : scope,
                product_lst : product_lst,
                my_sp_lst : my_sp_lst,
                sku : sku
            });
            view = $compile(angular.element(html))(scope);
            scope.$digest();
        }
    }));
    it('can display product_lst and is sort by desending popularity',inject(function(){
        var product_lst_fixure = [
            {memeber_count:3},
            {memeber_count:4},
            {memeber_count:2},
        ]; 
        var product_lst = [];
        for(var i = 0;i<product_lst_fixure.length;i++){
            var product = {
                id:product_lst_fixure[i].id
            }
            var sp_lst=[];
            for(var j = 0;j<product_lst_fixure[i].memeber_count;j++){
                sp_lst.push(j);
            }
            product.get_sp_lst = jasmine.createSpy().and.returnValue(sp_lst);
            product_lst.push(product);
        }
        var my_sp_lst = undefined;
        var sku = undefined;
        createControllerAndCompileTemplate(product_lst,my_sp_lst,sku);
        var member_count_lst = view.find(ng_id_str_2_jquery_id_str('model.store_product.sku_not_found_handler.select_suggestion.product.product_lst.member_count','id'));
        expect(member_count_lst.length).toEqual(3);
        expect(member_count_lst['0'].textContent).toEqual('4');
        expect(member_count_lst['1'].textContent).toEqual('3');
        expect(member_count_lst['2'].textContent).toEqual('2');

    }));
    it('can display product_lst with member_count,name,price,crv,cost columns',inject(function(){
        var fixture_1 = {memeber_count:3,name:'name_1',price:44.44,crv:11.11,cost:77.77};
        var fixture_2 = {memeber_count:2,name:'name_2',price:55.55,crv:22.22,cost:88.88};
        var fixture_3 = {memeber_count:1,name:'name_3',price:66.66,crv:33.33,cost:99.99};

        var product_lst_fixure = [fixture_1,fixture_2,fixture_3];
        var product_lst = [];
        for(var i = 0;i<product_lst_fixure.length;i++){
            var product = {};

            //member count
            var sp_lst=[];
            for(var j = 0;j<product_lst_fixure[i].memeber_count;j++){
                sp_lst.push(j);
            }
            product.get_sp_lst = jasmine.createSpy().and.returnValue(sp_lst);

            //raw data
            product.name = product_lst_fixure[i].name;
            product.price = product_lst_fixure[i].price;
            product.crv = product_lst_fixure[i].crv;
            product.cost = product_lst_fixure[i].cost;
            product.get_suggest_main = jasmine.createSpy().and.callFake(function(field){
                if(field === 'name'){
                    return {value:this.name};
                }else if(field === 'crv'){
                    return {value:this.crv};
                }else if(field === 'price'){
                    return this.price;
                }else if(field === 'cost'){
                    return this.cost;
                }
            })
            product_lst.push(product);
        }
   
        var my_sp_lst = undefined;
        var sku = undefined;
        createControllerAndCompileTemplate(product_lst,my_sp_lst,sku);

        //member_count
        var member_count_lst = view.find(ng_id_str_2_jquery_id_str('model.store_product.sku_not_found_handler.select_suggestion.product.product_lst.member_count','id'));        
        expect(member_count_lst.length).toEqual(3);        
        expect(member_count_lst[0].textContent).toEqual(fixture_1.memeber_count.toString());
        expect(member_count_lst[1].textContent).toEqual(fixture_2.memeber_count.toString());
        expect(member_count_lst[2].textContent).toEqual(fixture_3.memeber_count.toString());

        //name
        var name_lst = view.find(ng_id_str_2_jquery_id_str('model.store_product.sku_not_found_handler.select_suggestion.product.product_lst.name','id'));        
        expect(name_lst.length).toEqual(3);        
        expect(name_lst[0].textContent).toEqual(fixture_1.name);
        expect(name_lst[1].textContent).toEqual(fixture_2.name);
        expect(name_lst[2].textContent).toEqual(fixture_3.name);

        //price
        var price_lst = view.find(ng_id_str_2_jquery_id_str('model.store_product.sku_not_found_handler.select_suggestion.product.product_lst.price','id'));        
        expect(price_lst.length).toEqual(3);        
        expect(price_lst[0].textContent).toEqual('$'+fixture_1.price);
        expect(price_lst[1].textContent).toEqual('$'+fixture_2.price);
        expect(price_lst[2].textContent).toEqual('$'+fixture_3.price);

        //crv
        var crv_lst = view.find(ng_id_str_2_jquery_id_str('model.store_product.sku_not_found_handler.select_suggestion.product.product_lst.crv','id'));        
        expect(crv_lst.length).toEqual(3);        
        expect(crv_lst[0].textContent).toEqual('$'+fixture_1.crv);
        expect(crv_lst[1].textContent).toEqual('$'+fixture_2.crv);
        expect(crv_lst[2].textContent).toEqual('$'+fixture_3.crv);

        //cost
        var cost_lst = view.find(ng_id_str_2_jquery_id_str('model.store_product.sku_not_found_handler.select_suggestion.product.product_lst.cost','id'));        
        expect(cost_lst.length).toEqual(3);        
        expect(cost_lst[0].textContent).toEqual('$'+fixture_1.cost);
        expect(cost_lst[1].textContent).toEqual('$'+fixture_2.cost);
        expect(cost_lst[2].textContent).toEqual('$'+fixture_3.cost);        
    }));    

    it('can hide tax column if the percent is 50',inject(function(){
        var product = {};
        product.get_suggest_main = jasmine.createSpy().and.callFake(function(field){
            if(field === 'is_taxable'){
                return {
                    percent:50,
                    value:true
                }
            }
        })
   
        var my_sp_lst = undefined;
        var sku = undefined;
        createControllerAndCompileTemplate([product],my_sp_lst,sku);

        //is_taxable
        var is_taxable_lst = view.find(ng_id_str_2_jquery_id_str('model.store_product.sku_not_found_handler.select_suggestion.product.product_lst.is_taxable','id'));
        expect(is_taxable_lst.length).toEqual(1);    
        var node = is_taxable_lst[0];
        var child_wrap = node.childNodes['1'];//node have only 1 child which is a wraping div. but childNodes return 3 element with the middle element (index = 1) is the correct one
        expect(child_wrap.className).toEqual('ng-hide');
    }));   

    it('can display tax column if the percent is not 50',inject(function(){
        var product = {};
        product.get_suggest_main = jasmine.createSpy().and.callFake(function(field){
            if(field === 'is_taxable'){
                return {
                    percent:51,
                    value:true
                }
            }
        })
   
        var my_sp_lst = undefined;
        var sku = undefined;
        createControllerAndCompileTemplate([product],my_sp_lst,sku);

        //is_taxable
        var is_taxable_lst = view.find(ng_id_str_2_jquery_id_str('model.store_product.sku_not_found_handler.select_suggestion.product.product_lst.is_taxable','id'));
        expect(is_taxable_lst.length).toEqual(1);    
        var node = is_taxable_lst[0];
        var child_wrap = node.childNodes['1'];//node have only 1 child which is a wraping div. but childNodes return 3 element with the middle element (index = 1) is the correct one
        expect(child_wrap.className).toEqual('');
    }));   

    it('can display tax column as a glyphicon-check when it is taxable',inject(function(){
        var product = {};
        product.get_suggest_main = jasmine.createSpy().and.callFake(function(field){
            if(field === 'is_taxable'){
                return {
                    percent:51,
                    value:true
                }
            }
        })
   
        var my_sp_lst = undefined;
        var sku = undefined;
        createControllerAndCompileTemplate([product],my_sp_lst,sku);

        //is_taxable
        var is_taxable_lst = view.find(ng_id_str_2_jquery_id_str('model.store_product.sku_not_found_handler.select_suggestion.product.product_lst.is_taxable','id'));
        expect(is_taxable_lst.length).toEqual(1);    
        var node = is_taxable_lst[0];
        var child_wrap = node.childNodes['1'];//node have only 1 child which is a wraping div. but childNodes return 3 element with the middle element (index = 1) is the correct one
        var glyphicon_element = child_wrap.childNodes['1'];//it is another misterious that childNodes here is at index of '1' instead of '0'
        expect(glyphicon_element.className).toEqual('glyphicon glyphicon-check');
    }));   

    it('can display tax column as a glyphicon-unchecked when it is not taxable',inject(function(){
        var product = {};
        product.get_suggest_main = jasmine.createSpy().and.callFake(function(field){
            if(field === 'is_taxable'){
                return {
                    percent:51,
                    value:false
                }
            }
        })
   
        var my_sp_lst = undefined;
        var sku = undefined;
        createControllerAndCompileTemplate([product],my_sp_lst,sku);

        //is_taxable
        var is_taxable_lst = view.find(ng_id_str_2_jquery_id_str('model.store_product.sku_not_found_handler.select_suggestion.product.product_lst.is_taxable','id'));
        expect(is_taxable_lst.length).toEqual(1);    
        var node = is_taxable_lst[0];
        var child_wrap = node.childNodes['1'];//node have only 1 child which is a wraping div. but childNodes return 3 element with the middle element (index = 1) is the correct one
        var glyphicon_element = child_wrap.childNodes['1'];//it is another misterious that childNodes here is at index of '1' instead of '0'
        expect(glyphicon_element.className).toEqual('glyphicon glyphicon-unchecked');
    })); 

    it('can hide tax column percent amount if the amount is 100%',inject(function(){
        var product = {};
        product.get_suggest_main = jasmine.createSpy().and.callFake(function(field){
            if(field === 'is_taxable'){
                return {
                    percent:100,
                    value:false
                }
            }
        })
   
        var my_sp_lst = undefined;
        var sku = undefined;
        createControllerAndCompileTemplate([product],my_sp_lst,sku);

        //is_taxable
        var is_taxable_lst = view.find(ng_id_str_2_jquery_id_str('model.store_product.sku_not_found_handler.select_suggestion.product.product_lst.is_taxable','id'));
        expect(is_taxable_lst.length).toEqual(1);    
        var node = is_taxable_lst[0];
        var child_wrap = node.childNodes['1'];//node have only 1 child which is a wraping div. but childNodes return 3 element with the middle element (index = 1) is the correct one

        var amount_element = child_wrap.childNodes['3'];//it is another misterious that childNodes here is at index of '3' instead of '1' (after position 0 which is the glyphicon symbol)
        expect(amount_element.className.indexOf('ng-hide')>-1).toEqual(true) ;
    })); 

    it('can show tax column percent amount if the amount is not 100%',inject(function(){
        var product = {};
        product.get_suggest_main = jasmine.createSpy().and.callFake(function(field){
            if(field === 'is_taxable'){
                return {
                    percent:30,
                    value:false
                }
            }
        })
   
        var my_sp_lst = undefined;
        var sku = undefined;
        createControllerAndCompileTemplate([product],my_sp_lst,sku);

        //is_taxable
        var is_taxable_lst = view.find(ng_id_str_2_jquery_id_str('model.store_product.sku_not_found_handler.select_suggestion.product.product_lst.is_taxable','id'));
        expect(is_taxable_lst.length).toEqual(1);    
        var node = is_taxable_lst[0];
        var child_wrap = node.childNodes['1'];//node have only 1 child which is a wraping div. but childNodes return 3 element with the middle element (index = 1) is the correct one

        var amount_element = child_wrap.childNodes['3'];//it is another misterious that childNodes here is at index of '3' instead of '1' (after position 0 which is the glyphicon symbol)
        expect(amount_element.className.indexOf('ng-hide')>-1).toEqual(false) ;
    })); 

    it('can display tax column percent amount',inject(function(){
        var product = {};
        var percent = 31;
        product.get_suggest_main = jasmine.createSpy().and.callFake(function(field){
            if(field === 'is_taxable'){
                return {
                    percent:percent,
                    value:false
                }
            }
        })
   
        var my_sp_lst = undefined;
        var sku = undefined;
        createControllerAndCompileTemplate([product],my_sp_lst,sku);

        //is_taxable
        var is_taxable_lst = view.find(ng_id_str_2_jquery_id_str('model.store_product.sku_not_found_handler.select_suggestion.product.product_lst.is_taxable','id'));
        expect(is_taxable_lst.length).toEqual(1);    
        var node = is_taxable_lst[0];
        var child_wrap = node.childNodes['1'];//node have only 1 child which is a wraping div. but childNodes return 3 element with the middle element (index = 1) is the correct one
        var amount_element = child_wrap.childNodes['3'];//it is another misterious that childNodes here is at index of '3' instead of '1' (after position 0 which is the glyphicon symbol)
        expect(amount_element.textContent.trim()).toEqual('(' + percent + '%' + ')');
    })); 

    it('can display product_lst with a select button at the end',inject(function(){
        var product_lst = [1,2,3];
        var my_sp_lst = undefined;
        var sku = undefined;        
        createControllerAndCompileTemplate(product_lst,my_sp_lst,sku);
        
        // mock scope.select_product()
        scope.select_product = jasmine.createSpy();

        //click select product
        var select_product_btn_lst = view.find(ng_id_str_2_jquery_id_str('model.store_product.sku_not_found_handler.select_suggestion.product.product_lst.select_btn','id'));
        var index_to_click = 2
        select_product_btn_lst[index_to_click.toString()].click();//click on the last line - aka index = 2
        expect(scope.select_product).toHaveBeenCalledWith(product_lst[index_to_click]);
    }));

    it('has a button to create new product',inject(function(){
        createControllerAndCompileTemplate();
        
        // mock scope.select_product()
        scope.create_new_product = jasmine.createSpy();

        //click select product
        var create_new_product_btn = view.find(ng_id_str_2_jquery_id_str('sp_app/service/suggest/select_product_dlg/create_new_product_btn','id'));
        create_new_product_btn.click();
        expect(scope.create_new_product).toHaveBeenCalled();
    }));     

})