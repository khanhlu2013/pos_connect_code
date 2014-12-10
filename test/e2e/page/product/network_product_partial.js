var base_path = './../../';
var lib = require(base_path + 'lib');

var Network_product_partial = function () {

    this.summary = {
         name_lbl : element(by.id('product/network_product/summary/name_lbl'))
        ,price_lbl : element(by.id('product/network_product/summary/price_lbl'))
        ,crv_lbl : element(by.id('product/network_product/summary/crv_lbl'))
        ,cost_lbl : element(by.id('product/network_product/summary/cost_lbl'))
        ,is_taxable :{
             sign_span : element(by.id('product/network_product/summary/is_taxable/sign_span'))
            ,percent_span : element(by.id('product/network_product/summary/is_taxable/percent_span'))
        }
    }
    var _detail_name_lst = element.all(by.repeater("name_stat in suggest_extra_name|orderBy:'-percent'"));
    var _detail_crv_lst = element.all(by.repeater("crv_stat in suggest_extra_crv|orderBy:'-percent'"));
    var _detail_cost_price_sale_lst = element.all(by.repeater("sp in network_product.get_sp_lst()|orderBy:'get_cost()'"));

    this.detail = {
        name : {
             lst : _detail_name_lst
            ,get_col : function(index,name){
                var col_index;
                if(name === 'name'){
                    col_index = 0; 
                }else if(name ==='percent'){
                    col_index = 1;
                }
                return _detail_name_lst.get(index).all(by.tagName('td')).get(col_index).getText();
            }
        }
        ,crv : {
             lst : _detail_crv_lst
            ,get_col : function(index,name){
                var col_index;
                if(name === 'crv'){
                    col_index = 0; 
                }else if(name ==='percent'){
                    col_index = 1;
                }
                return _detail_crv_lst.get(index).all(by.tagName('td')).get(col_index).getText();
            }
        }
        ,cost_price_sale : {
             lst : _detail_cost_price_sale_lst
            ,get_col : function(index,name){
                var col_index;
                if(name === 'sale'){
                    col_index = 2;
                    var defer = protractor.promise.defer();
                    _detail_cost_price_sale_lst.get(index).all(by.tagName('td')).get(col_index).isDisplayed().then(
                        function(is_display){
                            if(is_display){
                                _detail_cost_price_sale_lst.get(index).all(by.tagName('td')).get(col_index).getText().then(
                                    function(txt){
                                        defer.fulfill(txt);
                                    }
                                )
                            }else{
                                defer.fulfill(undefined);
                            }
                        }
                    )
                    return defer.promise;
                }else{
                    if(name === 'cost'){
                        col_index = 0; 
                    }else if(name ==='price'){
                        col_index = 1;
                    }
                    return _detail_cost_price_sale_lst.get(index).all(by.tagName('td')).get(col_index).getText();
                }
            }
        }        
    }
}

module.exports = new Network_product_partial();