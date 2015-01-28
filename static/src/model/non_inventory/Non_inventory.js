var mod = angular.module('model.non_inventory');

mod.factory('model.non_inventory.Non_inventory',[function(){
    //CONSTRUCTOR
    function Non_inventory(
         name
        ,price
        ,is_taxable
        ,crv
        ,cost
    ){
        this.name = name;
        this.price = price;
        this.is_taxable = is_taxable;
        this.crv = crv;
        this.cost = cost;
    }
    Non_inventory.prototype = {
         constructor : Non_inventory
        ,get_b4_tax_price : function(){
            var result =  this.price + this.crv;
            return result;
        }
        ,get_product_tax : function(tax_rate){
            var result = 0.0;
            if(this.is_taxable){
                result = this.get_b4_tax_price() * tax_rate / 100.0
            }
            return result;
        }
        ,get_otd_price : function(tax_rate){
            return this.get_b4_tax_price() + this.get_product_tax(tax_rate);
        }
    }        

    return Non_inventory;
}]);  