var mod = angular.module('model.product')

mod.factory('model.product.Prod_sku_assoc',[function(){
    function Prod_sku_assoc(product_id,creator_id,store_lst,sku_str){
        this.product_id = product_id;
        this.creator_id = creator_id;
        this.store_lst = store_lst;
        this.sku_str = sku_str;
    }
    Prod_sku_assoc.build = function(raw_json){
        return new Prod_sku_assoc(
             raw_json.product_id
            ,raw_json.creator_id
            ,raw_json.store_set
            ,raw_json.sku_str
        );
    }
    return Prod_sku_assoc;
}]);