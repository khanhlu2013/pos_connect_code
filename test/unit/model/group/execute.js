describe('model.group.execute.modalCtrl',function(){
    var createController,scope;
    var modal_instance_mock = {
        dismiss : jasmine.createSpy()
    }
    var share_ui_alert_mock = jasmine.createSpy();
    var download_product_mock = jasmine.createSpy();
    var group_mock = {};

    beforeEach(module('model.group',function($provide){
        $provide.value('$modalInstance',modal_instance_mock);
        $provide.value('share.ui.alert',share_ui_alert_mock);
        $provide.value('share.util.offline_db.download_product',download_product_mock);
        $provide.value('group',group_mock);
    }))

    beforeEach(inject(function($controller,$rootScope){
        scope = $rootScope.$new();
        createController = function(){
            var ctrlParam = {
                $scope:scope,
            }
            return $controller('model.group.execute.modalCtrl',ctrlParam);            
        }
    }));

    it('can handle enable checkbox click',inject(
    [
        '$rootScope',
    function(
        $rootScope
    ){
        var price = 'price';
        var crv = 'crv';
        var is_taxable = 'is_taxable';
        var cost = 'cost';
        var is_sale_report = 'is_sale_report';
        var p_type = 'p_type';
        var p_tag = 'p_tag';
        var vendor = 'vendor';
        var buydown = 'buydown';
        var value_customer_price = 'value_customer_price';
        var controller = createController();

        //init check
        expect(scope.is_option_empty()).toEqual(true);
        expect(scope.option[price]).toEqual(undefined);//price is not allow to be null. thus, it does not have a default value
        expect(scope.option[crv]).toEqual(undefined);
        expect(scope.option[is_taxable]).toEqual(undefined);
        expect(scope.option[cost]).toEqual(undefined);
        expect(scope.option[is_sale_report]).toEqual(undefined);
        expect(scope.option[p_type]).toEqual(undefined);
        expect(scope.option[p_tag]).toEqual(undefined);
        expect(scope.option[vendor]).toEqual(undefined);
        expect(scope.option[buydown]).toEqual(undefined);
        expect(scope.option[value_customer_price]).toEqual(undefined);

        //price        
        scope.checkbox_click(price);
        expect(scope.option[price]).toEqual(undefined);//price is not allow to be null. thus, it does not have a default value
        //crv
        scope.checkbox_click(crv);
        expect(scope.option[crv]).toEqual(null);
        //is_taxable
        scope.checkbox_click(is_taxable);
        expect(scope.option[is_taxable]).toEqual(false);
        //cost
        scope.checkbox_click(cost);
        expect(scope.option[cost]).toEqual(null);
        //is_sale_report
        scope.checkbox_click(is_sale_report);
        expect(scope.option[is_sale_report]).toEqual(false);
        //p_type
        scope.checkbox_click(p_type);
        expect(scope.option[p_type]).toEqual(null);
        //p_tag
        scope.checkbox_click(p_tag);
        expect(scope.option[p_tag]).toEqual(null);
        //vendor
        scope.checkbox_click(vendor);
        expect(scope.option[vendor]).toEqual(null);
        //buydown
        scope.checkbox_click(buydown);
        expect(scope.option[buydown]).toEqual(null);
        //value_customer_price
        scope.checkbox_click(value_customer_price);
        expect(scope.option[value_customer_price]).toEqual(null);

        expect(scope.is_option_empty()).toEqual(false);
    }]))
})