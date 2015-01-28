var mod = angular.module('model.store_product');

mod.factory('model.store_product.Kit_breakdown_assoc',
[
    '$injector'
,function(
    $injector
){
    function Kit_breakdown_assoc(id,breakdown,qty){
        this.id = id;
        this.breakdown = breakdown;
        this.qty = qty;
    }
    Kit_breakdown_assoc.build = function(raw_json){
        var Store_product = $injector.get('model.store_product.Store_product')
        var breakdown = Store_product.build(raw_json.breakdown);

        return new Kit_breakdown_assoc(
            raw_json.id,
            breakdown,
            raw_json.qty
        );
    }
    return Kit_breakdown_assoc;
}]);